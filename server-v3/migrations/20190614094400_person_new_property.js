exports.up = knex => {
  return knex.schema
	.table('persons', function(table)
	{
		table.string('test');
	})
};

exports.down = knex => {
  return knex.schema
    .table('persons', function(table)
	{
		table.dropColumn('test');
	});
};