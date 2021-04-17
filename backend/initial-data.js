const crypto = require('crypto');
const { createItems } = require('@keystonejs/server-side-graphql-client');

const randomString = () => crypto.randomBytes(6).hexSlice();

module.exports = async (keystone) => {
    // Count existing users
    const {
        data: {
            _allUsersMeta: { count = 0 },
        },
    } = await keystone.executeGraphQL({
        context: keystone.createContext({ skipAccessControl: true }),
        query: `query {
      _allUsersMeta {
        count
      }
    }`,
    });

    if (count === 0) {
        const password = 'testtest';
        const email = 't@t.t';

        const { errors } = await keystone.executeGraphQL({
            context: keystone.createContext({ skipAccessControl: true }),
            query: `mutation initialUser($password: String, $email: String) {
            createUser(data: {name: "Admin", email: $email, isAdmin: true, password: $password}) {
              id
            }
          }`,
            variables: { password, email },
        });

        if (errors) {
            console.log('failed to create initial user:');
            console.log(errors);
        } else {
            console.log(`

      User created:
        email: ${email}
        password: ${password}
      Please change these details after initial login.
      `);
        }
    }
    // initialize DB data

    try {
        await createItems({
            keystone,
            listKey: 'User',
            items: [
                {
                    data: {
                        password: 'test12314',
                        email: 'real@email.com',
                        name: 'Jimbo',
                        isAdmin: false,
                    },
                },
                {
                    data: {
                        password: '444444441',
                        email: 'rddeal@dsdemail.com',
                        name: 'Alfred',
                        isAdmin: false,
                    },
                },
                {
                    data: {
                        password: 'ddfsfsdfsdf',
                        email: 'df@dsdemail.com',
                        name: 'Frank Frank',
                        isAdmin: false,
                    },
                },
            ],
        });
        await createItems({
            keystone,
            listKey: 'Task',
            items: [
                {
                    data: {
                        body: 'Automated task creation',
                        creator: {
                            connect: {
                                id: Math.floor(Math.random() * 3) + 1,
                            },
                        },
                    },
                },
                {
                    data: {
                        password: '444444441',
                        email: 'rddeal@dsdemail.com',
                        name: 'Alfred',
                        isAdmin: false,
                    },
                },
            ],
        });
    } catch (err) {
        console.log(err);
    }
};
