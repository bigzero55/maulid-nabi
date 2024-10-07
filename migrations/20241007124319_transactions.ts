import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("transactions", (table) => {
    table.increments("id").primary();
    table.integer("customer_id").unsigned().notNullable();
    table.foreign("customer_id").references("id").inTable("customers");
    table.integer("user_id").unsigned().notNullable();
    table.foreign("user_id").references("id").inTable("users");
    table.decimal("total_amount", 10, 2).notNullable();
    table
      .enum("status", ["pending", "completed", "cancelled"])
      .defaultTo("pending");
    table.timestamps(true, true);
  });

  await knex.schema.createTable("transaction_items", (table) => {
    table.increments("id").primary();
    table.integer("transaction_id").unsigned().notNullable();
    table.foreign("transaction_id").references("id").inTable("transactions");
    table.integer("product_id").unsigned().notNullable();
    table.foreign("product_id").references("id").inTable("products");
    table.integer("quantity").unsigned().notNullable();
    table.decimal("price", 10, 2).notNullable();
    table.timestamps(true, true);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable("transaction_items");
  await knex.schema.dropTable("transactions");
}
