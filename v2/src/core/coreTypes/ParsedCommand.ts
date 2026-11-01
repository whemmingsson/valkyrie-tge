export interface ParsedCommand {
  action: string;
  target: string;
  noun: string;
  confidence: "high" | "medium" | "low";
}
