import { TextHelper } from "../../helpers/text-helper.js";
import { Translation } from "../../helpers/translations.js";
import turnActionHelper from "../../helpers/turn-action-helper.js";
import { getContext } from "../../state/game-context.js";
import { ActionBuilder } from "../../core/types/actionBuilder.js";
import { GameEvent } from "../../core/types/event.js";
import { buildWarningAction } from "./buildWarningAction.js";
import { registerBuilder } from "./actionRegistry.js";
import { ACTION_TURN } from "../../core/constants/events/actionTypes.js";



export const buildTurnAction: ActionBuilder = (event: GameEvent, command: string) => {
    const context = getContext();
    const nextDirection = turnActionHelper.findNextDirection(event, command, context.ctx.playerDirection);

    if (!nextDirection) {
        return buildWarningAction(Translation.translate(Translation.ACTION_TURN_INVALID_DIRECTION_WARNING), event);
    }

    const updateDirection = () => context.ctx.playerDirection = nextDirection;

    if (!event.meta[nextDirection]) {
        return {
            execute: updateDirection,
            type: ACTION_TURN,
        }
    }

    return {
        execute: () => {
            updateDirection();
            TextHelper.logText(event.meta[nextDirection]);
        },
        type: ACTION_TURN,
    }
}

registerBuilder(ACTION_TURN, buildTurnAction);