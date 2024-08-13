import Room from "../core/models/room.js";
import Inventory from "../core/models/inventory.js";
import { ColorMap } from "../helpers/color-helper.js";

export default interface Ctx {
    currentCommandTarget: any;
    currentRoom: Room
    playerDirection: string;
    roomVisits: {};
    inventory: Inventory;
    translations: {};
    map: any;
    config: { colors: ColorMap; exitCommands: string[] };
    commandHistory: string[];
}