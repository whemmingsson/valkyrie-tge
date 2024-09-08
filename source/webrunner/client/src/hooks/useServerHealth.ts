// usePostData.ts
import { useQuery } from 'react-query';
import { healthCheck } from '../api/api';

const useServerHealth = () => {
    return useQuery('health', healthCheck);
};

export default useServerHealth;