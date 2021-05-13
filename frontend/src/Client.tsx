import { ApolloProvider, ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';
// import 'cross-fetch/polyfill';

const link = createHttpLink({
  uri: process.env.KEYSTONE_URI,
  credentials: 'include',
  fetch: (...args) => fetch(...args),
});

export const client = new ApolloClient({
  link,
  cache: new InMemoryCache(),
});
