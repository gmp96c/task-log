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
            isRequired: false,
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
    },
    labelResolver: (item) => item.body,
    // List-level access controls
    access: {
        read: access.userExists,
        update: (props) => {
            try {
                // If the target of the update is connecting/disconnecting a relationship with the current user it permits it, otherwise it does not.
                const user = props.authentication.item;
                const target =
                    props.originalInput?.pinnedBy?.connect ||
                    props.originalInput?.pinnedBy?.disconnect;
                const targetId = target[0].id;
                return user.id === targetId || access.userIsAdmin(props);
            } catch (err) {
                console.log(`err ${err}`);
                return false;
            }
        },
        create: access.userExists,
        delete: access.userIsAdminOrOwner,
    },
};
