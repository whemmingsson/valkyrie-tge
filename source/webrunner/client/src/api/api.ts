// api.ts
import axios from 'axios';

const host = 'http://localhost:3000';

export const postCommand = async (command: string) => {
    const response = await axios.post(`${host}/api/say`, { command });
    return response.data;
};

export const healthCheck = async () => {
    const response = await axios.get(`${host}/health`);
    return response.data;
}