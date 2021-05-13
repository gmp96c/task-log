import * as React from 'react';
import ReactDOM from 'react-dom';
import { setContext } from '@apollo/client/link/context';
import { ApolloProvider, ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';
import { App } from './App';
import 'normalize.css';
import 'react-loader-spinner/dist/loader/css/react-spinner-loader.css';
import { client } from './Client';

const Index = () => (
    <ApolloProvider client={client}>
        <App />
    </ApolloProvider>
);

ReactDOM.render(<Index />, document.querySelector('#root'));
