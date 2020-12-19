import gql from "graphql-tag";
import { useQuery } from "@apollo/client";

const CURRENT_USER_QUERY = gql`
  query {
    authenticatedUser {
      name
      email
      id
    }
  }
`;

function useUser() {
  const { data, loading, error } = useQuery(CURRENT_USER_QUERY);
  return { loading, data };
}

function useIsAuth() {
  const { loading, data } = useUser();
  return loading ? false : data.authenticatedUser;
}

export { CURRENT_USER_QUERY, useUser, useIsAuth };
