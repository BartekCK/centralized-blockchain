import { Knex } from 'knex';
import CreateTableBuilder = Knex.CreateTableBuilder;

export async function up(knex: Knex): Promise<void> {
  await knex.raw(`
  CREATE OR REPLACE FUNCTION trigger_set_timestamp()
    RETURNS TRIGGER AS $$
  BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
  END;
  $$ LANGUAGE plpgsql;`);

  await knex.schema.createTable('block', (tableBuilder: CreateTableBuilder) => {
    tableBuilder
      .uuid('id')
      .defaultTo(knex.raw('gen_random_uuid() PRIMARY KEY'));

    tableBuilder
      .timestamp('timestamp')
      .notNullable()
      .index('block_timestamp_btree_index');
    tableBuilder
      .string('hash')
      .notNullable()
      .unique({ indexName: 'block_hash_unique' })
      .index('block_hash_btree_index');
    tableBuilder.integer('pow').notNullable();
    tableBuilder.string('data').notNullable();
    tableBuilder.string('previous_hash');

    tableBuilder
      .timestamp('created_at')
      .defaultTo(knex.raw('CURRENT_TIMESTAMP NOT NULL'));
    tableBuilder
      .timestamp('updated_at')
      .defaultTo(knex.raw('CURRENT_TIMESTAMP NOT NULL'));
  });

  await knex.raw(`
  CREATE TRIGGER set_timestamp
  BEFORE UPDATE ON block
  FOR EACH ROW
  EXECUTE PROCEDURE trigger_set_timestamp();
  `);
}

export async function down(knex: Knex): Promise<void> {
  await knex.raw('drop trigger set_timestamp on block');
  await knex.schema.dropTable('block');
  await knex.raw('drop function trigger_set_timestamp');
}
