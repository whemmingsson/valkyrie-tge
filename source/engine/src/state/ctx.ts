import Room from "../core/models/room.js";
import Inventory from "../core/models/inventory.js";
import { ColorMap } from "../helpers/color-helper.js";
import GameMap from "../core/models/map.js";

export default interface Ctx {
    gameName: string;
    currentRoom: Room
    playerDirection: string;
    roomVisits: {};
    inventory: Inventory;
    translations: {};
    map: GameMap;
    config: { colors: ColorMap; exitCommands: string[] };
    commandHistory: string[];
}