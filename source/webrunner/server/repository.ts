import { getAvailableGames } from '../../engine/src/gameLoader.js';
import path from 'path';

export const getAllGames = () => {
    const gameFiles = getAvailableGames();
    const games = gameFiles.map(gameFile => {
        return {
            name: path.parse(gameFile).name,
            description: 'Feature not implemented yet'
        }
    });

    return games;
}