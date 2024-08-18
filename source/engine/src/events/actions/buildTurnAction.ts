import { TextHelper } from "../../helpers/text-helper.js";
import { Translation } from "../../helpers/translations.js";
import turnActionHelper from "../../helpers/turn-action-helper.js";
import gameContext from "../../state/game-context.js";
import { ActionBuilder } from "../../types/actionBuilder.js";
import { GameEvent } from "../../types/event.js";
import { buildWarningAction } from "./buildWarningAction.js";

export const buildTurnAction: ActionBuilder = (event: GameEvent, command: string) => {
    const nextDirection = turnActionHelper.findNextDirection(event, command, gameContext.ctx.playerDirection);

    if (!nextDirection) {
        return buildWarningAction(Translation.translate(Translation.ACTION_TURN_INVALID_DIRECTION_WARNING), event);
    }

    const type = "TURN";

    const updateDirection = () => gameContext.ctx.playerDirection = nextDirection;

    if (!event.meta[nextDirection]) {
        return {
            execute: updateDirection,
            type: type,
        }
    }

    return {
        execute: () => {
            updateDirection();
            TextHelper.logText(event.meta[nextDirection]);
        },
        type: type,
    }
}