import { readFileSync } from "node:fs";
import { parse } from "yaml";
import { ActionType } from "../gameTypes/ActionType.js";
import type { Game } from "../gameTypes/Game.js";
import type { Target } from "../gameTypes/Target.js";
import { TargetType } from "../gameTypes/TargetType.js";
import type { UiString } from "../gameTypes/UiString.js";

const targetTypes = new Set<string>(Object.values(TargetType));
const actionTypes = new Set<string>(Object.values(ActionType));

function requireRecord(
  value: unknown,
  context: string,
): Record<string, unknown> {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw new Error(`${context} must be an object.`);
  }

  return value as Record<string, unknown>;
}

function requireString(value: unknown, context: string): string {
  if (typeof value !== "string" || value.trim().length === 0) {
    throw new Error(`${context} must be a non-empty string.`);
  }

  return value;
}

function readStringArray(
  value: unknown,
  context: string,
): string[] | undefined {
  if (value === undefined) {
    return undefined;
  }

  if (
    !Array.isArray(value) ||
    value.some((entry) => typeof entry !== "string")
  ) {
    throw new Error(`${context} must be an array of strings.`);
  }

  return value;
}

function readUiStrings(
  value: unknown,
  context: string,
): UiString[] | undefined {
  if (value === undefined) {
    return undefined;
  }

  if (!Array.isArray(value)) {
    throw new Error(`${context} must be an array.`);
  }

  return value.map((entry, index) => {
    const uiString = requireRecord(entry, `${context}[${index}]`);
    const result: UiString = {
      value: requireString(uiString.value, `${context}[${index}].value`),
    };

    if (uiString.on !== undefined) {
      result.on = requireString(uiString.on, `${context}[${index}].on`);
    }

    return result;
  });
}

function readTarget(value: unknown, index: number): Target {
  const context = `targets[${index}]`;
  const target = requireRecord(value, context);
  const type = requireString(target.type, `${context}.type`);

  if (!targetTypes.has(type)) {
    throw new Error(
      `${context}.type must be one of: ${[...targetTypes].join(", ")}.`,
    );
  }

  const actions = readStringArray(target.actions, `${context}.actions`);
  if (actions?.some((action) => !actionTypes.has(action))) {
    throw new Error(
      `${context}.actions must contain only: ${[...actionTypes].join(", ")}.`,
    );
  }

  return {
    id: requireString(target.id, `${context}.id`),
    type: type as TargetType,
    name: requireString(target.name, `${context}.name`),
    synonyms: readStringArray(target.synonyms, `${context}.synonyms`),
    actions: actions as ActionType[] | undefined,
    uiString: readUiStrings(target.uiString, `${context}.uiString`),
  };
}

export function readGame(gamePath: string): Game {
  const contents = readFileSync(gamePath, "utf8");
  const document = requireRecord(parse(contents), "Game configuration");
  const targets = document.targets;

  if (targets !== undefined && !Array.isArray(targets)) {
    throw new Error("targets must be an array.");
  }

  return {
    name: requireString(document.name, "name"),
    description: requireString(document.description, "description"),
    language: requireString(document.language, "language"),
    targets: targets?.map(readTarget),
  };
}
