import { Request, Response } from "../../type";
import DB from "../services/DB";

class TransactionsController {
  public async createTransaction(request: Request, response: Response) {
    const { customer_id, user_id, total_amount, items } = await request.json();

    try {
      const result = await DB.transaction(async (trx) => {
        const [transactionId] = await trx("transactions").insert({
          customer_id,
          user_id,
          total_amount,
          status: "pending",
        });

        const transactionItems = items.map((item) => ({
          transaction_id: transactionId,
          product_id: item.product_id,
          quantity: item.quantity,
          price: item.price,
        }));

        await trx("transaction_items").insert(transactionItems);

        return transactionId;
      });

      return response
        .status(201)
        .json({
          message: "Transaction created successfully",
          transactionId: result,
        });
    } catch (error) {
      return response
        .status(400)
        .json({ error: "Failed to create transaction" });
    }
  }

  public async getAllTransactions(request: Request, response: Response) {
    try {
      const transactions = await DB("transactions")
        .select(
          "transactions.*",
          "customers.name as customer_name",
          "users.username as user_name"
        )
        .join("customers", "transactions.customer_id", "customers.id")
        .join("users", "transactions.user_id", "users.id")
        .orderBy("transactions.created_at", "desc");

      return response.json(transactions);
    } catch (error) {
      return response
        .status(400)
        .json({ error: "Failed to fetch transactions" });
    }
  }

  public async getTransactionItems(request: Request, response: Response) {
    const { transactionId } = request.params;

    try {
      const items = await DB("transaction_items")
        .select("transaction_items.*", "products.name as product_name")
        .join("products", "transaction_items.product_id", "products.id")
        .where("transaction_items.transaction_id", transactionId);

      return response.json(items);
    } catch (error) {
      return response
        .status(400)
        .json({ error: "Failed to fetch transaction items" });
    }
  }

  public async updateTransactionStatus(request: Request, response: Response) {
    const { transactionId } = request.params;
    const { status } = await request.json();

    try {
      await DB("transactions").where("id", transactionId).update({ status });

      return response.json({
        message: "Transaction status updated successfully",
      });
    } catch (error) {
      return response
        .status(400)
        .json({ error: "Failed to update transaction status" });
    }
  }
}

export default new TransactionsController();
