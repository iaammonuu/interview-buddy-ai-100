import { createOpenAICompatible } from "@ai-sdk/openai-compatible";
import { generateText } from "ai";
import type { z } from "zod";

const TIMEOUT_MS = 45_000;

export interface LLMClient {
  json<T>(args: { system: string; user: string; schema: z.ZodType<T> }): Promise<T>;
}

function extractJson(text: string): unknown {
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/);
  const raw = (fenced?.[1] ?? text).trim();
  const start = raw.indexOf("{");
  const end = raw.lastIndexOf("}");
  if (start === -1 || end === -1) throw new Error("No JSON object in model output");
  return JSON.parse(raw.slice(start, end + 1));
}

export function createGatewayClient(apiKey: string, model = "google/gemini-3.6-flash"): LLMClient {
  const provider = createOpenAICompatible({
    name: "lovable",
    baseURL: "https://ai.gateway.lovable.dev/v1",
    headers: {
      "Lovable-API-Key": apiKey,
      "X-Lovable-AIG-SDK": "vercel-ai-sdk",
    },
  });

  return {
    async json<T>({ system, user, schema }: { system: string; user: string; schema: z.ZodType<T> }) {
      const call = async (extra?: string) => {
        const { text } = await generateText({
          model: provider(model),
          system,
          prompt: extra ? `${user}\n\n${extra}` : user,
          abortSignal: AbortSignal.timeout(TIMEOUT_MS),
          maxRetries: 1,
        });
        return schema.parse(extractJson(text));
      };

      try {
        return await call();
      } catch (first) {
        // One repair attempt for malformed / non-conforming JSON.
        try {
          return await call(
            "Your previous output was not valid JSON matching the required shape. Return ONLY the JSON object, no prose, no code fences.",
          );
        } catch {
          throw first;
        }
      }
    },
  };
}
