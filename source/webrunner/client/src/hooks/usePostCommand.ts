// usePostData.ts
import { useMutation } from 'react-query';
import { postCommand } from '../api/api';

const usePostCommand = () => {
    return useMutation(postCommand);
};

export default usePostCommand;