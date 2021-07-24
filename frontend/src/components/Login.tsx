import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { TextField, Button, CircularProgress } from '@material-ui/core';
import { useMutation, gql } from '@apollo/client';
import { CURRENT_USER_QUERY } from '../hooks/useAuth';

export const SIGNIN_MUTATION = gql`
    mutation SIGNIN_MUTATION($email: String!, $password: String!) {
        authenticateUserWithPassword(email: $email, password: $password) {
            token
        }
    }
`;

const SIGNUP_MUTATION = gql`
    mutation SIGNUP_MUTATION($email: String!, $password: String!, $name: String!) {
        createUser(data: { email: $email, password: $password, name: $name }) {
            id
        }
    }
`;

export const Login: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [signUp, setSignUp] = useState(false);
    const [error, setError] = useState('');
    const [name, setName] = useState('');
    const [doLogin, { loading: mutationLoading, error: mutationError }] = useMutation(SIGNIN_MUTATION, {
        variables: { email, password },
        refetchQueries: [{ query: CURRENT_USER_QUERY }],
    });
    const [doSignup, { loading: signupLoading, error: signupError }] = useMutation(SIGNUP_MUTATION, {
        variables: { email, password, name },
        onCompleted: doLogin,
        onError: (error) => {
            setError('Email already has an account.');
        },
    });
    const submitHandler = async (): Promise<void> => {
        try {
            if (signUp) {
                try {
                    if (name.length < 3) {
                        throw new Error('Please set a username over 3 characters');
                    }
                    if (password.length < 8) {
                        throw new Error('Please make your password longer than 8 characters.');
                    }
                    if (confirmPassword !== password) {
                        throw new Error('Your passwords do not match.');
                    }
                } catch (err) {
                    console.log('setting a');
                    setError(err.message);
                    return;
                }
                await doSignup();
            } else {
                const loginRes = await doLogin();
            }
        } catch (err) {
            console.log('setting b');
            setError(signUp ? 'Invalid Signup Info' : 'Invalid Login Info');
        }
    };

    return (
        <LoginStyle>
            <form id="loginBody">
                <h2 id="loginHeader"> {signUp ? 'Sign Up' : 'Login'}</h2>

                <>
                    {signUp && (
                        <TextField
                            className="loginInput"
                            label="Name"
                            type="input"
                            value={name}
                            onChange={(e) => {
                                setName(e.target.value);
                            }}
                        />
                    )}
                    <TextField
                        className="loginInput"
                        label="Email"
                        type="email"
                        value={email}
                        onChange={(e) => {
                            setEmail(e.target.value);
                        }}
                    />
                    <TextField
                        className="loginInput"
                        label="Password"
                        type="password"
                        autoComplete="current-password"
                        value={password}
                        onChange={(e) => {
                            setPassword(e.target.value);
                        }}
                    />
                    {signUp && (
                        <TextField
                            className="loginInput"
                            label="Confirm Password"
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => {
                                setConfirmPassword(e.target.value);
                            }}
                        />
                    )}
                    <div id="loginControl">
                        {mutationLoading || signupLoading ? (
                            <CircularProgress />
                        ) : (
                            <>
                                <Button
                                    color="primary"
                                    onClick={() => {
                                        setError('');
                                        setSignUp(!signUp);
                                    }}
                                >
                                    {!signUp ? 'Sign Up' : 'Login'}
                                </Button>
                                <Button variant="contained" color="secondary" onClick={submitHandler}>
                                    {signUp ? 'Sign Up' : 'Login'}
                                </Button>
                            </>
                        )}
                    </div>
                    {error && <h4 id="LoginError">{error}</h4>}
                </>
            </form>
        </LoginStyle>
    );
};
const LoginStyle = styled.main`
    display: flex;
    height: 100%;
    width: 100%;
    box-sizing: border-box;
    background: #d3d3d3;
    align-items: center;
    justify-content: center;
    #LoginError {
        margin: 0;
        padding: 0;
        font-size: 1rem;
        max-width: 20rem;
        word-wrap: normal;
        color: red;
        margin-top: 1rem;
        text-align: center;
    }
    #loginBody {
        background: #f3f3f3;
        min-width: 20rem;
        padding: 1.5rem;
        display: flex;
        flex-direction: column;
        border-radius: 5px;
        box-shadow: var(--box-shadow);
        #loginHeader {
            text-align: center;
            padding: 0;
            margin-top: 0;
            margin-bottom: 1rem;
            width: 100%;
        }
        .loginInput {
            width: 100%;
            padding: 0.5rem 0;
        }
        #loginControl {
            /* margin-top: 1rem; */
            display: flex;
            justify-content: space-between;
            div {
                margin: 0 auto;
            }
        }
    }
`;
