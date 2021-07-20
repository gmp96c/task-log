import React, { Component, useState, useEffect, useReducer } from 'react';
import styled from 'styled-components';
import { useQuery, useMutation, gql } from '@apollo/client';
import { Login } from './components/Login';
import { useAuth } from './hooks/useAuth';
import Layout from './components/Layout';
import { AddTask } from './components/AddTask';
import { Tasks } from './components/Tasks';
import { UserConfig } from './Types';
import { UserContextWrapper } from './util/UserContextWrapper';

export const App: React.FC = () => {
    const { userLoading, isAuth, userData } = useAuth();
    if (userLoading) {
        return <h1>loading</h1>;
    }
    return (
        <Layout>
            {isAuth ? (
                <MainWrapper>
                    <UserContextWrapper value={userData?.authenticatedUser}>
                        <AddTask />
                        <Tasks />
                    </UserContextWrapper>
                </MainWrapper>
            ) : (
                <Login />
            )}
        </Layout>
    );
};

const MainWrapper = styled.main`
    grid-area: main;
    padding: 25px;
    max-width: 900px;
    display: flex;
    width: 100%;
    height: 100%;
    flex-direction: column;
`;
