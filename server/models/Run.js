'use strict';

const { Model } = require('objection');

class Run extends Model {

  static get tableName() {
    return 'runs';
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['browser', 'urlDomain'],

      properties: {
        id: { type: 'integer' },
        uid: { type: 'string' },
        organization: { type: 'integer' },
        created: { type: 'timestamp' },
        status: { type: 'string' },
        browser: { type: 'string' },
        urlDomain: { type: 'string' },
        urlPath: { type: 'string' },
        start: { type: 'timestamp' },
        end: { type: 'timestamp' }
      }
    };
  }

  // This object defines the relations to other models.
  static get relationMappings() {
    return {
      runOrganization: {
        relation: Model.BelongsToOneRelation,
        modelClass: __dirname + '/Organization',
        join: {
          from: 'runs.organization',
          to: 'organizations.id'
        }
      },
      steps: {
        relation: Model.HasManyRelation,
        modelClass: __dirname + '/RunStep',
        join: {
          from: 'runs.id',
          to: 'runs_steps.run'
        }
      },
      runTest: {
        relation: Model.BelongsToOneRelation,
        modelClass: __dirname + '/Test',
        join: {
          from: 'runs.test',
          to: 'tests.uid'
        }
      }
    };
  }

}

module.exports = Run;