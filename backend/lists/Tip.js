const {
    Text,
    Relationship,
    DateTimeUtc,
    Integer,
} = require('@keystonejs/fields');
const {
    AuthedRelationship,
} = require('@keystonejs/fields-authed-relationship');
const { updateItem } = require('@keystonejs/server-side-graphql-client');
const { access } = require('../access.js');

module.exports = {
    fields: {
        body: { type: Text },
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
        createdBy: {
            type: AuthedRelationship,
            ref: 'User',
            many: false,
            isRequired: true,
        },
        task: {
            type: Relationship,
            ref: 'Task.tips',
            many: false,
            isRequired: true,
        },
        pinnedBy: {
            type: Relationship,
            ref: 'User.pinnedTips',
            many: true,
        },
        pinnedByCount: {
            type: Integer,
            defaultValue: 1,
        },
    },
    labelResolver: (item) => item.body,
    // List-level access controls
    access: {
        read: access.userExists,
        update: access.userIsAdmin,
        create: access.userExists,
        delete: access.userIsAdminOrOwner,
    },
    hooks: {
        afterChange: async ({
            operation,
            context,
            existingItem,
            updatedItem,
        }) => {
            // throw new Error(operation, existingItem,  updatedItem);
            if (operation === 'update') {
                // const updatedUser = await updateItem({
                //   keystone,
                //   listKey: 'User',
                //   item: {
                //     id: context.authedItem.id,
                //     data: { currentTasks: { connect: [{ id: updatedItem.id }] } },
                //   },
                // });
            }
        },
    },
};
