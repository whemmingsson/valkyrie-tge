
import { stopGame } from '../api/api';
import { useMutation } from 'react-query';

const useStopGame = () => {
    return useMutation(stopGame);
};

export default useStopGame;