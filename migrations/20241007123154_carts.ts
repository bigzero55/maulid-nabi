import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable('carts', (table) => {
            table.increments('id').primary();
            table.integer('user_id').unsigned().notNullable();
            table.integer('product_id').unsigned().notNullable();
            table.integer('quantity').unsigned().notNullable().defaultTo(1);
            table.decimal('price', 10, 2).notNullable();
            table.timestamps(true, true);
    
            table.foreign('user_id').references('id').inTable('users').onDelete('CASCADE');
            table.foreign('product_id').references('id').inTable('products').onDelete('CASCADE');
        });
    
}


export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTable('carts');
    
}

