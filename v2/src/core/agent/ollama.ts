import { ParsedCommand } from "../coreTypes/ParsedCommand.js";
import type { CommandCatalog } from "../commandCatalog.js";

export const DEFAULT_OLLAMA_URL = "http://127.0.0.1:11434";
export const DEFAULT_COMMAND_MODEL = "qwen3:4b";

interface ChatResponse {
  message?: {
    content?: string;
  };
}

function createCommandSchema(catalog: CommandCatalog) {
  return {
    type: "object",
    properties: {
      action: { type: "string", enum: catalog.actions },
      target: {
        type: "string",
        enum: [...new Set(catalog.targets.map((target) => target.type))],
      },
      noun: { type: "string" },
      confidence: { type: "string", enum: ["high", "medium", "low"] },
    },
    required: ["action", "target", "noun", "confidence"],
    additionalProperties: false,
  };
}

function createSystemPrompt(catalog: CommandCatalog): string {
  return [
    "Translate the user's game command into JSON only.",
    "Return an object matching this schema: { action: string, target: string, noun: string, confidence: 'high' | 'medium' | 'low' }.",
    "The action and target must be canonical values from the supplied game catalog, never words invented from the user's command.",
    "Use each target's name and synonyms to identify its canonical target type, then choose an action allowed for that target.",
    "Keep noun as the object word from the user's command. Ignore adjectives and other modifiers when resolving the target.",
    "For example, if the catalog identifies paper as a synonym for note and read is an allowed action, 'describe the dusty paper' must produce target 'note' and action 'read', not target 'paper' and action 'describe'.",
    "Do not include markdown or extra fields.",
    `Available actions: ${JSON.stringify(catalog.actions)}.`,
    `Available targets: ${JSON.stringify(catalog.targets)}.`,
  ].join(" ");
}

export async function parseCommand(
  command: string,
  catalog: CommandCatalog,
): Promise<ParsedCommand> {
  const baseUrl = process.env.OLLAMA_URL ?? DEFAULT_OLLAMA_URL;
  const model = process.env.OLLAMA_MODEL ?? DEFAULT_COMMAND_MODEL;

  let response: Response;
  try {
    response = await fetch(new URL("/api/chat", baseUrl), {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        model,
        stream: false,
        format: createCommandSchema(catalog),
        options: { temperature: 0 },
        messages: [
          {
            role: "system",
            content: createSystemPrompt(catalog),
          },
          { role: "user", content: command },
        ],
      }),
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(
      `Could not connect to Ollama at ${baseUrl}: ${message}. Start Ollama and pull ${model}.`,
    );
  }

  if (!response.ok) {
    throw new Error(
      `Ollama returned ${response.status}: ${await response.text()}`,
    );
  }

  const payload = (await response.json()) as ChatResponse;
  const content = payload.message?.content;

  if (!content) {
    throw new Error("Ollama returned no response content.");
  }

  let result: unknown;
  try {
    result = JSON.parse(content);
  } catch {
    throw new Error(`Ollama returned invalid JSON: ${content}`);
  }

  if (!result || typeof result !== "object" || Array.isArray(result)) {
    throw new Error(`Ollama returned an invalid command result: ${content}`);
  }

  const commandResult = result as Record<string, unknown>;
  const { action, target, confidence, noun } = commandResult;
  if (
    typeof action !== "string" ||
    typeof target !== "string" ||
    typeof noun !== "string" ||
    (confidence !== "high" && confidence !== "medium" && confidence !== "low")
  ) {
    throw new Error(`Ollama returned an invalid command result: ${content}`);
  }

  const matchingTargets = catalog.targets.filter(
    (catalogTarget) => catalogTarget.type === target,
  );
  if (
    !catalog.actions.includes(action) ||
    matchingTargets.length === 0 ||
    !matchingTargets.some((catalogTarget) =>
      catalogTarget.actions.includes(action),
    )
  ) {
    throw new Error(
      `Ollama returned a command unavailable in this game: ${content}`,
    );
  }

  return { action, target, confidence, noun };
}
