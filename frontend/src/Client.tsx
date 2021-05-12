import { ApolloProvider, ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';
import 'cross-fetch/polyfill';

const link = createHttpLink({
  uri: process.env.KEYSTONE_URI,
  credentials: 'include',
});

export const client = new ApolloClient({
  link,
  cache: new InMemoryCache(),
});
