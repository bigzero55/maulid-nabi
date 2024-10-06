import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('comments', (table) => {
    table.string('id').primary()
    table.string('author_id').unsigned().notNullable().index();
    table.string("type");
    table.string('name');
    table.text('message').notNullable() 
    table.bigInteger("time");
  })
}


export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('comments')
}
