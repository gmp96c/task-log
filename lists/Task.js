const { Text, Relationship, DateTimeUtc } = require('@keystonejs/fields');
const { access } = require('../access.js');

module.exports = {
  fields: {
    body: { type: Text },
    createdAt: {
      type: DateTimeUtc,
      format: 'dd/MM/yyyy HH:mm O',
      access: false,
    },
    creator: {
      type: Relationship,
      ref: 'User',
      many: false,
      isRequired: true,
      access: false,
    },
    users: {
      type: Relationship,
      ref: 'User',
      many: true,
      access: false,
    },
    tips: {
      type: Relationship,
      ref: 'Tip',
      many: true,
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
