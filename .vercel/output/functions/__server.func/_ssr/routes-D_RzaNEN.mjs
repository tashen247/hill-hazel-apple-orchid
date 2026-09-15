import { i as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { n as TSS_SERVER_FUNCTION, r as getServerFnById, t as createServerFn } from "./ssr.mjs";
import { a as Mic, i as MonitorUp, n as Square, r as PictureInPicture2 } from "../_libs/lucide-react.mjs";
import { t as require_client } from "../_libs/react-dom+scheduler.mjs";
import { n as clsx, t as cva } from "../_libs/class-variance-authority+clsx.mjs";
import { t as twMerge } from "../_libs/tailwind-merge.mjs";
import { n as SwitchThumb, t as Switch$1 } from "../_libs/@radix-ui/react-switch+[...].mjs";
import { t as create } from "../_libs/zustand.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-D_RzaNEN.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var import_client = require_client();
function cn(...inputs) {
	return twMerge(clsx(inputs));
}
function uid() {
	return Math.random().toString(36).slice(2, 10);
}
function clamp(n, min, max) {
	return Math.min(max, Math.max(min, n));
}
function useRevealed(text, thinking) {
	const [shown, setShown] = (0, import_react.useState)(text);
	(0, import_react.useEffect)(() => {
		if (!text) {
			setShown("");
			return;
		}
		if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || thinking) {
			setShown(text);
			return;
		}
		const words = text.split(/\s+/);
		let i = 0;
		setShown("");
		const id = window.setInterval(() => {
			i += 1;
			setShown(words.slice(0, i).join(" "));
			if (i >= words.length) window.clearInterval(id);
		}, 28);
		return () => window.clearInterval(id);
	}, [text, thinking]);
	return shown;
}
function OverlayHud({ nl, af, mode, live, thinking, onPopOut, compact }) {
	const shown = useRevealed(af, thinking);
	const stealth = mode === "stealth";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: cn("pointer-events-auto relative border border-border bg-bg/95 text-fg shadow-[0_12px_40px_rgba(0,0,0,0.35)]", mode === "caption" || stealth ? "rounded-lg px-4 py-3" : "rounded-xl px-5 py-3.5", stealth && "max-w-md bg-bg", compact && "max-w-none"),
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-2 flex items-center justify-between gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: cn("size-1.5 rounded-full bg-border", live && "bg-live live-pulse", thinking && "bg-wait lamp-pulse") }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-mono text-xs uppercase tracking-widest text-subtle",
							children: thinking ? "Tolking" : live ? "Live" : "Fluister"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-mono text-xs text-subtle",
							children: "NL → AF"
						})
					]
				}), onPopOut && !compact ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: onPopOut,
					className: "inline-flex size-9 items-center justify-center rounded-sm text-muted transition-colors duration-150 hover:bg-surface hover:text-fg",
					"aria-label": "Pop out overlay",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PictureInPicture2, {
						className: "size-4",
						strokeWidth: 1.75
					})
				}) : null]
			}),
			thinking && !af ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "font-display text-xl italic leading-snug text-muted",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "shimmer bg-clip-text text-transparent",
					children: "Wag op Afrikaans…"
				})
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: cn("font-display italic leading-snug text-fg", stealth ? "text-base md:text-lg" : "text-lg md:text-xl"),
				children: shown || "Wag vir Nederlandse spraak."
			}),
			!stealth && nl ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-3 max-w-prose text-xs leading-relaxed text-muted",
				children: nl
			}) : null
		]
	});
}
function Tile({ label, tag, live, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: cn("relative min-h-40 overflow-hidden rounded-lg border border-border bg-bg-elevated md:min-h-64", live && "ring-1 ring-live/50"),
		children: [
			children,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "pointer-events-none absolute inset-0 tile-vignette" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "absolute left-3 top-3 flex items-center gap-2",
				children: [
					live ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "size-1.5 rounded-full bg-live live-pulse" }) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-mono text-xs uppercase tracking-wider text-muted",
						children: tag
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-sm text-fg",
						children: label
					})
				]
			})
		]
	});
}
function Face({ initials, active }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "absolute inset-0 grid place-items-center",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: cn("grid size-20 place-items-center rounded-full border border-border bg-surface font-display text-2xl text-muted", active && "border-live/40 text-fg"),
			children: initials
		})
	});
}
function VideoFill({ stream }) {
	const ref = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => {
		const el = ref.current;
		if (!el) return;
		el.srcObject = stream;
		el.play().catch(() => {});
		return () => {
			el.srcObject = null;
		};
	}, [stream]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("video", {
		ref,
		className: "absolute inset-0 size-full object-cover",
		muted: true,
		playsInline: true,
		autoPlay: true
	});
}
function CallStage({ nl, af, mode, live, thinking, speaking, feedStream, onPopOut }) {
	const hasVideo = Boolean(feedStream?.getVideoTracks().length);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "relative overflow-hidden rounded-xl border border-border bg-bg-elevated p-2 md:p-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid grid-cols-2 gap-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tile, {
				label: "Onderhoudvoerder",
				tag: "System",
				live: speaking || live,
				children: hasVideo && feedStream ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(VideoFill, { stream: feedStream }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Face, {
					initials: "NL",
					active: speaking
				})
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tile, {
				label: "Jy",
				tag: "Mic",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Face, { initials: "AF" })
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "relative z-10 mt-2 md:pointer-events-none md:absolute md:inset-x-5 md:bottom-3 md:mt-0",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(OverlayHud, {
				nl,
				af,
				mode,
				live,
				thinking,
				onPopOut
			})
		})]
	});
}
var MACHINE = {
	name: "Ryzen AI Max+ 395",
	codename: "Strix Halo",
	memoryGb: 128,
	cpu: "16× Zen 5",
	gpu: "Radeon 8060S · 40 CU RDNA 3.5",
	verdict: "Yes. This pipeline is comfortably in budget."
};
var FAST_PROFILE = [
	{
		id: "os",
		label: "OS + desktop + browser",
		gb: 16,
		tone: "os"
	},
	{
		id: "stt",
		label: "whisper.cpp large-v3-turbo",
		gb: 2,
		tone: "stt"
	},
	{
		id: "llm",
		label: "Qwen2.5-14B Q5_K_M",
		gb: 10,
		tone: "llm"
	},
	{
		id: "kv",
		label: "KV cache + runtime",
		gb: 4,
		tone: "kv"
	},
	{
		id: "free",
		label: "Headroom",
		gb: 96,
		tone: "free"
	}
];
var QUALITY_PROFILE = [
	{
		id: "os",
		label: "OS + desktop + browser",
		gb: 16,
		tone: "os"
	},
	{
		id: "stt",
		label: "whisper.cpp large-v3",
		gb: 3,
		tone: "stt"
	},
	{
		id: "llm",
		label: "Qwen2.5-32B Q5_K_M",
		gb: 23,
		tone: "llm"
	},
	{
		id: "kv",
		label: "KV cache 8k",
		gb: 6,
		tone: "kv"
	},
	{
		id: "free",
		label: "Headroom",
		gb: 80,
		tone: "free"
	}
];
var PIPELINE_STAGES = [
	{
		id: "route",
		step: "01",
		title: "Audio routing",
		detail: "Tab audio or mic in. On the 395, a Pulse/PipeWire monitor replaces the virtual cable."
	},
	{
		id: "vad",
		step: "02",
		title: "VAD & buffer",
		detail: "Energy VAD here; Silero on-device. Drops silence, flushes 2–3 s speech."
	},
	{
		id: "stt",
		step: "03",
		title: "Transcription",
		detail: "Cloud STT in this HUD. Local: whisper.cpp on the iGPU — Faster-Whisper is CUDA-first."
	},
	{
		id: "orch",
		step: "04",
		title: "Orchestration",
		detail: "Wraps the Dutch with your interview prompt. One in-flight turn at a time."
	},
	{
		id: "llm",
		step: "05",
		title: "Interpreter",
		detail: "Grok in the cloud, or Ollama Qwen on the 395. Streams Afrikaans only."
	},
	{
		id: "hud",
		step: "06",
		title: "Overlay HUD",
		detail: "Frameless caption bar. Pop-out for always-on-top. Desktop wrappers can exclude capture."
	}
];
function Bar({ slices }) {
	const total = slices.reduce((a, s) => a + s.gb, 0);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex h-3 overflow-hidden rounded-full border border-border",
		children: slices.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			title: `${s.label} · ${s.gb} GB`,
			style: { width: `${s.gb / total * 100}%` },
			className: cn(s.tone === "os" && "bg-border", s.tone === "stt" && "bg-muted", s.tone === "llm" && "bg-accent", s.tone === "kv" && "bg-wait/80", s.tone === "free" && "bg-hot/70")
		}, s.id))
	});
}
function Profile({ title, slices }) {
	const used = slices.filter((s) => s.tone !== "free").reduce((a, s) => a + s.gb, 0);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-3",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-baseline justify-between gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm font-medium",
					children: title
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "font-mono text-xs tabular-nums text-muted",
					children: [used, " / 128 GB"]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bar, { slices }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "space-y-1.5",
				children: slices.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: "flex items-center justify-between gap-3 text-xs text-muted",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: cn("size-1.5 rounded-full", s.tone === "os" && "bg-border", s.tone === "stt" && "bg-muted", s.tone === "llm" && "bg-accent", s.tone === "kv" && "bg-wait", s.tone === "free" && "bg-hot") }), s.label]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "font-mono tabular-nums",
						children: [s.gb, " GB"]
					})]
				}, s.id))
			})
		]
	});
}
function MachineCard() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "rounded-xl border border-border bg-bg-elevated p-5",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "font-mono text-xs uppercase tracking-widest text-subtle",
				children: "Machine"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "mt-2 font-display text-2xl italic leading-tight text-fg",
				children: MACHINE.name
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-1 text-sm text-muted",
				children: [
					MACHINE.codename,
					" · ",
					MACHINE.cpu,
					" · ",
					MACHINE.gpu
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-4 text-sm leading-relaxed text-fg",
				children: MACHINE.verdict
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-sm leading-relaxed text-muted",
				children: "128 GB unified memory makes Qwen 14B a rounding error. Faster-Whisper is CUDA-first — on this APU use whisper.cpp (Vulkan or ROCm) plus Ollama. After speech ends, expect about 1–1.5 s to Afrikaans."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-6 space-y-8",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Profile, {
					title: "Fast HUD · 14B",
					slices: FAST_PROFILE
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Profile, {
					title: "Quality HUD · 32B",
					slices: QUALITY_PROFILE
				})]
			})
		]
	});
}
var LABEL = {
	idle: "Idle",
	ready: "Ready",
	hot: "Live",
	wait: "Wait",
	err: "Error"
};
function Lamp({ state }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: cn("size-2 shrink-0 rounded-full", state === "idle" && "bg-border", state === "ready" && "bg-accent/70", state === "hot" && "bg-live lamp-pulse", state === "wait" && "bg-wait lamp-pulse", state === "err" && "bg-live"),
		"aria-hidden": "true"
	});
}
function PipelineRail({ stages }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
		className: "flex flex-col gap-1",
		children: PIPELINE_STAGES.map((stage, i) => {
			const state = stages[stage.id];
			return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
				className: cn("rounded-lg border border-transparent px-3 py-3", state === "hot" || state === "wait" ? "border-border bg-surface" : "hover:bg-bg-elevated"),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "w-6 font-mono text-xs text-subtle tabular-nums",
							children: stage.step
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lamp, { state }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "min-w-0 flex-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-baseline justify-between gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-sm font-medium text-fg",
									children: stage.title
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-mono text-xs uppercase tracking-wider text-subtle",
									children: LABEL[state]
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 hidden text-xs leading-snug text-muted lg:block",
								children: stage.detail
							})]
						})
					]
				}), i < PIPELINE_STAGES.length - 1 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "ml-11 mt-2 hidden h-3 w-px bg-border lg:block",
					"aria-hidden": "true"
				}) : null]
			}, stage.id);
		})
	});
}
function PipelineStrip({ stages }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
		className: "flex items-center justify-between gap-1",
		children: PIPELINE_STAGES.map((stage) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
			className: "flex flex-col items-center gap-1.5",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lamp, { state: stages[stage.id] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "font-mono text-xs uppercase tracking-wider text-subtle",
				children: stage.step
			})]
		}, stage.id))
	});
}
var buttonVariants = cva("inline-flex items-center justify-center gap-2 font-medium tracking-tight transition-[opacity,transform,background-color,color,border-color] duration-150 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50 disabled:pointer-events-none disabled:opacity-40 active:not-disabled:scale-[0.96]", {
	variants: {
		variant: {
			primary: "bg-accent text-accent-fg hover:opacity-90",
			secondary: "border border-border bg-surface text-fg hover:border-muted/40",
			ghost: "text-muted hover:bg-surface hover:text-fg",
			live: "bg-live text-fg hover:opacity-90"
		},
		size: {
			md: "h-11 rounded-md px-4 text-sm",
			sm: "h-9 rounded-sm px-3 text-sm",
			icon: "size-11 rounded-md"
		}
	},
	defaultVariants: {
		variant: "primary",
		size: "md"
	}
});
function Button({ className, variant, size, type = "button", ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		type,
		className: cn(buttonVariants({
			variant,
			size
		}), className),
		...props
	});
}
function Switch({ checked, onCheckedChange, id, disabled }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch$1, {
		id,
		checked,
		onCheckedChange,
		disabled,
		className: cn("relative h-6 w-11 shrink-0 rounded-full border border-border", "bg-bg-elevated transition-colors duration-150", "data-[state=checked]:bg-accent data-[state=checked]:border-accent", "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50", "disabled:opacity-40"),
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SwitchThumb, { className: cn("block size-5 translate-x-0.5 rounded-full bg-muted", "transition-transform duration-150 ease-out", "data-[state=checked]:translate-x-5 data-[state=checked]:bg-accent-fg") })
	});
}
var TARGET_RATE = 16e3;
function writeString(view, offset, str) {
	for (let i = 0; i < str.length; i++) view.setUint8(offset + i, str.charCodeAt(i));
}
function encodeWav(samples, sampleRate) {
	const n = samples.length;
	const buffer = /* @__PURE__ */ new ArrayBuffer(44 + n * 2);
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
		view.setInt16(offset, s < 0 ? s * 32768 : s * 32767, true);
	}
	return buffer;
}
function downsample(input, inRate, outRate = TARGET_RATE) {
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
function wavToBase64(buf) {
	const bytes = new Uint8Array(buf);
	const chunk = 32768;
	let binary = "";
	for (let i = 0; i < bytes.length; i += chunk) binary += String.fromCharCode(...bytes.subarray(i, i + chunk));
	return btoa(binary);
}
var live = null;
function rmsOf(buf) {
	let sum = 0;
	for (let i = 0; i < buf.length; i++) {
		const v = buf[i] ?? 0;
		sum += v * v;
	}
	return Math.sqrt(sum / Math.max(1, buf.length));
}
function flushSpeech(samples, sampleRate, handlers) {
	if (samples.length < sampleRate * .4) return;
	const down = downsample(Float32Array.from(samples), sampleRate, TARGET_RATE);
	const wav = encodeWav(down, TARGET_RATE);
	handlers.onChunk(wavToBase64(wav), down.length / TARGET_RATE * 1e3);
}
async function startCapture(kind, config, handlers) {
	stopCapture();
	let stream;
	try {
		if (kind === "display") {
			stream = await navigator.mediaDevices.getDisplayMedia({
				video: true,
				audio: true
			});
			if (stream.getAudioTracks().length === 0) {
				stream.getTracks().forEach((t) => t.stop());
				handlers.onError("No audio on that share. Choose a tab with sound, or use the microphone.");
				return;
			}
		} else stream = await navigator.mediaDevices.getUserMedia({
			audio: {
				echoCancellation: true,
				noiseSuppression: true,
				channelCount: 1
			},
			video: false
		});
	} catch {
		handlers.onError(kind === "display" ? "Share was cancelled." : "Microphone permission denied.");
		return;
	}
	const ctx = new AudioContext();
	const source = ctx.createMediaStreamSource(stream);
	const analyser = ctx.createAnalyser();
	analyser.fftSize = 1024;
	analyser.smoothingTimeConstant = .65;
	const processor = ctx.createScriptProcessor(4096, 1, 1);
	const mute = ctx.createGain();
	mute.gain.value = 0;
	source.connect(analyser);
	analyser.connect(processor);
	processor.connect(mute);
	mute.connect(ctx.destination);
	const prerollMax = Math.floor(ctx.sampleRate * .25);
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
		speechMs: 0
	};
	processor.onaudioprocess = (ev) => {
		const current = live;
		if (!current) return;
		const input = ev.inputBuffer.getChannelData(0);
		const rms = rmsOf(input);
		const frameMs = input.length / ctx.sampleRate * 1e3;
		if (!current.speaking) {
			current.preroll.push(...input);
			if (current.preroll.length > prerollMax) current.preroll.splice(0, current.preroll.length - prerollMax);
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
				if (current.speechMs >= config.minMs) flushSpeech(current.speechSamples, ctx.sampleRate, handlers);
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
function stopCapture() {
	if (!live) return;
	cancelAnimationFrame(live.raf);
	try {
		live.processor.disconnect();
		live.analyser.disconnect();
		live.ctx.close();
	} catch {}
	live.stream.getTracks().forEach((t) => t.stop());
	live = null;
}
function getAnalyser() {
	return live?.analyser ?? null;
}
var BINS = 40;
function Waveform({ level, speaking, active }) {
	const [bars, setBars] = (0, import_react.useState)(() => Array.from({ length: BINS }, () => .08));
	const mockRef = (0, import_react.useRef)(Array.from({ length: BINS }, () => .08));
	(0, import_react.useEffect)(() => {
		const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
		let raf = 0;
		let alive = true;
		let last = 0;
		const tick = (now) => {
			if (now - last < 50) {
				if (!reduced && alive) raf = requestAnimationFrame(tick);
				return;
			}
			last = now;
			const analyser = getAnalyser();
			const next = new Array(BINS);
			if (analyser && active) {
				const data = new Uint8Array(analyser.fftSize);
				analyser.getByteTimeDomainData(data);
				const step = Math.floor(data.length / BINS);
				for (let i = 0; i < BINS; i++) {
					const v = data[i * step] ?? 128;
					next[i] = Math.min(1, Math.abs(v - 128) / 48);
				}
			} else {
				const mock = mockRef.current;
				for (let i = 0; i < BINS; i++) {
					const shape = .35 + i * 17 % 10 / 18;
					const target = speaking ? (.26 + Math.min(.35, level * 8)) * shape : active ? .1 * shape : .08;
					mock[i] = (mock[i] ?? .08) * .82 + target * .18;
					next[i] = mock[i] ?? .08;
				}
			}
			if (alive) setBars(next);
			if (!reduced && alive) raf = requestAnimationFrame(tick);
		};
		tick(performance.now());
		return () => {
			alive = false;
			cancelAnimationFrame(raf);
		};
	}, [
		active,
		level,
		speaking
	]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex h-12 w-full items-center gap-0.5",
		"aria-hidden": "true",
		children: bars.map((mag, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: cn("inline-block w-full rounded-full origin-center", mag > .16 ? speaking ? "bg-live" : "bg-accent" : "bg-border"),
			style: {
				height: `${Math.max(20, mag * 100)}%`,
				opacity: mag > .16 ? .95 : .75
			}
		}, i))
	});
}
var createSsrRpc = (functionId) => {
	const url = "/_serverFn/" + functionId;
	const serverFnMeta = { id: functionId };
	const fn = async (...args) => {
		return (await getServerFnById(functionId, { origin: "server" }))(...args);
	};
	return Object.assign(fn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
var getAiStatus = createServerFn({ method: "POST" }).handler(createSsrRpc("f55d85520203b0ca68806b32dd775d224e89e7dbf6a1371fbfe6857a9f8e3df4"));
var translateTurn = createServerFn({ method: "POST" }).validator((input) => {
	const dutch = input.dutch.trim().slice(0, 1200);
	const context = input.context.trim().slice(0, 400);
	if (!dutch) throw new Error("Empty transcript");
	return {
		dutch,
		context
	};
}).handler(createSsrRpc("10118e9a9b2b4c2c1d1c7075fa722adb162d85155d9275a0dd2d7ee540a93c43"));
var transcribeChunk = createServerFn({ method: "POST" }).validator((input) => {
	const wavBase64 = input.wavBase64.trim();
	if (!wavBase64) throw new Error("Empty audio");
	if (wavBase64.length > 9e5) throw new Error("Audio chunk too large");
	return { wavBase64 };
}).handler(createSsrRpc("7af1eb60acda78dcf6b340c8addbd33bcede597c6c2f603d66f82eacccd4e27c"));
var REHEARSAL = [
	{
		nl: "Goedemorgen, fijn dat je er bent. Kun je jezelf kort voorstellen en vertellen waarom je op deze rol reageert?",
		afFallback: "Goeiemôre, fyn dat jy hier is. Kan jy jouself kortliks voorstel en sê hoekom jy op hierdie rol reageer?"
	},
	{
		nl: "We zien dat je lokaal wilt draaien. Hoe benut je 128 gigabyte unified memory op een Ryzen AI Max 395?",
		afFallback: "Ons sien jy wil plaaslik hardloop. Hoe benut jy 128 gigagreep unified memory op 'n Ryzen AI Max 395?"
	},
	{
		nl: "Faster-Whisper is vooral voor CUDA gebouwd. Wat is je plan op ROCm als CTranslate2 hapert?",
		afFallback: "Faster-Whisper is meestal vir CUDA gebou. Wat is jou plan op ROCm as CTranslate2 hakkel?"
	},
	{
		nl: "De interviewer praat in bursts van twee tot drie seconden. Hoe houd je de end-to-end latency onder de twee seconden?",
		afFallback: "Die onderhoudvoerder praat in stote van twee tot drie sekondes. Hoe hou jy die end-to-end latency onder twee sekondes?"
	},
	{
		nl: "Waarom Qwen 14B en niet een groter model? Afrikaans is een lagere-resource taal.",
		afFallback: "Hoekom Qwen 14B en nie 'n groter model nie? Afrikaans is 'n laer-hulpbron taal."
	},
	{
		nl: "Laatste vraag: hoe voorkom je dat jouw overlay in een schermdeling terechtkomt?",
		afFallback: "Laaste vraag: hoe voorkom jy dat jou oorleg in 'n skermdeling beland?"
	}
];
var IDLE_STAGES = {
	route: "idle",
	vad: "idle",
	stt: "idle",
	orch: "idle",
	llm: "idle",
	hud: "idle"
};
var SETTINGS_KEY = "fluister-settings";
var DEFAULT_SETTINGS = {
	engine: "cloud",
	ollamaUrl: "http://127.0.0.1:11434",
	ollamaModel: "qwen2.5:14b",
	context: "Technical interview. Candidate is targeting AMD Ryzen AI Max hardware. Keep product names.",
	hudMode: "studio",
	chunkMs: 2500,
	vad: "med"
};
var VAD_THRESH = {
	low: .01,
	med: .018,
	high: .03
};
function loadSettings() {
	if (typeof window === "undefined") return DEFAULT_SETTINGS;
	try {
		const raw = localStorage.getItem(SETTINGS_KEY);
		if (!raw) return DEFAULT_SETTINGS;
		return {
			...DEFAULT_SETTINGS,
			...JSON.parse(raw)
		};
	} catch {
		return DEFAULT_SETTINGS;
	}
}
function vadConfig(s) {
	return {
		threshold: VAD_THRESH[s.vad],
		minMs: 700,
		maxMs: s.chunkMs,
		hangoverMs: 420
	};
}
async function translateOllama(dutch, settings) {
	const res = await fetch(`${settings.ollamaUrl.replace(/\/$/, "")}/v1/chat/completions`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({
			model: settings.ollamaModel,
			temperature: .2,
			max_tokens: 180,
			messages: [{
				role: "system",
				content: "Translate Dutch interview speech into natural spoken Afrikaans. Output only the Afrikaans."
			}, {
				role: "user",
				content: settings.context ? `Candidate context: ${settings.context}\n\nDutch:\n${dutch}` : dutch
			}]
		})
	});
	if (!res.ok) throw new Error(`Ollama ${res.status}`);
	const text = (await res.json()).choices?.[0]?.message?.content?.trim();
	if (!text) throw new Error("Empty Ollama reply");
	return text;
}
async function interpret(dutch, get) {
	const s = get();
	if (s.engine === "ollama") try {
		return await translateOllama(dutch, s);
	} catch {}
	const res = await translateTurn({ data: {
		dutch,
		context: s.context
	} });
	if (!res.ok) throw new Error(res.error);
	return res.text;
}
var sleep = (ms) => new Promise((r) => setTimeout(r, ms));
var useFluister = create((set, get) => ({
	...DEFAULT_SETTINGS,
	hydrated: false,
	aiAvailable: false,
	run: "idle",
	feed: null,
	feedStream: null,
	stages: { ...IDLE_STAGES },
	level: 0,
	speaking: false,
	currentNl: "",
	currentAf: "",
	turns: [],
	lastMs: 0,
	error: null,
	translating: false,
	pipOpen: false,
	typed: "",
	hydrate: () => {
		if (get().hydrated) return;
		set({
			...loadSettings(),
			hydrated: true
		});
	},
	probeAi: async () => {
		try {
			const { available } = await getAiStatus();
			set({ aiAvailable: available });
		} catch {
			set({ aiAvailable: false });
		}
	},
	patch: (partial) => {
		set(partial);
		const s = get();
		const next = {
			engine: s.engine,
			ollamaUrl: s.ollamaUrl,
			ollamaModel: s.ollamaModel,
			context: s.context,
			hudMode: s.hudMode,
			chunkMs: s.chunkMs,
			vad: s.vad
		};
		try {
			localStorage.setItem(SETTINGS_KEY, JSON.stringify(next));
		} catch {}
	},
	setTyped: (typed) => set({ typed }),
	setPipOpen: (pipOpen) => set({ pipOpen }),
	startRehearsal: async () => {
		if (get().run !== "idle") return;
		set({
			run: "rehearsal",
			error: null,
			currentNl: "",
			currentAf: "",
			turns: [],
			stages: {
				...IDLE_STAGES,
				route: "ready",
				hud: "ready"
			}
		});
		for (const beat of REHEARSAL) {
			if (get().run !== "rehearsal") return;
			set({
				speaking: true,
				stages: {
					route: "ready",
					vad: "hot",
					stt: "idle",
					orch: "idle",
					llm: "idle",
					hud: "ready"
				},
				currentNl: "",
				currentAf: ""
			});
			await sleep(480);
			if (get().run !== "rehearsal") return;
			set({
				stages: {
					...get().stages,
					vad: "wait",
					stt: "hot"
				},
				speaking: false
			});
			await sleep(320);
			if (get().run !== "rehearsal") return;
			set({
				currentNl: beat.nl,
				stages: {
					...get().stages,
					stt: "ready",
					orch: "hot"
				}
			});
			await sleep(180);
			if (get().run !== "rehearsal") return;
			set({
				stages: {
					...get().stages,
					orch: "ready",
					llm: "wait"
				},
				translating: true
			});
			const t0 = performance.now();
			let af = beat.afFallback;
			try {
				af = await interpret(beat.nl, get);
			} catch {
				af = beat.afFallback;
			}
			if (get().run !== "rehearsal") return;
			const ms = Math.round(performance.now() - t0);
			set({
				currentAf: af,
				translating: false,
				lastMs: ms,
				stages: {
					...get().stages,
					llm: "ready",
					hud: "hot"
				},
				turns: [...get().turns, {
					id: uid(),
					nl: beat.nl,
					af,
					at: Date.now(),
					ms,
					source: "rehearsal"
				}]
			});
			await sleep(2200);
		}
		if (get().run === "rehearsal") set({
			run: "idle",
			speaking: false,
			translating: false,
			stages: {
				...IDLE_STAGES,
				hud: "ready"
			}
		});
	},
	arm: async (kind) => {
		if (get().run === "rehearsal") return;
		get().disarm();
		set({
			error: null,
			run: "live",
			feed: kind,
			stages: {
				...IDLE_STAGES,
				route: "wait"
			}
		});
		await startCapture(kind, vadConfig(get()), {
			onStream: (stream, k) => {
				set({
					feedStream: stream,
					feed: k,
					stages: {
						...get().stages,
						route: "ready",
						vad: "ready",
						hud: "ready"
					}
				});
			},
			onLevel: (rms, speaking) => {
				const prev = get();
				const vad = speaking ? "hot" : prev.feed ? "ready" : "idle";
				if (prev.speaking === speaking && prev.stages.vad === vad) return;
				set({
					level: rms,
					speaking,
					stages: {
						...prev.stages,
						vad
					}
				});
			},
			onChunk: (wavBase64) => {
				(async () => {
					if (get().translating) return;
					set({
						translating: true,
						stages: {
							...get().stages,
							stt: "hot",
							orch: "wait"
						},
						error: null
					});
					const t0 = performance.now();
					try {
						const stt = await transcribeChunk({ data: { wavBase64 } });
						if (!stt.ok) throw new Error(stt.error);
						const dutch = stt.text.trim();
						if (!dutch) {
							set({
								translating: false,
								stages: {
									...get().stages,
									stt: "ready",
									orch: "idle"
								}
							});
							return;
						}
						if (get().run !== "live") return;
						set({
							currentNl: dutch,
							currentAf: "",
							stages: {
								...get().stages,
								stt: "ready",
								orch: "hot",
								llm: "wait"
							}
						});
						const af = await interpret(dutch, get);
						if (get().run !== "live") return;
						const ms = Math.round(performance.now() - t0);
						set({
							currentAf: af,
							translating: false,
							lastMs: ms,
							stages: {
								...get().stages,
								orch: "ready",
								llm: "ready",
								hud: "hot"
							},
							turns: [...get().turns, {
								id: uid(),
								nl: dutch,
								af,
								at: Date.now(),
								ms,
								source: "mic"
							}]
						});
					} catch (err) {
						set({
							translating: false,
							error: err instanceof Error ? err.message : "Pipeline failed",
							stages: {
								...get().stages,
								stt: "err",
								llm: "err"
							}
						});
					}
				})();
			},
			onStop: () => get().disarm(),
			onError: (message) => {
				set({
					error: message,
					run: "idle",
					feed: null,
					feedStream: null,
					stages: { ...IDLE_STAGES }
				});
			}
		});
	},
	disarm: () => {
		stopCapture();
		get().feedStream?.getTracks().forEach((t) => t.stop());
		if (get().run === "live") set({
			run: "idle",
			feed: null,
			feedStream: null,
			speaking: false,
			level: 0,
			stages: {
				...IDLE_STAGES,
				hud: get().currentAf ? "ready" : "idle"
			}
		});
	},
	stopAll: () => {
		stopCapture();
		get().feedStream?.getTracks().forEach((t) => t.stop());
		set({
			run: "idle",
			feed: null,
			feedStream: null,
			speaking: false,
			level: 0,
			translating: false,
			stages: {
				...IDLE_STAGES,
				hud: get().currentAf ? "ready" : "idle"
			}
		});
	},
	submitTyped: async () => {
		const dutch = get().typed.trim();
		if (!dutch || get().translating) return;
		set({
			translating: true,
			currentNl: dutch,
			error: null,
			stages: {
				route: "ready",
				vad: "ready",
				stt: "ready",
				orch: "hot",
				llm: "wait",
				hud: "ready"
			}
		});
		const t0 = performance.now();
		try {
			const af = await interpret(dutch, get);
			const ms = Math.round(performance.now() - t0);
			set({
				currentAf: af,
				translating: false,
				typed: "",
				lastMs: ms,
				stages: {
					...get().stages,
					orch: "ready",
					llm: "ready",
					hud: "hot"
				},
				turns: [...get().turns, {
					id: uid(),
					nl: dutch,
					af,
					at: Date.now(),
					ms,
					source: "type"
				}]
			});
		} catch (err) {
			set({
				translating: false,
				error: err instanceof Error ? err.message : "Translation failed",
				stages: {
					...get().stages,
					llm: "err"
				}
			});
		}
	}
}));
var HUD_MODES = [
	{
		id: "studio",
		label: "Studio"
	},
	{
		id: "caption",
		label: "Caption"
	},
	{
		id: "stealth",
		label: "Stealth"
	}
];
async function openPip() {
	const docPip = window.documentPictureInPicture;
	if (!docPip) throw new Error("Pop-out needs a Chromium browser");
	const pip = await docPip.requestWindow({
		width: 480,
		height: 200
	});
	pip.document.documentElement.classList.add("dark");
	pip.document.body.style.margin = "0";
	pip.document.body.style.background = "#0c0c0b";
	pip.document.body.style.color = "#f2efe9";
	for (const sheet of Array.from(document.styleSheets)) try {
		if (sheet.href) {
			const link = pip.document.createElement("link");
			link.rel = "stylesheet";
			link.href = sheet.href;
			pip.document.head.append(link);
		} else {
			const style = pip.document.createElement("style");
			style.textContent = Array.from(sheet.cssRules).map((r) => r.cssText).join("\n");
			pip.document.head.append(style);
		}
	} catch {}
	const mount = pip.document.createElement("div");
	mount.id = "fluister-pip";
	mount.style.padding = "12px";
	pip.document.body.append(mount);
	return {
		pip,
		mount
	};
}
function Studio() {
	const s = useFluister();
	const [settingsOpen, setSettingsOpen] = (0, import_react.useState)(false);
	const [pipError, setPipError] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		s.hydrate();
		s.probeAi();
	}, []);
	const armed = s.run === "live";
	const rehearsing = s.run === "rehearsal";
	const busy = s.run !== "idle";
	const popOut = async () => {
		setPipError(null);
		try {
			const { pip, mount } = await openPip();
			s.setPipOpen(true);
			const root = (0, import_client.createRoot)(mount);
			let last = "";
			const paint = () => {
				const st = useFluister.getState();
				const key = `${st.currentNl}|${st.currentAf}|${st.hudMode}|${st.translating}|${st.run}|${st.speaking}`;
				if (key === last) return;
				last = key;
				root.render(/* @__PURE__ */ (0, import_jsx_runtime.jsx)(OverlayHud, {
					nl: st.currentNl,
					af: st.currentAf,
					mode: st.hudMode,
					live: st.run === "live" || st.speaking,
					thinking: st.translating,
					compact: true
				}));
			};
			paint();
			const unsub = useFluister.subscribe(paint);
			pip.addEventListener("pagehide", () => {
				unsub();
				root.unmount();
				s.setPipOpen(false);
			});
		} catch (err) {
			setPipError(err instanceof Error ? err.message : "Pop-out failed");
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-dvh bg-bg text-fg",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
			className: "rise flex items-end justify-between gap-4 px-4 pb-4 pt-6 md:px-8",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "font-mono text-xs uppercase tracking-widest text-subtle",
				children: "Private interpreter"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "mt-1 font-sans text-3xl font-medium tracking-tight md:text-4xl",
				children: "Fluister"
			})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-3 text-right",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-mono text-xs uppercase tracking-wider text-subtle",
					children: "Engine"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-fg",
					children: s.engine === "ollama" ? s.ollamaModel : s.aiAvailable ? "Grok 4.5" : "Offline fallback"
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: cn("size-2 rounded-full", s.aiAvailable || s.engine === "ollama" ? "bg-hot" : "bg-border") })]
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid gap-6 px-4 pb-16 md:px-8 xl:grid-cols-[minmax(16rem,20rem)_minmax(0,1fr)_minmax(16rem,22rem)]",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
					className: "rise rise-2 hidden rounded-xl border border-border bg-bg-elevated p-3 xl:block",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "px-3 pb-2 pt-2 font-mono text-xs uppercase tracking-wider text-subtle",
						children: "Pipeline"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PipelineRail, { stages: s.stages })]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
					className: "rise rise-3 min-w-0 space-y-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "rounded-xl border border-border bg-bg-elevated px-4 py-3 xl:hidden",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PipelineStrip, { stages: s.stages })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CallStage, {
							nl: s.currentNl,
							af: s.currentAf,
							mode: s.hudMode,
							live: armed || rehearsing,
							thinking: s.translating,
							speaking: s.speaking,
							feedStream: s.feedStream,
							onPopOut: () => void popOut()
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-xl border border-border bg-bg-elevated px-4 py-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mb-2 flex items-center justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "font-mono text-xs uppercase tracking-wider text-subtle",
									children: "Feed"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "font-mono text-xs tabular-nums text-muted",
									children: s.lastMs ? `${s.lastMs} ms` : "—"
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Waveform, {
								level: s.level,
								speaking: s.speaking,
								active: armed || rehearsing
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-col gap-3 sm:flex-row",
							children: [
								busy ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									variant: "live",
									className: "flex-1",
									onClick: () => s.stopAll(),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Square, {
										className: "size-4",
										strokeWidth: 1.75
									}), "Stop"]
								}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									className: "flex-1",
									onClick: () => void s.startRehearsal(),
									children: "Run rehearsal"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									variant: "secondary",
									className: "flex-1",
									disabled: rehearsing,
									onClick: () => void (armed ? s.disarm() : s.arm("mic")),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mic, {
										className: "size-4",
										strokeWidth: 1.75
									}), armed && s.feed === "mic" ? "Disarm mic" : "Arm microphone"]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									variant: "secondary",
									className: "flex-1",
									disabled: rehearsing,
									onClick: () => void (armed && s.feed === "display" ? s.disarm() : s.arm("display")),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MonitorUp, {
										className: "size-4",
										strokeWidth: 1.75
									}), "Capture call"]
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
							className: "flex flex-col gap-2 sm:flex-row",
							onSubmit: (e) => {
								e.preventDefault();
								s.submitTyped();
							},
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "sr-only",
									htmlFor: "typed-nl",
									children: "Dutch to translate"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									id: "typed-nl",
									value: s.typed,
									onChange: (e) => s.setTyped(e.target.value),
									placeholder: "Plak Nederlandse teks…",
									className: "h-11 min-w-0 flex-1 rounded-md border border-border bg-surface px-3 text-sm text-fg placeholder:text-subtle focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									type: "submit",
									variant: "secondary",
									disabled: !s.typed.trim() || s.translating,
									children: "Translate"
								})
							]
						}),
						s.error || pipError ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-live",
							children: s.error ?? pipError
						}) : null,
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TurnLog, { turns: s.turns })
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
					className: "rise rise-4 space-y-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						className: "rounded-xl border border-border bg-bg-elevated p-5",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-mono text-xs uppercase tracking-wider text-subtle",
								children: "HUD"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-3 grid grid-cols-3 gap-1 rounded-md border border-border bg-bg p-1",
								children: HUD_MODES.map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: () => s.patch({ hudMode: m.id }),
									className: cn("h-10 rounded-sm text-sm transition-colors duration-150", s.hudMode === m.id ? "bg-surface text-fg" : "text-muted hover:text-fg"),
									children: m.label
								}, m.id))
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-5 flex items-center justify-between gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-sm font-medium",
									children: "Local Ollama"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs text-muted",
									children: "Qwen on the 395. Cloud is the default."
								})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch, {
									checked: s.engine === "ollama",
									onCheckedChange: (v) => s.patch({ engine: v ? "ollama" : "cloud" })
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								className: "mt-4 text-sm text-muted underline-offset-4 hover:text-fg hover:underline",
								onClick: () => setSettingsOpen((v) => !v),
								children: settingsOpen ? "Hide setup" : "Interview setup"
							}),
							settingsOpen ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-4 space-y-4 border-t border-border pt-4",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
										label: "Chunk",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "grid grid-cols-3 gap-1",
											children: [
												2e3,
												2500,
												3e3
											].map((ms) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
												type: "button",
												onClick: () => s.patch({ chunkMs: ms }),
												className: cn("h-10 rounded-sm border text-sm", s.chunkMs === ms ? "border-accent bg-surface text-fg" : "border-border text-muted"),
												children: [ms / 1e3, "s"]
											}, ms))
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
										label: "VAD",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "grid grid-cols-3 gap-1",
											children: [
												"low",
												"med",
												"high"
											].map((v) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												type: "button",
												onClick: () => s.patch({ vad: v }),
												className: cn("h-10 rounded-sm border text-sm capitalize", s.vad === v ? "border-accent bg-surface text-fg" : "border-border text-muted"),
												children: v
											}, v))
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
										label: "Ollama URL",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											value: s.ollamaUrl,
											onChange: (e) => s.patch({ ollamaUrl: e.target.value }),
											className: "h-11 w-full rounded-md border border-border bg-bg px-3 font-mono text-sm"
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
										label: "Model",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											value: s.ollamaModel,
											onChange: (e) => s.patch({ ollamaModel: e.target.value }),
											className: "h-11 w-full rounded-md border border-border bg-bg px-3 font-mono text-sm"
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
										label: "Interview context",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
											value: s.context,
											onChange: (e) => s.patch({ context: e.target.value }),
											rows: 4,
											className: "w-full rounded-md border border-border bg-bg px-3 py-2 text-sm leading-relaxed"
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-xs leading-relaxed text-subtle",
										children: "Stealth shrinks the caption. True share-exclusion needs a desktop wrapper with content protection. Document PiP floats the HUD above the call in Chromium."
									})
								]
							}) : null
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MachineCard, {})]
				})
			]
		})]
	});
}
function Field({ label, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
		className: "block space-y-2",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "text-xs font-medium text-muted",
			children: label
		}), children]
	});
}
function TurnLog({ turns }) {
	if (turns.length === 0) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "text-sm text-muted",
		children: "Run a Dutch rehearsal, arm the mic, or paste a line. Afrikaans lands in the overlay."
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
		className: "space-y-3",
		children: turns.slice().reverse().map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
			className: "rounded-lg border border-border bg-bg-elevated px-4 py-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-baseline justify-between gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-display text-lg italic leading-snug",
					children: t.af
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "shrink-0 font-mono text-xs tabular-nums text-subtle",
					children: [t.ms, " ms"]
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-xs leading-relaxed text-muted",
				children: t.nl
			})]
		}, t.id))
	});
}
function Home() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Studio, {});
}
//#endregion
export { Home as component };
