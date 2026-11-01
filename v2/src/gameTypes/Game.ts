import { Target } from "./Target.js";

export interface Game {
  name: string;
  description: string;
  language: string;
  targets?: Target[];
}
