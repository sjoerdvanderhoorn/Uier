

exports.up = knex => {

  let uuidGenerationRaw = knex._context.client.config.client === 'sqlite3' ? 
  `(lower(hex(randomblob(4))) || '-' || lower(hex(randomblob(2))) || '-4' || substr(lower(hex(randomblob(2))),2) || '-' || substr('89ab',abs(random()) % 4 + 1, 1) || substr(lower(hex(randomblob(2))),2) || '-' || lower(hex(randomblob(6))))` :
  `uuid_generate_v4()`;

  return Promise.all(
    [


      // --- Organization ---

      knex.schema.createTable('organizations', table => {
        // System Columns
        table.increments('id').primary();
        table.uuid('uid').notNull().unique().defaultTo(knex.raw(uuidGenerationRaw));
        table.boolean('active').notNull().defaultTo(1);
        // Data Columns
        table.string('name').notNull();
      }),


      // --- User ---

      knex.schema.createTable('users', table => {
        // System Columns
        table.increments('id').primary();
        table.uuid('uid').notNull().unique().defaultTo(knex.raw(uuidGenerationRaw));
        table
          .integer('organization')
          .notNull()
          .references('id')
          .inTable('organizations')
          .onDelete('SET NULL')
          .index();
        // Data Columns
        table.string('email').notNull();
        table.string('password').notNull();
        table.string('name').notNull();
      }),


      // --- UserRole ---

      knex.schema.createTable('users_roles', table => {
        // System Columns
        table.increments('id').primary();
        // Joins
        table
          .integer('user')
          .notNull()
          .references('id')
          .inTable('users')
          .onDelete('CASCADE')
          .index();
        // Data Columns
        table.string('role').notNull();
      }),


      // --- Test ---

      knex.schema.createTable('tests', table => {
        // System Columns
        table.increments('id').primary();
        table.uuid('uid').notNull().unique().defaultTo(knex.raw(uuidGenerationRaw));
        table
          .integer('organization')
          .notNull()
          .references('id')
          .inTable('organizations')
          .onDelete('SET NULL')
          .index();
        // Data Columns
        table.string('name').notNull();
        table.string('purpose');
        table.string('browser').notNull();
        table.string('urlDomain').notNull();
        table.string('urlPath').notNull();
      }),


      // --- TestStep ---

      knex.schema.createTable('tests_steps', table => {
        // System Columns
        table.increments('id').primary();
        // Joins
        table
          .integer('test')
          .notNull()
          .references('id')
          .inTable('tests')
          .onDelete('CASCADE')
          .index();
        // Data Columns
        table.string('name');
        table.string('command').notNull();
        table.string('target_query');
        table.string('target_type');
        table.string('value');
      }),


      // --- Run ---
      // --- RunStep ---
      // --- Collection ---
      // --- CollectionTest ---


    ]);
};

exports.down = knex => {
  return knex.schema
    .dropTableIfExists('organizations')
    .dropTableIfExists('users')
};

