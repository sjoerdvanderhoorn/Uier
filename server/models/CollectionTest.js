'use strict';

const { Model } = require('objection');

class CollectionTest extends Model {

  static get tableName() {
    return 'collections_tests';
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['browser', 'urlDomain'],

      properties: {
        id: { type: 'integer' },
        browser: { type: 'string' },
        urlDomain: { type: 'string' }
      }
    };
  }

  // This object defines the relations to other models.
  static get relationMappings() {
    return {
      collectionTestTest: {
        relation: Model.BelongsToOneRelation,
        modelClass: __dirname + '/Test',
        join: {
          from: 'collections_tests.test',
          to: 'tests.uid'
        }
      }
    };
  }


}

module.exports = CollectionTest;