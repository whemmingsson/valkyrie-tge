// api.ts
import axios from 'axios';
import { Cookies } from 'react-cookie';

const host = 'http://localhost:3000';

interface Game {
    name: string;
    description: string;
}

const getClientHeader = () => {
    const cookies = new Cookies();
    const clientid = cookies.get('clientId');
    return { clientid: clientid };
}

export const healthCheck = async () => {
    const response = await axios.get(`${host}/health`);
    return response.data;
}

export const postCommand = async (command: string) => {
    const response = await axios.post(`${host}/api/say`, { command }, { headers: getClientHeader() });
    return response.data;
};

export const getGames = async (): Promise<Game[]> => {
    const response = await axios.get(`${host}/api/games`);
    return response.data;
};

export const generateClientId = async (): Promise<string> => {
    const response = await axios.get(`${host}/api/clientid`);
    return response.data;
};

export const startGame = async (gameFile: string) => {
    const response = await axios.post(`${host}/api/start`, { gameFile }, { headers: getClientHeader() });
    return response.data;
};

export const stopGame = async () => {
    const response = await axios.post(`${host}/api/stop`, { headers: getClientHeader() });
    return response.data;
};