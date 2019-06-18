'use strict';

const { transaction } = require('objection');

const Organization = require('../models/Organization');
const User = require('../models/User');
const UserRole = require('../models/UserRole');
const Test = require('../models/Test');
const TestStep = require('../models/TestStep');
const Collection = require('../models/Collection');
const CollectionTest = require('../models/CollectionTest');
const Run = require('../models/Run');
const RunStep = require('../models/RunStep');


var tempOrganization = 1;

module.exports = router => {

  // --- Organization ---

  router.get('/organization', async (req, res) => {
    const organizations = await Organization.query()
    res.send(organizations);
  });


  // --- User ---

  router.get('/user', async (req, res) => {
    const users = await User.query()
      .eager('roles')
      .omit(User, ['id', 'organization', 'password'])
      .omit(UserRole, ['id', 'user'])
    res.send(users);
  });

  router.get('/user/:uid', async (req, res) => {
    const users = await User.query().findOne({ uid: req.params.uid })
      .eager('roles')
      .omit(User, ['id', 'organization', 'password'])
      .omit(UserRole, ['id', 'user'])
    res.send(users);
  });

  router.post('/user', async (req, res) => {
    const graph = req.body;
    const insertedGraph = await transaction(User.knex(), trx => {
      return (
        User.query(trx)
          .allowInsert('[roles]')
          .insertGraph(graph)
          .omit(User, ['id'])
          .omit(UserRole, ['id', 'user'])
      );
    });
    res.send(insertedGraph);
  });

  router.patch('/user/:uid/password', async (req, res) => {
    const users = await User.query().findOne({ uid: req.params.uid, password: req.body.old });
    let updatedUsers;
    if (users) {
      await users.$query().patchAndFetch({ password: req.body.new });
      updatedUsers = { message: "Password changed." }
    }
    else {
      updatedUsers = { error: "Old password does not match." }
    }
    res.send(updatedUsers);
  });

  router.delete('/user/:uid', async (req, res) => {
    const numberOfDeletedRows = await User.query().delete().where('uid', req.params.uid);
    res.send({ numberOfDeletedRows: numberOfDeletedRows });
  });


  // --- Test ---

  router.get('/test', async (req, res) => {
    const tests = await Test.query()
      .where({ organization: tempOrganization })
      .omit(Test, ['id', 'organization'])
      .leftJoin('tests_steps', function () {
        this.on('tests_steps.test', '=', 'tests.id')
      })
      .select(['tests.uid', 'tests.name', 'tests.purpose', 'tests.browser', 'tests.urlDomain', 'tests.urlPath'])
      .groupBy(['tests.uid'])
      .count({ 'stepCount': 'tests_steps.id' })
    res.send(tests);
  });

  router.get('/test/:uid', async (req, res) => {
    const tests = await Test.query()
      .findOne({ uid: req.params.uid })
      .where({ organization: tempOrganization })
      .eager('steps')
      .omit(Test, ['id', 'organization'])
      .omit(TestStep, ['id', 'test'])
    res.send(tests);
  });

  router.post('/test', async (req, res) => {
    const graph = req.body;
    graph.organization = tempOrganization;
    const insertedGraph = await transaction(Test.knex(), trx => {
      return (
        Test.query(trx)
          .allowInsert('[steps]')
          .insertGraph(graph)
        //.omit(Test, ['id'])
        //.omit(TestStep, ['id', 'test'])
      );
    });
    const tests = await Test.query()
      .findById(insertedGraph.id)
      .where({ organization: tempOrganization })
      .eager('steps')
      .omit(Test, ['id', 'organization'])
      .omit(TestStep, ['id', 'test'])
    res.send(tests);
  });

  router.put('/test/:uid', async (req, res) => {
    // Find current test ID
    const tests = await Test.query()
      .findOne({ uid: req.params.uid })
      .where({ organization: tempOrganization })
      .select('id')
    // Create update object
    const graph = req.body;
    graph.id = tests.id;
    graph.organization = tempOrganization;
    // Update
    const insertedGraph = await transaction(Test.knex(), trx => {
      return (
        Test.query(trx)
          .findOne({ uid: req.params.uid }).where({ organization: tempOrganization })
          .allowUpsert('[steps]')
          .upsertGraph(graph, {})
          .omit(Test, ['id', 'organization'])
          .omit(TestStep, ['id', 'test'])
      );
    });
    res.send(insertedGraph);
  });

  router.delete('/test/:uid', async (req, res) => {
    const numberOfDeletedRows = await Test.query()
      .delete()
      .where('uid', req.params.uid)
      .where({ organization: tempOrganization });
    res.send({ numberOfDeletedRows: numberOfDeletedRows });
  });


  // --- Collection ---

  router.get('/collection', async (req, res) => {
    const collections = await Collection.query()
      .where({ organization: tempOrganization })
      .omit(Collection, ['id', 'organization'])
      .leftJoin('collections_tests', function () {
        this.on('collections_tests.collection', '=', 'collections.id')
      })
      .select(['collections.uid', 'collections.name', 'collections.description'])
      .groupBy(['collections.uid'])
      .count({ 'testCount': 'collections_tests.id' })
    res.send(collections);
  });

  router.get('/collection/:uid', async (req, res) => {
    const collections = await Collection.query()
      .findOne({ 'collections.uid': req.params.uid })
      .where({ 'collections.organization': tempOrganization })
      .eager('tests', 'tests.[tests]')
      .omit(Collection, ['id', 'organization'])
      .omit(CollectionTest, ['id', 'collection'])
    res.send(collections);
  });

  router.post('/collection', async (req, res) => {
    const graph = req.body;
    graph.organization = tempOrganization;
    const insertedGraph = await transaction(Collection.knex(), trx => {
      return (
        Collection.query(trx)
          .allowInsert('[tests]')
          .insertGraph(graph)
      );
    });
    const collections = await Collection.query()
      .findById(insertedGraph.id)
      .where({ organization: tempOrganization })
      .eager('tests')
      .omit(Collection, ['id', 'organization'])
      .omit(CollectionTest, ['id', 'collection'])
    res.send(collections);
  });

  router.put('/collection/:uid', async (req, res) => {
    // Find current collection ID
    const collections = await Collection.query()
      .findOne({ uid: req.params.uid })
      .where({ organization: tempOrganization })
      .select('id')
    // Create update object
    const graph = req.body;
    graph.id = collections.id;
    graph.organization = tempOrganization;
    // Update
    const insertedGraph = await transaction(Collection.knex(), trx => {
      return (
        Collection.query(trx)
          .findOne({ uid: req.params.uid }).where({ organization: tempOrganization })
          .allowUpsert('[tests]')
          .upsertGraph(graph, {})
          .omit(Collection, ['id', 'organization'])
          .omit(CollectionTest, ['id', 'collection'])
      );
    });
    res.send(insertedGraph);
  });

  router.delete('/collection/:uid', async (req, res) => {
    const numberOfDeletedRows = await Collection.query()
      .delete()
      .where('uid', req.params.uid)
      .where({ organization: tempOrganization });
    res.send({ numberOfDeletedRows: numberOfDeletedRows });
  });


  // --- Run ---

  router.get('/run', async (req, res) => {
    const runs = await Run.query()
      .where({ 'runs.organization': tempOrganization })
      .omit(Run, ['id', 'organization'])
      .leftJoin('tests', function () {
        this.on('runs.test', '=', 'tests.uid')
      })
      .orderBy('runs.created', 'desc')
      .select([
        'runs.uid',
        'runs.test',
        { 'test_name': 'tests.name' },
        { 'test_purpose': 'tests.purpose' },
        'runs.created',
        'runs.status',
        'runs.browser',
        'runs.urlDomain',
        'runs.start',
        'runs.end']);

    res.send(runs);
  });

  router.get('/run/next', async (req, res) => {
    var runs = await Run.query()
      .where({ status: "new" })
      .first()
      .leftJoin('tests', function () {
        this.on('runs.test', '=', 'tests.uid');
      })
      .select([
        'runs.uid',
        'runs.test',
        'runs.created',
        'runs.status',
        'runs.browser',
        'runs.urlDomain',
        'tests.urlPath',
        'runs.start',
        'runs.end'])
      .omit(Run, ['id', 'organization'])
    if (runs) {
      runs.steps = await TestStep.query()
        .join('tests', function () {
          this.on('tests_steps.test', '=', 'tests.id');
        })
        .where({ 'tests.uid': runs.test })
        .omit(TestStep, ['id', 'test'])
    }
    else {
      runs = {};
    }
    res.send(runs);
  });

  router.patch('/run/:uid', async (req, res) => {
    const runs = await Run.query().findOne({ uid: req.params.uid });
    let updatedRuns;
    if (runs) {
      await runs.$query().patchAndFetch({
        status: req.body.status,
        start: req.body.start
      });
      updatedRuns = { message: "Run started." }
    }
    else {
      updatedRuns = { error: "Run not found." }
    }
    res.send(updatedRuns);
  });

  router.get('/run/:uid', async (req, res) => {
    const runs = await Run.query()
      .findOne({ 'runs.uid': req.params.uid })
      .where({ 'runs.organization': tempOrganization })
      .eager('steps')
      .omit(Run, ['id', 'organization'])
      .omit(RunStep, ['id', 'run'])
      .leftJoin('tests', function () {
        this.on('runs.test', '=', 'tests.uid')
      })
      .select([
        'runs.uid',
        'runs.test',
        { 'test_name': 'tests.name' },
        { 'test_purpose': 'tests.purpose' },
        'runs.created',
        'runs.status',
        'runs.browser',
        'runs.urlDomain',
        'runs.start',
        'runs.end']);
    res.send(runs);
  });

  router.post('/test/:uid/run', async (req, res) => {
    const insert = await Run.query().insert(
      {
        organization: tempOrganization,
        test: req.params.uid,
        browser: req.body.browser,
        urlDomain: req.body.urlDomain
      });
    const runsResult = await Run.query()
      .findById(insert.id)
      .where({ organization: tempOrganization })
      .omit(Run, ['id', 'organization'])
    res.send(runsResult);
  });

  router.post('/collection/:uid/run', async (req, res) => {
    // Get a list of all tests from this collection
    const collections = await Collection.query()
      .findOne({ uid: req.params.uid })
      .where({ organization: tempOrganization })
      .eager('tests');
    var output = [];
    for (var c = 0; c < collections.tests.length; c++) {
      var collection = collections.tests[c];
      var insert = await Run.query().insert(
        {
          organization: tempOrganization,
          test: collection.test,
          browser: collection.browser,
          urlDomain: collection.urlDomain
        });
      var runsResult = await Run.query()
        .findById(insert.id)
        .where({ organization: tempOrganization })
        .omit(Run, ['id', 'organization'])
      output.push(runsResult);
    }
    res.send(output)
  });

  router.put('/run/:uid', async (req, res) => {
    // Find current run ID
    const runs = await Run.query()
      .findOne({ uid: req.params.uid })
      .select('id')
    // Create update object
    const graph = req.body;
    graph.id = runs.id;
    // Update
    const insertedGraph = await transaction(Run.knex(), trx => {
      return (
        Run.query(trx)
          .findOne({ uid: req.params.uid })
          .allowUpsert('[steps]')
          .upsertGraph(graph, {})
          .omit(Run, ['id', 'organization'])
          .omit(RunStep, ['id', 'test'])
      );
    });
    res.send(insertedGraph);
  });

  router.delete('/run/:uid', async (req, res) => {
    const numberOfDeletedRows = await Run.query()
      .delete()
      .where('uid', req.params.uid)
      .where({ organization: tempOrganization });
    res.send({ numberOfDeletedRows: numberOfDeletedRows });
  });


};

// The error returned by this function is handled in the error handler middleware in app.js.
function createStatusCodeError(statusCode) {
  return Object.assign(new Error(), {
    statusCode
  });
}