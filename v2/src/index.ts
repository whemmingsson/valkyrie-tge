import { input } from "@inquirer/prompts";
import chalk from "chalk";
import { readGame } from "./core/gameReader.js";
import { buildAction } from "./core/actionBuilder.js";
import { createCommandCatalog } from "./core/commandCatalog.js";
import Context from "./core/context/Context.js";
import { parseCommand } from "./core/commandParser.js";
import { debug } from "./utils/debug.js";

const demoGamePath = "games/demo.yaml";
const game = readGame(demoGamePath);
const commandCatalog = createCommandCatalog(game.targets);

console.log(chalk.blue("Loaded game:"), game);

// Setup game context
const ctx = Context;
ctx.setGame(game);

const displayGameInformation = () => {
  console.log(chalk.blue("Game Information:"));
  console.log(chalk.cyan(game.name));
  console.log(chalk.cyan(game.description));
};

const readCommandAndParse = async (): Promise<boolean> => {
  try {
    // Prompt the user for a command
    const command = await input({
      message: "Command:",
      validate: (value) => value.trim().length > 0 || "Enter a command.",
    });

    if (["quit", "exit"].includes(command.trim().toLowerCase())) {
      console.log(chalk.yellow("Thanks for playing."));
      return false;
    }

    // Parse the command using the Ollama parser with added caching
    const parsedCommand = await parseCommand(command, commandCatalog);

    debug("Command parsed successfully.");

    // Next step - Build an Action based on the parsed command
    const action = buildAction(parsedCommand);

    debug("Action built successfully.");

    if (action && typeof action.execute === "function") {
      action.execute();
    }

    debug("Action executed successfully.");
    return true;
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(chalk.red(`Unable to parse command: ${message}`));
    return true;
  }
};

// Here we will run the game loop
const runGame = async () => {
  displayGameInformation();
  let isRunning = true;

  while (isRunning) {
    isRunning = await readCommandAndParse();
  }
};

runGame();
