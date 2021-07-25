const {
    Password,
    Checkbox,
    Text,
    Relationship,
} = require('@keystonejs/fields');
const { access } = require('../access.js');

module.exports = {
    fields: {
        name: { type: Text },
        email: {
            type: Text,
            isUnique: true,
        },
        isAdmin: {
            type: Checkbox,
            access: {
                update: access.userIsAdmin,
            },
            defaultValue: () => false,
        },
        password: {
            type: Password,
        },
        currentTasks: {
            type: Relationship,
            ref: 'Task.usedBy',
            many: true,
        },
        logs: {
            type: Relationship,
            ref: 'Log',
            many: true,
        },
        pinnedTips: {
            type: Relationship,
            ref: 'Tip.pinnedBy',
            many: true,
        },
    },
    // List-level access controls
    access: {
        read: access.userIsAdminOrOwner,
        update: access.userIsAdminOrOwner,
        create: true,
        delete: access.userIsAdmin,
        auth: true,
    },
    // hooks: {
    //   resolveInput: async function({operation, context, originalInput, resolvedData, ...rest }){      // console.log({operation, context, originalInput, resolvedData, ...rest });
    //     if(operation === 'update'){
    //       // console.log('context',context);
    //       // console.log('originalInput',originalInput);
    //     }
    //     // console.log(resolvedData);
    //     return resolvedData;
    //   }
    // }
};
