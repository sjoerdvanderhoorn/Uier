'use strict';

const { Model } = require('objection');

class Test extends Model {

  static get tableName() {
    return 'tests';
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['name', 'browser', 'urlDomain', 'urlPath'],

      properties: {
        id: { type: 'integer' },
        uid: { type: 'string' },
        organization: { type: 'integer' },
        name: { type: 'string' },
        purpose: { type: 'string' },
        browser: { type: 'string' },
        urlDomain: { type: 'string' },
        urlPath: { type: 'string' }
      }
    };
  }

  // This object defines the relations to other models.
  static get relationMappings() {
    return {
      testOrganization: {
        relation: Model.BelongsToOneRelation,
        modelClass: __dirname + '/Organization',
        join: {
          from: 'tests.organization',
          to: 'organizations.id'
        }
      },
      steps: {
        relation: Model.HasManyRelation,
        modelClass: __dirname + '/TestStep',
        join: {
          from: 'tests.id',
          to: 'tests_steps.test'
        }
      }
    };
  }

}

module.exports = Test;