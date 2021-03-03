import { gql, useQuery } from '@apollo/client';

import { useState, useEffect } from 'react';

const CURRENT_USER_QUERY = gql`
    query {
        authenticatedUser {
            name
            email
            id
        }
    }
`;

function useAuth() {
    const { loading, data } = useQuery(CURRENT_USER_QUERY);
    const [isAuth, setAuth] = useState(false);
    const [id, setId] = useState();
    useEffect(() => {
        setAuth(!!data?.authenticatedUser);
        // setId(data?.authenticatedUser.id)
    }, [data]);
    return { userLoading: loading, userData: data, isAuth };
}

export { CURRENT_USER_QUERY, useAuth };
