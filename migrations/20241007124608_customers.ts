import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("customers", (table) => {
    table.increments("id").primary();
    table.string("name").notNullable();
    table.string("email").unique().notNullable();
    table.string("phone_number");
    table.string("address");
    table.timestamps(true, true);
  });
}

export async function down(knex: Knex): Promise<void> {}
