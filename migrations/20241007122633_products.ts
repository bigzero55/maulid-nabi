import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTable('products', (table) => {
        table.increments('id').primary()
        table.string('name').notNullable()
        table.text('description')
        table.decimal('price', 10, 2).notNullable()
        table.integer('stock').notNullable().defaultTo(0)
        table.timestamps(true, true)
    })
}


export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTable('products')
}

