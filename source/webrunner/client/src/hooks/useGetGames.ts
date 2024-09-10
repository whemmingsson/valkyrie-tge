
import { useQuery } from 'react-query';
import { getGames } from '../api/api';

const useGetGames = () => {
    return useQuery('all-games', getGames);
};

export default useGetGames;