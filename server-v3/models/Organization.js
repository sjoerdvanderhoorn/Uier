'use strict';

const { Model } = require('objection');

class Organization extends Model {

  static get tableName() {
    return 'organizations';
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['name'],

      properties: {
        id: { type: 'integer' },
        uid: { type: 'string' },
        active: {type: 'boolean' },
        name: { type: 'string' }
      }
    };
  }

}

module.exports = Organization;