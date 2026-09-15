import { n as TSS_SERVER_FUNCTION, t as createServerFn } from "./ssr.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/ai-DtOqsDe-.js
var createServerRpc = (serverFnMeta, splitImportFn) => {
	const url = "/_serverFn/" + serverFnMeta.id;
	return Object.assign(splitImportFn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
var SYSTEM = `You are a live interview interpreter.
Translate Dutch speech into natural spoken Afrikaans for the candidate.
Rules:
- Output ONLY the Afrikaans translation
- Keep questions as questions
- Keep names, numbers, and product terms (Ryzen, ROCm, Qwen, CUDA, Whisper) unchanged
- Spoken register, concise, no literary flourishes
- No preface, quotes, labels, or notes`;
var getAiStatus_createServerFn_handler = createServerRpc({
	id: "f55d85520203b0ca68806b32dd775d224e89e7dbf6a1371fbfe6857a9f8e3df4",
	name: "getAiStatus",
	filename: "src/lib/ai.ts"
}, (opts) => getAiStatus.__executeServer(opts));
var getAiStatus = createServerFn({ method: "POST" }).handler(getAiStatus_createServerFn_handler, async () => {
	return { available: Boolean(process.env.XAI_API_KEY?.trim()) };
});
var translateTurn_createServerFn_handler = createServerRpc({
	id: "10118e9a9b2b4c2c1d1c7075fa722adb162d85155d9275a0dd2d7ee540a93c43",
	name: "translateTurn",
	filename: "src/lib/ai.ts"
}, (opts) => translateTurn.__executeServer(opts));
var translateTurn = createServerFn({ method: "POST" }).validator((input) => {
	const dutch = input.dutch.trim().slice(0, 1200);
	const context = input.context.trim().slice(0, 400);
	if (!dutch) throw new Error("Empty transcript");
	return {
		dutch,
		context
	};
}).handler(translateTurn_createServerFn_handler, async ({ data }) => {
	const apiKey = process.env.XAI_API_KEY?.trim();
	if (!apiKey) return {
		ok: false,
		error: "Interpreter is not available"
	};
	const user = data.context ? `Candidate context: ${data.context}\n\nDutch:\n${data.dutch}` : data.dutch;
	const res = await fetch("https://api.x.ai/v1/chat/completions", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${apiKey}`
		},
		body: JSON.stringify({
			model: "grok-4.5",
			temperature: .2,
			max_tokens: 180,
			messages: [{
				role: "system",
				content: SYSTEM
			}, {
				role: "user",
				content: user
			}]
		})
	});
	if (!res.ok) {
		if (res.status === 403) return {
			ok: false,
			error: "Cloud interpreter is unavailable. Rehearsal still runs locally."
		};
		return {
			ok: false,
			error: `Interpreter error ${res.status}`
		};
	}
	const text = (await res.json()).choices?.[0]?.message?.content?.trim() ?? "";
	if (!text) return {
		ok: false,
		error: "Empty translation"
	};
	return {
		ok: true,
		text
	};
});
var transcribeChunk_createServerFn_handler = createServerRpc({
	id: "7af1eb60acda78dcf6b340c8addbd33bcede597c6c2f603d66f82eacccd4e27c",
	name: "transcribeChunk",
	filename: "src/lib/ai.ts"
}, (opts) => transcribeChunk.__executeServer(opts));
var transcribeChunk = createServerFn({ method: "POST" }).validator((input) => {
	const wavBase64 = input.wavBase64.trim();
	if (!wavBase64) throw new Error("Empty audio");
	if (wavBase64.length > 9e5) throw new Error("Audio chunk too large");
	return { wavBase64 };
}).handler(transcribeChunk_createServerFn_handler, async ({ data }) => {
	const apiKey = process.env.XAI_API_KEY?.trim();
	if (!apiKey) return {
		ok: false,
		error: "Transcription is not available"
	};
	const bin = Buffer.from(data.wavBase64, "base64");
	if (bin.length < 64) return {
		ok: true,
		text: ""
	};
	const form = new FormData();
	form.append("language", "nl");
	form.append("format", "true");
	form.append("file", new File([new Uint8Array(bin)], "chunk.wav", { type: "audio/wav" }));
	const res = await fetch("https://api.x.ai/v1/stt", {
		method: "POST",
		headers: { Authorization: `Bearer ${apiKey}` },
		body: form
	});
	if (!res.ok) {
		if (res.status === 403) return {
			ok: false,
			error: "Cloud transcription is unavailable."
		};
		return {
			ok: false,
			error: `Transcription error ${res.status}`
		};
	}
	return {
		ok: true,
		text: ((await res.json()).text ?? "").trim()
	};
});
//#endregion
export { getAiStatus_createServerFn_handler, transcribeChunk_createServerFn_handler, translateTurn_createServerFn_handler };
