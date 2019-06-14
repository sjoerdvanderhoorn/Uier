'use strict';

const { Model } = require('objection');

class User extends Model {

  static get tableName() {
    return 'users';
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['name'],

      properties: {
        id: { type: 'integer' },
        uid: { type: 'string' },
        organization: { type: 'integer' },
        email: { type: 'string' },
        password: { type: 'string' },
        name: { type: 'string' }
      }
    };
  }

  // This object defines the relations to other models.
  static get relationMappings() {
    return {
      userOrganization: {
        relation: Model.BelongsToOneRelation,
        modelClass: __dirname + '/Organization',
        join: {
          from: 'users.organization',
          to: 'organizations.id'
        }
      },
      roles: {
        relation: Model.HasManyRelation,
        modelClass: __dirname + '/UserRole',
        join: {
          from: 'users.id',
          to: 'users_roles.user'
        }
      }
    };
  }

}

module.exports = User;