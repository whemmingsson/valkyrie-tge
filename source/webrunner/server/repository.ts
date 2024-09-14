import { getAvailableGames } from '../../engine/src/gameLoader.js';

export const getAllGames = () => {
    const gameFiles = getAvailableGames();
    const games = gameFiles.map(gameFile => {
        return {
            name: gameFile,
            description: 'Feature not implemented yet'
        }
    });

    return games;
}