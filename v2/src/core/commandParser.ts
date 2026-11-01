import { ParsedCommand } from "./coreTypes/ParsedCommand.js";
import { parseCommand as parseOllamaCommand } from "./agent/ollama.js";
import { CommandCatalog } from "./commandCatalog.js";

const commandCache: Record<string, ParsedCommand> = {};

export async function parseCommand(
  command: string,
  catalog: CommandCatalog,
): Promise<ParsedCommand> {
  if (commandCache[command]) {
    return commandCache[command];
  }

  const parsedCommand = await parseOllamaCommand(command, catalog);

  commandCache[command] = parsedCommand;

  return parsedCommand;
}
