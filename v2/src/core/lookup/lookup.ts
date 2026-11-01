import { Target } from "../../gameTypes/Target.js";
import { getGameContext } from "../context/Context.js";

export const lookupTargetObject = (targetType: string): Target | null => {
  const ctx = getGameContext();

  const objectExtitsInWorld =
    ctx.game?.targets?.find((t) => t.type === targetType) || null;
  const objectExistsInInventory =
    ctx.playerInventory.find((t) => t.type === targetType) || null;
  return objectExtitsInWorld || objectExistsInInventory;
};
