import { gql, useMutation } from '@apollo/client';
import { Button } from '@material-ui/core';
import React from 'react';
import styled from 'styled-components';
import { CURRENT_USER_QUERY, useAuth } from '../hooks/useAuth';
import { UserInfo } from './UserInfo';

const SIGNOUT_MUTATION = gql`
    mutation SIGNOUT_MUTATION {
        unauthenticateUser {
            success
        }
    }
`;

export default function Layout({ children }) {
    const [doLogout, { loading: mutationLoading, error: mutationError }] = useMutation(SIGNOUT_MUTATION, {
        refetchQueries: [{ query: CURRENT_USER_QUERY }],
    });
    const { userLoading, userData, isAuth } = useAuth();

    const handleLogout = () => {
        doLogout()
            .then((res) => {
                console.log(res);
                if (res.data.success) {
                    console.log('loggedOut');
                }
            })
            .catch((error) => {
                console.error(error);
            });
    };
    return (
        <MainLayout>
            <header>
                <h3>Daily Log</h3>
                {userData?.authenticatedUser && (
                    <>
                        {/* <UserInfo info={userData} /> */}
                        <h4>Demouser7</h4>
                        <h4 id="logout" onClick={handleLogout}>
                            Logout
                        </h4>
                    </>
                )}
            </header>
            {children}
        </MainLayout>
    );
}
const MainLayout = styled.main`
    background: var(--background-color);
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    h3 {
        margin: 0;
        font-size: 1.5rem;
        flex-grow: 1;
    }
    h4 {
        margin: 0;
        padding-left: 2rem;
        font-size: 1.25rem;
    }
    #logout {
        cursor: pointer;
        transition: text-shadow 0.1s ease-in-out;

        :hover {
            color: #202020;
            text-shadow: 0 5px 15px rgba(25, 25, 25, 0.3);
        }
    }
    header {
        width: 90%;
        max-width: 900px;
        padding: 0.9rem;
        display: flex;
        align-items: center;
    }
`;
