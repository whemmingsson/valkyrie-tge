import output from "../core/io/output.js";
import checkConditions from "../events/conditions-checker.js";
import parser from "node-html-parser";
import { getContext } from "../state/game-context.js";
import { TextElement } from "../core/types/textElements.js";



// Parse annotated text
const parseAnnotatedText = (text: string) => {
    const root = parser.parse(text);
    const nodes = root.childNodes;

    const elements = [] as TextElement[];
    nodes.forEach(node => {
        if (node.childNodes && node.childNodes.length > 0) {
            try {
                elements.push({ text: node.childNodes[0].rawText, color: node.rawTagName });
            } catch (e) {
                output.error(e);
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
        const ctx = getContext().ctx;

        if (typeof text === 'string') {
            output.logAnnotated(parseAnnotatedText(text), ctx.config.colors)
        }
        else {
            filterConditionalTexts(text).forEach((t) => {
                output.logAnnotated(parseAnnotatedText(t), ctx.config.colors);
            });
        }
    }
}
