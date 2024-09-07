import output from "./core/io/output.js";
import debug from "./debug.js";
import gameContext from "./state/game-context.js";
import fs from 'fs';

const saveTableFileName = "saveTable.json";

const updateSaveTable = (now: Date, fileName: string, gameName: string) => {
    // Keep track of the latest save files in a table
    if (!fs.existsSync(saveTableFileName)) {
        fs.writeFileSync(saveTableFileName, "{}");
    }

    let saveTable = JSON.parse(fs.readFileSync(saveTableFileName, 'utf8'));
    saveTable[gameName] = { file: fileName, date: now.toISOString() };
    fs.writeFileSync(saveTableFileName, JSON.stringify(saveTable));
}

const saveGameState = (quickSave?: boolean): string => {
    const ctx = gameContext.ctx;
    const ctxString = JSON.stringify(gameContext.getSavableContext(), null, 2);

    // Save to file as a new file and add datetime information to filename
    const now = new Date();
    const fileName = quickSave ? `${ctx.gameName}-quicksave.json` : `${ctx.gameName}-save-${now.toISOString()}.json`;
    fs.writeFileSync(fileName, ctxString);
    updateSaveTable(now, fileName, ctx.gameName);

    if (debug.DEBUG_MODE) {
        output.debug(`Game state saved to ${fileName}\n`);
    }

    return fileName
};

export default saveGameState;