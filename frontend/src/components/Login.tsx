import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { TextField, Button } from "@material-ui/core";
import { useMutation, gql } from "@apollo/client";
import { CURRENT_USER_QUERY } from "../hooks/User";

const SIGNIN_MUTATION = gql`
  mutation SIGNIN_MUTATION($email: String!, $password: String!) {
    authenticateUserWithPassword(email: $email, password: $password) {
      token
    }
  }
`;

export const Login = ({}) => {
  const [email, setEmail] = useState("demo@demo.demo");
  const [password, setPassword] = useState("demodemo");
  const [
    doLogin,
    { loading: mutationLoading, error: mutationError },
  ] = useMutation(SIGNIN_MUTATION, {
    variables: { email, password },
    refetchQueries: [{ query: CURRENT_USER_QUERY }],
  });

  const submitHandler = async () => {
    try {
      console.log({ email, password });
      let loginRes = await doLogin();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <LoginStyle>
      <form id="loginBody">
        <h2 id="loginHeader">Login</h2>
        {!mutationLoading ? (
          <>
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
            <div id="loginControl">
              <Button color="primary">Sign Up</Button>
              <Button
                variant="contained"
                color="secondary"
                onClick={submitHandler}
              >
                Login
              </Button>
            </div>
          </>
        ) : (
          <h3>Loading lol!</h3>
        )}
      </form>
    </LoginStyle>
  );
};
const LoginStyle = styled.main`
  display: flex;
  height: 100vh;
  width: 100vw;
  box-sizing: border-box;
  background: #d3d3d3;
  align-items: center;
  justify-content: center;
  #loginBody {
    background: #f3f3f3;
    min-width: 20rem;
    padding: 1.5rem;
    display: flex;
    flex-direction: column;
    border-radius: 5px;
    box-shadow: 3px 3px 5px 6px #bfbfbf;
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
      margin-top: 1rem;
      display: flex;
      justify-content: space-between;
    }
  }
`;
