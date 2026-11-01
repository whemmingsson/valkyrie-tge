// Translate a parsed command into an Action object with an execute method.
import type { ParsedCommand } from "./coreTypes/ParsedCommand.js";
import { lookupTargetObject } from "./lookup/lookup.js";

export interface Action {
  execute: () => void;
}

export function buildAction(parsedCommand: ParsedCommand): Action {
  // Validate the parsed command
  if (!parsedCommand.action) {
    throw new Error(
      "Invalid command: The game engine does not understand the command.",
    );
  }

  //  Build the action object based on the parsed command
  const targetObjectString = parsedCommand.target;

  // Lookup if this is a valid target object within the game context
  const targetObject = lookupTargetObject(targetObjectString);

  if (!targetObject) {
    throw new Error(`Invalid target: The game engine could not that object".`);
  }

  return {
    execute: () => {
      console.log(
        `Executing action: ${parsedCommand.action} on target: ${parsedCommand.target}`,
      );
    },
  };
}
