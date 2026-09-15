import { createServerFn } from "@tanstack/react-start";

const SYSTEM = `You are a live interview interpreter.
Translate Dutch speech into natural spoken Afrikaans for the candidate.
Rules:
- Output ONLY the Afrikaans translation
- Keep questions as questions
- Keep names, numbers, and product terms (Ryzen, ROCm, Qwen, CUDA, Whisper) unchanged
- Spoken register, concise, no literary flourishes
- No preface, quotes, labels, or notes`;

export const getAiStatus = createServerFn({ method: "POST" }).handler(
  async (): Promise<{ available: boolean }> => {
    return { available: Boolean(process.env.XAI_API_KEY?.trim()) };
  },
);

export const translateTurn = createServerFn({ method: "POST" })
  .validator((input: { dutch: string; context: string }) => {
    const dutch = input.dutch.trim().slice(0, 1200);
    const context = input.context.trim().slice(0, 400);
    if (!dutch) throw new Error("Empty transcript");
    return { dutch, context };
  })
  .handler(async ({ data }): Promise<{ ok: true; text: string } | { ok: false; error: string }> => {
    const apiKey = process.env.XAI_API_KEY?.trim();
    if (!apiKey) return { ok: false, error: "Interpreter is not available" };

    const user = data.context
      ? `Candidate context: ${data.context}\n\nDutch:\n${data.dutch}`
      : data.dutch;

    const res = await fetch("https://api.x.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "grok-4.5",
        temperature: 0.2,
        max_tokens: 180,
        messages: [
          { role: "system", content: SYSTEM },
          { role: "user", content: user },
        ],
      }),
    });

    if (!res.ok) {
      if (res.status === 403) {
        return { ok: false, error: "Cloud interpreter is unavailable. Rehearsal still runs locally." };
      }
      return { ok: false, error: `Interpreter error ${res.status}` };
    }

    const body = (await res.json()) as {
      choices?: { message?: { content?: string } }[];
    };
    const text = body.choices?.[0]?.message?.content?.trim() ?? "";
    if (!text) return { ok: false, error: "Empty translation" };
    return { ok: true, text };
  });

export const transcribeChunk = createServerFn({ method: "POST" })
  .validator((input: { wavBase64: string }) => {
    const wavBase64 = input.wavBase64.trim();
    if (!wavBase64) throw new Error("Empty audio");
    if (wavBase64.length > 900_000) throw new Error("Audio chunk too large");
    return { wavBase64 };
  })
  .handler(
    async ({
      data,
    }): Promise<{ ok: true; text: string } | { ok: false; error: string }> => {
      const apiKey = process.env.XAI_API_KEY?.trim();
      if (!apiKey) return { ok: false, error: "Transcription is not available" };

      const bin = Buffer.from(data.wavBase64, "base64");
      if (bin.length < 64) return { ok: true, text: "" };

      const form = new FormData();
      form.append("language", "nl");
      form.append("format", "true");
      form.append(
        "file",
        new File([new Uint8Array(bin)], "chunk.wav", { type: "audio/wav" }),
      );

      const res = await fetch("https://api.x.ai/v1/stt", {
        method: "POST",
        headers: { Authorization: `Bearer ${apiKey}` },
        body: form,
      });

      if (!res.ok) {
        if (res.status === 403) {
          return { ok: false, error: "Cloud transcription is unavailable." };
        }
        return { ok: false, error: `Transcription error ${res.status}` };
      }

      const body = (await res.json()) as { text?: string };
      return { ok: true, text: (body.text ?? "").trim() };
    },
  );
