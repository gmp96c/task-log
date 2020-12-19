import { gql, useMutation } from "@apollo/client";
import { Button } from "@material-ui/core";
import React from "react";
import styled from "styled-components";
import { CURRENT_USER_QUERY, useIsAuth, useUser } from "../hooks/User";
import { UserInfo } from "./UserInfo";

const SIGNOUT_MUTATION = gql`
  mutation SIGNOUT_MUTATION {
    unauthenticateUser {
      success
    }
  }
`;

export default function Layout({ children }) {
  const [
    doLogout,
    { loading: mutationLoading, error: mutationError },
  ] = useMutation(SIGNOUT_MUTATION, {
    refetchQueries: [{ query: CURRENT_USER_QUERY }],
  });
  const isAuth = useIsAuth();

  const handleLogout = () => {
    doLogout()
      .then((res) => {
        console.log(res);
        if (res.data.success) {
          console.log("loggedOut");
        }
      })
      .catch((err) => {
        console.error(err);
      });
  };
  return (
    <MainLayout>
      <header>
        <h3>Daily Log</h3>
        <UserInfo />
        <Button color="primary" onClick={handleLogout}>
          Logout
        </Button>
      </header>
      {children}
    </MainLayout>
  );
}
const MainLayout = styled.main`
  background: red;
`;
