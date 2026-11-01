import { appendFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";

type DebugOutput = "console" | "file" | "both";

const output = getDebugOutput();
const sessionLogPath =
  output === "console" ? undefined : createSessionLogPath();

function getDebugOutput(): DebugOutput {
  const configuredOutput = process.env.DEBUG_OUTPUT;

  if (
    configuredOutput === "console" ||
    configuredOutput === "file" ||
    configuredOutput === "both"
  ) {
    return configuredOutput;
  }

  return "console";
}

function createSessionLogPath(): string {
  const sessionStartedAt = new Date();
  const timestamp = sessionStartedAt
    .toISOString()
    .replace("T", "_")
    .replace(/:/g, "-")
    .replace(".", "-")
    .replace("Z", "");
  const logsDirectory = join(process.cwd(), "logs");

  mkdirSync(logsDirectory, { recursive: true });

  const logPath = join(logsDirectory, `${timestamp}.log`);
  appendFileSync(
    logPath,
    `Session started: ${sessionStartedAt.toISOString()}\n`,
  );

  return logPath;
}

export const debug = (message: string): void => {
  if (!process.env.DEBUG) {
    return;
  }

  const logMessage = `[${new Date().toISOString()}] [DEBUG] ${message}`;

  if (output === "console" || output === "both") {
    console.debug(logMessage);
  }

  if (sessionLogPath) {
    appendFileSync(sessionLogPath, `${logMessage}\n`);
  }
};
