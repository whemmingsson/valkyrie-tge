// Represents a UI string, which can be used for displaying text in the game's user interface.
export interface UiString {
  // The text value to be displayed in the UI.
  value: string;
  // The context or condition under which this UI string should be displayed, formnat: target.id:actionType, e.g., "door1:open"
  on?: string;
}
