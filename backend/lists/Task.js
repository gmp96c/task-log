const { Text, Relationship, DateTimeUtc } = require('@keystonejs/fields');
const {
    AuthedRelationship,
} = require('@keystonejs/fields-authed-relationship');
const { updateItem } = require('@keystonejs/server-side-graphql-client');
const { access } = require('../access.js');

module.exports = (keystone) => ({
    fields: {
        body: { type: Text, isUnique: true, isRequired: true },
        createdAt: {
            type: DateTimeUtc,
            format: 'dd/MM/yyyy HH:mm O',
            access: {
                read: access.userIsAdminOrOwner,
                update: false,
                create: false,
                delete: false,
            },
            defaultValue: () => new Date(),
        },
        creator: {
            type: AuthedRelationship,
            ref: 'User',
            many: false,
            isRequired: true,
        },
        tips: {
            type: Relationship,
            ref: 'Tip.task',
            many: true,
        },
        usedBy: {
            type: Relationship,
            ref: 'User.currentTasks',
            many: true,
        },
    },
    labelResolver: (item) => item.body,
    // List-level access controls
    access: {
        read: access.userExists,
        update: access.userIsAdminOrOwner,
        create: access.userExists,
        delete: access.userIsAdminOrOwner,
    },
    hooks: {
        afterChange: async ({ operation, context, updatedItem }) => {
            console.log(operation, updatedItem);
            if (operation === 'create') {
                const updatedUser = await updateItem({
                    keystone,
                    listKey: 'User',
                    item: {
                        id: context.authedItem.id,
                        data: {
                            currentTasks: { connect: [{ id: updatedItem.id }] },
                        },
                    },
                });
            }
        },
    },
});
