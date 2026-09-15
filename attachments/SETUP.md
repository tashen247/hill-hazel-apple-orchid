# whisper.cpp + Vulkan transcription pipeline (stages 1–3)

## 1. Build whisper.cpp with the Vulkan backend

Vulkan is the right backend on an AMD APU with unified memory: it works on Windows
and Linux, needs no ROCm install, and doesn't care that the "VRAM" is shared.

```bash
# Linux: need the Vulkan SDK headers + loader
sudo apt install libvulkan-dev glslc            # or vulkan-headers/shaderc on Fedora/Arch
# Windows: install the LunarG Vulkan SDK, then build from a VS dev prompt

git clone https://github.com/ggml-org/whisper.cpp
cd whisper.cpp
cmake -B build -DGGML_VULKAN=1 -DCMAKE_BUILD_TYPE=Release
cmake --build build -j --config Release
```

Verify the GPU is actually picked up — you want a `ggml_vulkan: Found 1 Vulkan
devices: <your APU>` line at startup. If it says `using CPU backend`, the build
didn't pick up Vulkan and you'll get ~4× the latency.

## 2. Get a model

```bash
./models/download-ggml-model.sh large-v3-turbo
./build/bin/quantize models/ggml-large-v3-turbo.bin \
                     models/ggml-large-v3-turbo-q5_0.bin q5_0
```

`large-v3-turbo` at q5_0 is ~570MB and is the sweet spot for Dutch — `medium`
loses noticeably more on accented or fast speech, and full `large-v3` is ~3×
slower for a marginal gain. Turbo is encoder-heavy/decoder-light, which is
exactly the shape you want for short chunks.

## 3. Run the server

```bash
./build/bin/whisper-server \
  -m models/ggml-large-v3-turbo-q5_0.bin \
  -l nl -t 8 --no-timestamps \
  --host 127.0.0.1 --port 8178
```

Keep it resident — model load is 1–2s and you do not want that per utterance.

## 4. Python side

```bash
pip install sounddevice numpy requests silero-vad
python listen.py --list          # find your device
```

**Routing the interviewer's audio in (stage 1):**

- **Windows** — `python listen.py --loopback --device "Speakers (Realtek)"`.
  WASAPI loopback captures what an *output* device is playing, so no virtual
  cable is needed at all. VB-Cable is only necessary if you want to isolate one
  app's audio from the rest of the system.
- **Linux** — PulseAudio/PipeWire exposes every sink as a `.monitor` source:
  `python listen.py --device "alsa_output.pci-0000_00_1f.3.analog-stereo.monitor"`
- **macOS** — install BlackHole, make a Multi-Output Device so you still hear
  the call, then `--device "BlackHole 2ch"`.

Either way your own mic never enters this path, which is what you want — you
don't need captions for your own speech, and mic audio doubles the transcription
load for nothing.

```bash
python listen.py --loopback --device "Speakers"
{"t": 4.12, "dur": 2.80, "text": "Kun je iets vertellen over je ervaring met .NET?"}
```

## Tuning notes

- `--min-silence-ms` is the single biggest latency lever. 400ms is a good
  default; below ~300ms you start cutting people off mid-sentence at natural
  pauses, above ~600ms the captions visibly lag.
- The 320ms pre-roll buffer matters more than it looks. Silero fires *after*
  speech onset, so without it you lose the first syllable of every utterance —
  and in Dutch that's often the verb.
- `MAX_UTTERANCE_S = 10` force-flushes long answers. If someone talks for 40
  seconds uninterrupted you'd otherwise see nothing until they stop.
- The `drop` set filters Whisper's silence hallucinations. `ondertiteling door
  de amara.org gemeenschap` is the Dutch one and it is *relentless* — it's a
  subtitle credit that appears throughout Whisper's Dutch training data.
- A `queue.Queue(maxsize=4)` in front of the transcriber means that if you fall
  behind you drop the oldest audio rather than accumulating unbounded lag. For
  a live view, being 2 seconds behind and lossy beats being 30 seconds behind
  and complete.

## What's not here

Stage 4–6. The contract is the JSON-lines stream on stdout: a FastAPI process
reads it, feeds each line to whatever does the Dutch→Afrikaans step, and pushes
to the UI over a WebSocket. Keeping stages 1–3 as a separate process is
deliberate — the audio callback is real-time-sensitive and you don't want it
sharing an event loop with HTTP handlers.
