const crypto = require('crypto');
const { createItems } = require('@keystonejs/server-side-graphql-client');

const randomString = () => crypto.randomBytes(6).hexSlice();
const faker = require('faker');

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

    // if (count === 0) {
    //     const password = 'testtest';
    //     const email = 't@t.t';

    //     const { errors } = await keystone.executeGraphQL({
    //         context: keystone.createContext({ skipAccessControl: true }),
    //         query: `mutation initialUser($password: String, $email: String) {
    //         createUser(data: {name: "Admin", email: $email, isAdmin: true, password: $password}) {
    //           id
    //         }
    //       }`,
    //         variables: { password, email },
    //     });

    //     if (errors) {
    //         console.log('failed to create initial user:');
    //         console.log(errors);
    //     } else {
    //         console.log(`

    //   User created:
    //     email: ${email}
    //     password: ${password}
    //   Please change these details after initial login.
    //   `);
    //     }
    // }
    // initialize DB data

    // try {
    //     await createItems({
    //         keystone,
    //         listKey: 'User',
    //         items: [
    //             {
    //                 data: {
    //                     password: 'test12314',
    //                     email: 'real@email.com',
    //                     name: 'Jimbo',
    //                     isAdmin: false,
    //                 },
    //             },
    //             {
    //                 data: {
    //                     password: '444444441',
    //                     email: 'rddeal@dsdemail.com',
    //                     name: 'Alfred',
    //                     isAdmin: false,
    //                 },
    //             },
    //             {
    //                 data: {
    //                     password: 'ddfsfsdfsdf',
    //                     email: 'df@dsdemail.com',
    //                     name: 'Frank Frank',
    //                     isAdmin: false,
    //                 },
    //             },
    //         ],
    //     });
    //     await createItems({
    //         keystone,
    //         listKey: 'Task',
    //         items: [
    //             'Another Auto Task',
    //             'Tasks are nice',
    //             'Created Task',
    //             'Eat Vegetan',
    //             'food make it',
    //             'download everything',
    //             'organize everything on hd',
    //             'Land on mars',
    //             'I need another task stat!',
    //             // ...new Array(100).fill(faker.lorem.sentence()),
    //         ].map((el) => createTask(el)),
    //     });
    //     await createItems({
    //         keystone,
    //         listKey: 'Tip',
    //         items: [
    //             "Here's a suggestion",
    //             "Why don't you try...",
    //             'Have you thought about?',
    //             'You should really!',
    //             'I think this would work out',
    //             'Have you ever considered',
    //             'I would strong recommend',
    //             'Whats the deal with',
    //             "Thanks that's a good idea",
    //             ...Array.from(Array(10)).map(() => faker.lorem.sentence()),
    //         ].map((el) => createTip(el)),
    //     });
    // } catch (err) {
    //     console.log(err);
    // }
};
function createTask(body) {
    return {
        data: {
            body,
            // creator: {
            //     connect: {
            //         id: Math.floor(Math.random() * 3) + 1,
            //     },
            // },
            usedBy: {
                connect: [
                    {
                        id: Math.floor(Math.random() * 3) + 1,
                    },
                ],
            },
        },
    };
}
function createTip(body) {
    return {
        data: {
            body,
            pinnedBy: {
                connect: [
                    {
                        id: Math.floor(Math.random() * 3) + 1,
                    },
                ],
            },

            task: {
                connect: {
                    id: Math.floor(Math.random() * 9) + 1,
                },
            },
        },
    };
}
function createLog() {
    return {
        data: {
            body: `{"blocks":[{"key":"3b76q","text":"${faker.lorem.paragraph()}","type":"unstyled","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}}],"entityMap":{}}`,
            // creator: {
            //     connect: {
            //         id: Math.floor(Math.random() * 3) + 1,
            //     },
            // },
            task: {
                connect: {
                    id: Math.floor(Math.random() * 9) + 1,
                },
            },
        },
    };
}
