'use strict';

const { Model } = require('objection');

class UserRole extends Model {

  static get tableName() {
    return 'users_roles';
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['role'],

      properties: {
        id: { type: 'integer' },
        role: { type: 'string' }
      }
    };
  }

}

module.exports = UserRole;