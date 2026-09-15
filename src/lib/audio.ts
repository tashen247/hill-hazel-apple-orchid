import { clamp } from "./utils";

const TARGET_RATE = 16000;

export type VadConfig = {
  threshold: number;
  minMs: number;
  maxMs: number;
  hangoverMs: number;
};

export type AudioHandlers = {
  onLevel: (rms: number, speaking: boolean) => void;
  onChunk: (wavBase64: string, durationMs: number) => void;
  onStream: (stream: MediaStream, kind: "mic" | "display") => void;
  onStop: () => void;
  onError: (message: string) => void;
};

function writeString(view: DataView, offset: number, str: string) {
  for (let i = 0; i < str.length; i++) view.setUint8(offset + i, str.charCodeAt(i));
}

export function encodeWav(samples: Float32Array, sampleRate: number): ArrayBuffer {
  const n = samples.length;
  const buffer = new ArrayBuffer(44 + n * 2);
  const view = new DataView(buffer);
  writeString(view, 0, "RIFF");
  view.setUint32(4, 36 + n * 2, true);
  writeString(view, 8, "WAVE");
  writeString(view, 12, "fmt ");
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, 1, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * 2, true);
  view.setUint16(32, 2, true);
  view.setUint16(34, 16, true);
  writeString(view, 36, "data");
  view.setUint32(40, n * 2, true);
  let offset = 44;
  for (let i = 0; i < n; i++, offset += 2) {
    const s = clamp(samples[i] ?? 0, -1, 1);
    view.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7fff, true);
  }
  return buffer;
}

export function downsample(input: Float32Array, inRate: number, outRate = TARGET_RATE) {
  if (outRate === inRate) return input;
  const ratio = inRate / outRate;
  const outLen = Math.floor(input.length / ratio);
  const out = new Float32Array(outLen);
  for (let i = 0; i < outLen; i++) {
    const start = Math.floor(i * ratio);
    const end = Math.min(input.length, Math.floor((i + 1) * ratio));
    let sum = 0;
    for (let j = start; j < end; j++) sum += input[j] ?? 0;
    out[i] = sum / Math.max(1, end - start);
  }
  return out;
}

export function wavToBase64(buf: ArrayBuffer) {
  const bytes = new Uint8Array(buf);
  const chunk = 0x8000;
  let binary = "";
  for (let i = 0; i < bytes.length; i += chunk) {
    binary += String.fromCharCode(...bytes.subarray(i, i + chunk));
  }
  return btoa(binary);
}

type Live = {
  stream: MediaStream;
  ctx: AudioContext;
  processor: ScriptProcessorNode;
  analyser: AnalyserNode;
  raf: number;
  speaking: boolean;
  speechSamples: number[];
  preroll: number[];
  silenceMs: number;
  speechMs: number;
};

let live: Live | null = null;

function rmsOf(buf: Float32Array) {
  let sum = 0;
  for (let i = 0; i < buf.length; i++) {
    const v = buf[i] ?? 0;
    sum += v * v;
  }
  return Math.sqrt(sum / Math.max(1, buf.length));
}

function flushSpeech(samples: number[], sampleRate: number, handlers: AudioHandlers) {
  if (samples.length < sampleRate * 0.4) return;
  const raw = Float32Array.from(samples);
  const down = downsample(raw, sampleRate, TARGET_RATE);
  const wav = encodeWav(down, TARGET_RATE);
  handlers.onChunk(wavToBase64(wav), (down.length / TARGET_RATE) * 1000);
}

export async function startCapture(
  kind: "mic" | "display",
  config: VadConfig,
  handlers: AudioHandlers,
) {
  stopCapture();

  let stream: MediaStream;
  try {
    if (kind === "display") {
      stream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: true,
      });
      if (stream.getAudioTracks().length === 0) {
        stream.getTracks().forEach((t) => t.stop());
        handlers.onError("No audio on that share. Choose a tab with sound, or use the microphone.");
        return;
      }
    } else {
      stream = await navigator.mediaDevices.getUserMedia({
        audio: { echoCancellation: true, noiseSuppression: true, channelCount: 1 },
        video: false,
      });
    }
  } catch {
    handlers.onError(kind === "display" ? "Share was cancelled." : "Microphone permission denied.");
    return;
  }

  const ctx = new AudioContext();
  const source = ctx.createMediaStreamSource(stream);
  const analyser = ctx.createAnalyser();
  analyser.fftSize = 1024;
  analyser.smoothingTimeConstant = 0.65;
  const processor = ctx.createScriptProcessor(4096, 1, 1);
  const mute = ctx.createGain();
  mute.gain.value = 0;

  source.connect(analyser);
  analyser.connect(processor);
  processor.connect(mute);
  mute.connect(ctx.destination);

  const prerollMax = Math.floor(ctx.sampleRate * 0.25);

  live = {
    stream,
    ctx,
    processor,
    analyser,
    raf: 0,
    speaking: false,
    speechSamples: [],
    preroll: [],
    silenceMs: 0,
    speechMs: 0,
  };

  processor.onaudioprocess = (ev) => {
    const current = live;
    if (!current) return;
    const input = ev.inputBuffer.getChannelData(0);
    const rms = rmsOf(input);
    const frameMs = (input.length / ctx.sampleRate) * 1000;

    if (!current.speaking) {
      current.preroll.push(...input);
      if (current.preroll.length > prerollMax) {
        current.preroll.splice(0, current.preroll.length - prerollMax);
      }
    }

    if (rms >= config.threshold) {
      current.silenceMs = 0;
      if (!current.speaking) {
        current.speaking = true;
        current.speechSamples = current.preroll.slice();
        current.speechMs = 0;
      }
      current.speechSamples.push(...input);
      current.speechMs += frameMs;
      if (current.speechMs >= config.maxMs) {
        flushSpeech(current.speechSamples, ctx.sampleRate, handlers);
        current.speaking = false;
        current.speechSamples = [];
        current.speechMs = 0;
      }
    } else if (current.speaking) {
      current.silenceMs += frameMs;
      current.speechSamples.push(...input);
      current.speechMs += frameMs;
      if (current.silenceMs >= config.hangoverMs || current.speechMs >= config.maxMs) {
        if (current.speechMs >= config.minMs) {
          flushSpeech(current.speechSamples, ctx.sampleRate, handlers);
        }
        current.speaking = false;
        current.speechSamples = [];
        current.speechMs = 0;
        current.silenceMs = 0;
      }
    }

    handlers.onLevel(rms, current.speaking);
  };

  const onEnded = () => stopCapture();
  stream.getTracks().forEach((t) => t.addEventListener("ended", onEnded));

  handlers.onStream(stream, kind);
}

export function stopCapture() {
  if (!live) return;
  cancelAnimationFrame(live.raf);
  try {
    live.processor.disconnect();
    live.analyser.disconnect();
    void live.ctx.close();
  } catch {
    /* already closed */
  }
  live.stream.getTracks().forEach((t) => t.stop());
  live = null;
}

export function getAnalyser() {
  return live?.analyser ?? null;
}

export function isCapturing() {
  return live !== null;
}
