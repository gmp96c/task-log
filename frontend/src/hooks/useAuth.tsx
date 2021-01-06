import gql from "graphql-tag";
import { useQuery } from "@apollo/client";
import { useState, useEffect } from "react";
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
  useEffect(() => {
    setAuth(!!data?.authenticatedUser);
  }, [data]);
  return { userLoading: loading, userData: data, isAuth };
}
function useTasks() {
  const { loading, data } = useQuery(CURRENT_USER_QUERY);
  const [tasks, setTasks] = useState([]);
}
export { CURRENT_USER_QUERY, useAuth };
