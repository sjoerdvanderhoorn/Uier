'use strict';

const { Model } = require('objection');

class Collection extends Model {

  static get tableName() {
    return 'collections';
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['name'],

      properties: {
        id: { type: 'integer' },
        uid: { type: 'string' },
        organization: { type: 'integer' },
        name: { type: 'string' },
        description: { type: 'string' }
      }
    };
  }

  // This object defines the relations to other models.
  static get relationMappings() {
    return {
      collectionOrganization: {
        relation: Model.BelongsToOneRelation,
        modelClass: __dirname + '/Organization',
        join: {
          from: 'collection.organization',
          to: 'organizations.id'
        }
      },
      tests: {
        relation: Model.HasManyRelation,
        modelClass: __dirname + '/CollectionTest',
        join: {
          from: 'collections.id',
          to: 'collections_tests.collection'
        }
      }
    };
  }

}

module.exports = Collection;