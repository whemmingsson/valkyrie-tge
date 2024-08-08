import parser from "node-html-parser";
import logger from '../core/io/logger.js';
import Types from "../types/types.js";

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

export default parseAnnotatedText;