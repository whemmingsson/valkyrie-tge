import { useQuery } from 'react-query';
import { generateClientId } from '../api/api';
import { useCookies } from 'react-cookie';

const useClientId = () => {
    const [cookies, setCookie] = useCookies(['clientId']);
    const clientId = cookies['clientId'];

    const { data: clientIdFromServer, isSuccess } = useQuery('client-id', generateClientId, {
        enabled: !clientId, // Only run the query if clientId is not in cookies
        onSuccess: (data) => {
            // Set the cookie when the clientId is successfully fetched
            setCookie('clientId', data);
        }
    });

    if (clientId) {
        return clientId;
    }

    if (isSuccess) {
        return clientIdFromServer;
    }

    return null;
};

export default useClientId;