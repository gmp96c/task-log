import { gql, useQuery } from '@apollo/client';

import { useState, useEffect } from 'react';
import { TaskConfig, UserConfig } from '../Types';

const CURRENT_USER_QUERY = gql`
    query {
        authenticatedUser {
            name
            email
            id
        }
    }
`;
interface useAuthConfig {
    userLoading: boolean;
    userData: { authenticatedUser: UserConfig } | undefined;
    isAuth: boolean;
    id: string | undefined;
}

function useAuth(): useAuthConfig {
    const { loading, data } = useQuery<{ authenticatedUser: UserConfig }>(CURRENT_USER_QUERY);
    const [isAuth, setAuth] = useState(false);
    const [id, setId] = useState<string | undefined>();
    useEffect(() => {
        if (isAuth !== !!data?.authenticatedUser) {
            setAuth(!!data?.authenticatedUser);
        }
        if (data?.authenticatedUser?.id !== id) {
            setId(data?.authenticatedUser?.id);
        }
    }, [data]);
    return { userLoading: loading, userData: data, isAuth, id };
}

export { CURRENT_USER_QUERY, useAuth };
