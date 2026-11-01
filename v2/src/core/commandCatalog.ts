import type { Target } from "../gameTypes/Target.js";

export interface CommandTarget {
  type: string;
  name: string;
  synonyms: string[];
  actions: string[];
}

export interface CommandCatalog {
  actions: string[];
  targets: CommandTarget[];
}

export function createCommandCatalog(
  targets: readonly Target[] | undefined,
): CommandCatalog {
  const commandTargets = (targets ?? []).map((target) => ({
    type: target.type,
    name: target.name,
    synonyms: target.synonyms ?? [],
    actions: target.actions ?? [],
  }));

  return {
    actions: [...new Set(commandTargets.flatMap((target) => target.actions))],
    targets: commandTargets,
  };
}
