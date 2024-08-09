import { Translation } from "../../helpers/translations.js";
import Types from "../../types/types.js";
import { buildSimpleTextAction } from "./buildSimpleTextAction.js";
import { buildWarningAction } from "./buildWarningAction.js";

export const buildDescribeAction: Types.ActionBuilder = (_, __, targetObject) => {
    if (!targetObject) {
        return buildWarningAction(Translation.translate(Translation.ACTION_DESCRIBE_NO_TARGET_WARNING));
    }

    return buildSimpleTextAction(targetObject.description ?? targetObject.source.description ?? Translation.translate(Translation.ACTION_DESCRIBE_NO_DESCRIPTION_INFO));
}
