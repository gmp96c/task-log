import React, { Component, useState, useEffect, useReducer } from "react";
import styled from "styled-components";
import { useQuery, useMutation, gql } from "@apollo/client";
import CssBaseline from "@material-ui/core/CssBaseline";
import { Login } from "./components/Login";
import { useUser } from "./hooks/User";

export const App = () => {
  const auth = useUser();
  if (auth.loading) {
    return <h1>loading</h1>;
  }
  return (
    <CssBaseline>
      {auth.data !== undefined ? (
        <MainWrapper>
          <h3>whats up?</h3>
        </MainWrapper>
      ) : (
        <Login />
      )}
    </CssBaseline>
  );
};

const MainWrapper = styled.main`
  grid-area: main;
  background: grey;
  padding: 25px;
  .taskList {
    display: flex;
    flex-direction: column;
    margin-top: 2rem;
    gap: 10px;
  }
`;
