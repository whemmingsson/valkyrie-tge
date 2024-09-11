// api.ts
import axios from 'axios';

const host = 'http://localhost:3000';

interface Game {
    name: string;
    description: string;
}

export const postCommand = async (command: string) => {
    const response = await axios.post(`${host}/api/say`, { command });
    return response.data;
};

export const healthCheck = async () => {
    const response = await axios.get(`${host}/health`);
    return response.data;
}

export const getGames = async (): Promise<Game[]> => {
    const response = await axios.get(`${host}/api/games`);
    return response.data;
};

export const generateClientId = async (): Promise<string> => {
    const response = await axios.get(`${host}/api/clientid`);
    return response.data;
};