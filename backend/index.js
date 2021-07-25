const { Keystone } = require('@keystonejs/keystone');
const { PasswordAuthStrategy } = require('@keystonejs/auth-password');
const { GraphQLApp } = require('@keystonejs/app-graphql');
const { AdminUIApp } = require('@keystonejs/app-admin-ui');
const { KnexAdapter: Adapter } = require('@keystonejs/adapter-knex');
const sessionExpress = require('express-session');
const MemoryStore = require('memorystore')(sessionExpress);
const UserSchema = require('./lists/User');
const LogSchema = require('./lists/Log.js');
const TaskSchema = require('./lists/Task');
const TipSchema = require('./lists/Tip');
const initialiseData = require('./initial-data');
require('dotenv').config();

const PROJECT_NAME = 'task-log';
const adapterConfig = {
    knexOptions: {
        client: 'pg',
        connection: {
            database: process.env.DB_NAME,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            host: process.env.DB_HOST,
            port: process.env.DB_PORT,
            ssl: {
                rejectUnauthorized: false,
            },
        },
    },
};

const keystone = new Keystone({
    adapter: new Adapter(adapterConfig),
    onConnect: process.env.CREATE_TABLES !== 'true' && initialiseData,
    cookie: {
        secure: false,
    },
    cookieSecret: process.env.SECRET,
    introspection: true,
    sessionStore: new MemoryStore({
        checkPeriod: 86400000, // prune expired entries every 24h
    }),
});
keystone.createList('User', UserSchema(keystone));
keystone.createList('Log', LogSchema);
keystone.createList('Task', TaskSchema(keystone));
keystone.createList('Tip', TipSchema);
const authStrategy = keystone.createAuthStrategy({
    type: PasswordAuthStrategy,
    list: 'User',
});

module.exports = {
    keystone,
    apps: [
        new GraphQLApp({}),
        new AdminUIApp({
            name: PROJECT_NAME,
            enableDefaultRoute: true,
            authStrategy,
            isAccessAllowed: ({
                authentication: { item: user, listKey: list },
            }) => !!user && !!user.isAdmin,
        }),
    ],
};
