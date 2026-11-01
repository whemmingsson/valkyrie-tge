import { Game } from "../../gameTypes/Game.js";
import { Target } from "../../gameTypes/Target.js";

// Alias for game objects within the context, representing interactive targets in the game environment.
export interface GameObject extends Target {}

export class Context {
  playerInventory: GameObject[];
  game: Game | undefined;
  // Represents the current state of the game context.
  constructor() {
    // Initialize context properties here.
    this.playerInventory = [];
  }

  // Sets the current game instance for the context.
  setGame(game: Game) {
    this.game = game;
  }
}

const gameContext = new Context();

export default gameContext;

export const getGameContext = (): Context => {
  return gameContext;
};
