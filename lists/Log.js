const { Text, Relationship, DateTimeUtc } = require('@keystonejs/fields');
const { access } = require('../access.js');

module.exports = {
  fields: {
    body: { type: Text },
    createdAt: {
      type: DateTimeUtc,
      format: 'dd/MM/yyyy HH:mm O',
    },
    creator: {
      type: Relationship,
      ref: 'User',
      many: false,
      isRequired: true,
    },
    task: {
      type: Relationship,
      ref: 'Task',
      many: false,
    },
  },
  // List-level access controls
  access: {
    read: access.userIsAdminOrOwner,
    update: access.userIsAdminOrOwner,
    create: access.userExists,
    delete: access.userIsAdminOrOwner,
  },
};
