import logger from "../core/io/logger";
import checkConditions from "../events/conditions-checker";
import parseAnnotatedText from "./annotator";

// Filter out conditional texts that should not be displayed
const filterConditionalTexts = (collection): string[] => {
    const textsToDisplay = [];

    collection.forEach((item) => {
        if (item.conditions && !checkConditions(item.conditions)) {
            textsToDisplay.push(item.text);
        }
        else if (!item.conditions) {
            textsToDisplay.push(item);
        }
    });

    return textsToDisplay;
}

export namespace TextHelper {
    export const logText = (text: string | any[]) => {
        if (typeof text === 'string') {
            logger.logAnnotated(parseAnnotatedText(text))
        }
        else {
            filterConditionalTexts(text).forEach((t) => {
                logger.logAnnotated(parseAnnotatedText(t));
            });
        }
    }
}
