import * as React from 'react';
import ReactDOM from 'react-dom';
import { ApolloProvider, ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { App } from './App';
import 'normalize.css';

const link = createHttpLink({
    uri: process.env.KEYSTONE_URI,
    credentials: 'include',
});

export const client = new ApolloClient({
    link,
    cache: new InMemoryCache(),
});
export const Index = () => (
    <ApolloProvider client={client}>
        <App />
    </ApolloProvider>
);

ReactDOM.render(<Index />, document.querySelector('#root'));
