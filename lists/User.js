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
      // Field-level access controls
      // Here, we set more restrictive field access so a non-admin cannot make themselves admin.
      access: {
        update: access.userIsAdmin,
      },
    },
    password: {
      type: Password,
    },
    currentTasks: {
      type: Relationship,
      ref: 'Task',
      many: true,
    },
    historicTasks: {
      type: Relationship,
      ref: 'Task',
      many: true,
    },
    logs: {
      type: Relationship,
      ref: 'Log',
      many: true,
    },
    pinnedTips: {
      type: Relationship,
      ref: 'Log',
      many: true,
    },
  },
  // List-level access controls
  access: {
    read: access.userIsAdminOrOwner,
    update: access.userIsAdminOrOwner,
    create: access.userIsAdmin,
    delete: access.userIsAdmin,
    auth: true,
  },
};
