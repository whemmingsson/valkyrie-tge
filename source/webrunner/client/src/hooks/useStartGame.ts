
import { startGame } from '../api/api';
import { useMutation } from 'react-query';

const useStartGame = () => {
    return useMutation(startGame);
};

export default useStartGame;