import axios from 'axios';
import { Cookies } from 'react-cookie';
import { API_HOST } from '../config';

const host = API_HOST;

interface Game {
    name: string;
    description: string;
}

const getClientHeader = () => {
    const cookies = new Cookies();
    const clientid = cookies.get('clientId');
    return { clientid: clientid };
}

const apiRequest = async (method: 'get' | 'post', url: string, data?: any) => {
    const headers = getClientHeader();
    const response = await axios({ method, url: `${host}${url}`, data, headers });
    return response.data;
};

export const healthCheck = async () => {
    return apiRequest('get', '/health');
};

export const postCommand = async (command: string) => {
    return apiRequest('post', '/api/say', { command });
};

export const getGames = async (): Promise<Game[]> => {
    return apiRequest('get', '/api/games');
};

export const generateClientId = async (): Promise<string> => {
    return apiRequest('get', '/api/clientid');
};

export const startGame = async (gameFile: string) => {
    return apiRequest('post', '/api/start', { gameFile });
};

export const stopGame = async () => {
    return apiRequest('post', '/api/stop');
};