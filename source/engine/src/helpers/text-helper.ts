import logger from "../core/io/logger.js";
import checkConditions from "../events/conditions-checker.js";
import parser from "node-html-parser";
import Types from "../types/types.js";
import gameContext from "../state/game-context.js";

// Parse annotated text
const parseAnnotatedText = (text: string) => {
    const root = parser.parse(text);
    const nodes = root.childNodes;

    const elements = [] as Types.TextElement[];
    nodes.forEach(node => {
        if (node.childNodes && node.childNodes.length > 0) {
            try {
                elements.push({ text: node.childNodes[0].rawText, color: node.rawTagName });
            } catch (e) {
                logger.error(e);
            }
        }
        else {
            elements.push({ text: node.rawText });
        }
    });
    return elements;
}

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
            logger.logAnnotated(parseAnnotatedText(text), gameContext.ctx.config.colors)
        }
        else {
            filterConditionalTexts(text).forEach((t) => {
                logger.logAnnotated(parseAnnotatedText(t), gameContext.ctx.config.colors);
            });
        }
    }
}
