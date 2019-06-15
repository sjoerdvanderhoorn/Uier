'use strict';

const { Model } = require('objection');

class RunStep extends Model {

  static get tableName() {
    return 'runs_steps';
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['command'],

      properties: {
        id: { type: 'integer' },
        name: { type: 'string' },
        command: { type: 'string' },
        target_query: { type: 'string' },
        target_type: { type: 'string' },
        value: { type: 'string' }
      }
    };
  }

}

module.exports = RunStep;