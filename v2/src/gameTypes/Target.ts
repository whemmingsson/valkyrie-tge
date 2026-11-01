import { ActionType } from "./ActionType.js";
import { TargetType } from "./TargetType.js";
import { UiString } from "./UiString.js";

// Represents interactive game targets, such as objects, characters, or locations within the game environment.
export interface Target {
  // Unique identifier for the target within the game context.
  id: string;
  // The type of the target, indicating its category (e.g., door, container, note).
  type: TargetType;
  // The display name of the target.
  name: string;
  // Alternative names or aliases for the target.
  synonyms?: string[];
  // Actions that can be performed on the target.
  actions?: ActionType[];
  // UI strings associated with the target for display purposes.
  uiString?: UiString[];
}

// Represents a container target, which can hold other targets and has an open/close state.
export interface Container extends Target {
  isOpen: boolean;
  inventory?: Target[];
}

// Represents a note target, which can contain written information for the player.
export interface Note extends Target {
  content: string;
}
