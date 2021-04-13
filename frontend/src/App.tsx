import React, { Component, useState, useEffect, useReducer } from 'react';
import styled from 'styled-components';
import { useQuery, useMutation, gql } from '@apollo/client';
import { Login } from './components/Login';
import { useAuth } from './hooks/useAuth';
import Layout from './components/Layout';
import { AddTask } from './components/AddTask';
import { Tasks } from './components/Tasks';


export const App = () => {
    const { userLoading, isAuth, userData } = useAuth();
    if (userLoading) {
        return <h1>loading</h1>;
    }
    return (
        <Layout>
            {isAuth ? (
                <MainWrapper>
                    <AddTask user={userData?.authenticatedUser?.id} />
                    <Tasks user={userData?.authenticatedUser?.id} />
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
    width: 90%;
    max-width: 900px;
    display: flex;
    width: 100%;
    flex-direction: column;
`;
