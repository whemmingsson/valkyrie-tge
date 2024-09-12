// import { expect, test, describe, jest, beforeEach } from '@jest/globals';
// import checkConditions from './conditions-checker.js';

// import { CONDITION_HAVE_KEY, CONDITION_IS_LOCKED, CONDITION_IS_NOT_LOCKED, CONDITION_IS_NOT_OPEN, CONDITION_ITEM_IN_INVENTORY, CONDITION_ROOM_VISIT_COUNT } from '../core/constants/events/conditionTypes.js';
// //import gameContext from '../state/game-context';

// // Mock the gameContext module

// const getContext = jest.fn();
// jest.mock('../state/game-context', () => ({
//     ctx: {
//         inventory: {
//             hasItemWithId: jest.fn()
//         },
//         roomVisits: {},
//         currentRoom: {
//             id: 'room1'
//         }
//     }
// }));

// describe('ConditionsChecker test', () => {

//     beforeEach(() => {
//         // Clear all instances and calls to constructor and all methods:
//         jest.clearAllMocks();
//     });

//     test("conditions is null returns null", () => {
//         const result = checkConditions(null as unknown as any[], null);
//         expect(result).toBeNull();
//     });

//     test("conditions is empty array returns null", () => {
//         const result = checkConditions([], null);
//         expect(result).toBeNull();
//     });

//     test("condition is unknown returns null", () => {
//         const condition = {
//             type: 'UNKOWN_CONDITION'
//         }
//         const result = checkConditions([condition], null);
//         expect(result).toBeNull();
//     });

//     test("Condition IS_NOT_LOCKED: target is locked returns condition", () => {
//         const condition = {
//             type: CONDITION_IS_NOT_LOCKED
//         }
//         const target = {
//             isLocked: true
//         }
//         const result = checkConditions([condition], target);
//         expect(result).toBe(condition);
//     });

//     test("Condition IS_NOT_LOCKED: target is NOT locked returns null", () => {
//         const condition = {
//             type: CONDITION_IS_NOT_LOCKED
//         }
//         const target = {
//             isLocked: false
//         }
//         const result = checkConditions([condition], target);
//         expect(result).toBeNull();
//     });

//     test("Condition IS_NOT_OPEN: target is open returns condition", () => {
//         const condition = {
//             type: CONDITION_IS_NOT_OPEN
//         }
//         const target = {
//             isOpen: true
//         }
//         const result = checkConditions([condition], target);
//         expect(result).toBe(condition);
//     });

//     test("Condition IS_NOT_OPEN: target is NOT open returns null", () => {
//         const condition = {
//             type: CONDITION_IS_NOT_OPEN
//         }
//         const target = {
//             isOpen: false
//         }
//         const result = checkConditions([condition], target);
//         expect(result).toBeNull();
//     });

//     test('Condition ITEM_IN_INVENTORY: item is not in inventory returns condition', () => {
//         const conditions = [
//             { type: CONDITION_ITEM_IN_INVENTORY, meta: { itemid: 'x' } },
//         ];

//         (gameContext.ctx.inventory.hasItemWithId as jest.Mock).mockImplementation(() => {
//             return false;
//         });

//         const result = checkConditions(conditions);

//         expect(result).toBe(conditions[0]);
//     });

//     test('Condition ITEM_IN_INVENTORY: item is in inventory returns null', () => {
//         const conditions = [
//             { type: CONDITION_ITEM_IN_INVENTORY, meta: { itemid: 'x' } },
//         ];

//         (gameContext.ctx.inventory.hasItemWithId as jest.Mock).mockImplementation(() => {
//             return true;
//         });

//         const result = checkConditions(conditions);

//         expect(result).toBeNull();
//     });
// });