const {
    Password,
    Checkbox,
    Text,
    Relationship,
} = require('@keystonejs/fields');
const { updateItem } = require('@keystonejs/server-side-graphql-client');
const { access } = require('../access.js');

module.exports = (keystone) => ({
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
    hooks: {
        async afterChange({ operation, context, updatedItem }) {
            if (operation === 'create') {
                const updatedUser = await updateItem({
                    keystone,
                    listKey: 'User',
                    item: {
                        id: updatedItem.id,
                        data: {
                            currentTasks: { connect: [{ id: 2 }] },
                            pinnedTips: { connect: [{ id: 2 }] },
                        },
                    },
                });
            }
        },
    },
});
