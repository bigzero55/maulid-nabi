import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('recap', (table) => {
    table.increments('id').primary()
    table.integer('like_number').notNullable().defaultTo(0)
    table.integer('attendee_number').notNullable().defaultTo(0) 
    table.integer("peak_viewer").defaultTo(0)
  })
}


export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('recap')
}
