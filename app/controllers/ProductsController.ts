import { Request, Response } from "../../type";
import DB from "../services/DB";

class ProductsController {
  public async addProduct(request: Request, response: Response) {
    const { name, description, price, stock } = await request.json();

    try {
      const [productId] = await DB.table("products").insert({
        name,
        description,
        price,
        stock,
      });

      return response
        .status(201)
        .json({ message: "Product added successfully", productId });
    } catch (error) {
      return response.status(400).json({ error: "Failed to add product" });
    }
  }

  public async deleteProduct(request: Request, response: Response) {
    const { id } = request.params;

    try {
      const deletedCount = await DB.table("products").where("id", id).delete();

      if (deletedCount === 0) {
        return response.status(404).json({ error: "Product not found" });
      }

      return response.json({ message: "Product deleted successfully" });
    } catch (error) {
      return response.status(400).json({ error: "Failed to delete product" });
    }
  }

  public async updateStock(request: Request, response: Response) {
    const { id } = request.params;
    const { quantity, operation } = await request.json();

    try {
      const product = await DB.table("products").where("id", id).first();

      if (!product) {
        return response.status(404).json({ error: "Product not found" });
      }

      let newStock = product.stock;
      if (operation === "add") {
        newStock += quantity;
      } else if (operation === "subtract") {
        newStock = Math.max(0, newStock - quantity);
      } else {
        return response.status(400).json({ error: "Invalid operation" });
      }

      await DB.table("products").where("id", id).update({ stock: newStock });

      return response.json({
        message: "Product stock updated successfully",
        newStock,
      });
    } catch (error) {
      return response
        .status(400)
        .json({ error: "Failed to update product stock" });
    }
  }

  public async updateProduct(request: Request, response: Response) {
    const { id } = request.params;
    const { name, description, price } = await request.json();

    try {
      const updatedCount = await DB.table("products").where("id", id).update({
        name,
        description,
        price,
      });

      if (updatedCount === 0) {
        return response.status(404).json({ error: "Product not found" });
      }

      return response.json({ message: "Product updated successfully" });
    } catch (error) {
      return response.status(400).json({ error: "Failed to update product" });
    }
  }

  public async getAllProducts(request: Request, response: Response) {
    try {
      const products = await DB.table("products").select();
      response.inertia("/products", products);
    } catch (error) {
      return response.status(400).json({ error: "Failed to fetch products" });
    }
  }
}

export default new ProductsController();
