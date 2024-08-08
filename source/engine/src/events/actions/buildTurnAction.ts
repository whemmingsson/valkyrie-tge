import logger from "../../core/io/logger";
import { TextHelper } from "../../helpers/text-helper";
import { Translation } from "../../helpers/translations";
import turnActionHelper from "../../helpers/turn-action-helper";
import gameContext from "../../state/game-context";
import Types from "../../types/types";
import { buildWarningAction } from "./buildWarningAction";

export const buildTurnAction: Types.ActionBuilder = (event, command) => {
    const nextDirection = turnActionHelper.findNextDirection(event, command, gameContext.ctx.playerDirection);

    if (!nextDirection) {
        return buildWarningAction(Translation.translate(Translation.ACTION_TURN_INVALID_DIRECTION_WARNING), event);
    }

    const type = "TURN";

    const updateDirection = () => gameContext.ctx.playerDirection = nextDirection;

    if (!event.meta[nextDirection]) {
        return {
            execute: () => { updateDirection(); },
            type: type,
        }
    }

    return {
        execute: () => {
            updateDirection();
            logger.logWithTemplate("You are facing $ \n", [nextDirection.toLowerCase()]);
            TextHelper.logText(event.meta[nextDirection]);
        },
        type: type,
    }
}