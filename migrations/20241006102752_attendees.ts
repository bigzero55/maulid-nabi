import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('attendees', (table) => {
    table.string('id').primary() 
    table.string('name');
    table.boolean("like").defaultTo(false)
    table.timestamp('created_at').defaultTo(knex.fn.now())
    table.timestamp('updated_at').defaultTo(knex.fn.now())
  })
}


export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('attendees')
}
