import { getAvailableGames } from '../../engine/src/gameLoader.js';

export const getAllGames = () => {
    const games = getAvailableGames();
    return games;
}