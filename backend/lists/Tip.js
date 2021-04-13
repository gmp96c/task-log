const { Text, Relationship, DateTimeUtc } = require('@keystonejs/fields');
const {
  AuthedRelationship,
} = require('@keystonejs/fields-authed-relationship');
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
  },
  labelResolver: (item) => item.body,
  // List-level access controls
  access: {
    read: access.userExists,
    update: access.userIsAdmin,
    create: access.userExists,
    delete: access.userIsAdminOrOwner,
  },
};
