const { Text, Relationship, DateTimeUtc } = require('@keystonejs/fields');
const { access } = require('../access.js');

module.exports = {
  fields: {
    body: { type: Text },
    createdAt: {
      type: DateTimeUtc,
      format: 'dd/MM/yyyy HH:mm O',
    },
    createdBy: {
      type: Relationship,
      ref: 'User',
      many: false,
      isRequired: true,
    },
    task: {
      type: Relationship,
      ref: 'Task',
      many: false,
      isRequired: true,
    },
    pinnedBy: {
      type: Relationship,
      ref: 'User.pinnedTips',
      many: true,
    },
  },
  // List-level access controls
  access: {
    read: access.userExists,
    update: access.userIsAdmin,
    create: access.userExists,
    delete: access.userIsAdminOrOwner,
  },
};
