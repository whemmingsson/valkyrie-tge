import GameObject from "../../core/models/gameObject.js";
import { Translation } from "../../helpers/translations.js";
import { ActionBuilder } from "../../core/types/actionBuilder.js";
import { buildSimpleTextAction } from "./buildSimpleTextAction.js";
import { buildWarningAction } from "./buildWarningAction.js";

export const buildDescribeAction: ActionBuilder = (_, __, targetObject: GameObject) => {
    if (!targetObject) {
        return buildWarningAction(Translation.translate(Translation.ACTION_DESCRIBE_NO_TARGET_WARNING));
    }

    return buildSimpleTextAction(targetObject.description ?? targetObject.source.description ?? Translation.translate(Translation.ACTION_DESCRIBE_NO_DESCRIPTION_INFO));
}
