import { Request, Response } from "../../type";
import DB from "../services/DB";

class CartsController {
  public async addToCart(request: Request, response: Response) {
    const { user_id, product_id, quantity } = await request.json();

    try {
      const product = await DB.table("products")
        .where("id", product_id)
        .first();
      if (!product) {
        return response.status(404).json({ error: "Product not found" });
      }

      const existingCartItem = await DB.table("carts")
        .where({ user_id, product_id })
        .first();

      if (existingCartItem) {
        await DB.table("carts")
          .where({ user_id, product_id })
          .update({
            quantity: existingCartItem.quantity + quantity,
            price: product.price,
          });
      } else {
        await DB.table("carts").insert({
          user_id,
          product_id,
          quantity,
          price: product.price,
        });
      }

      return response
        .status(201)
        .json({ message: "Product added to cart successfully" });
    } catch (error) {
      return response
        .status(400)
        .json({ error: "Failed to add product to cart" });
    }
  }

  public async updateCartItemQuantity(request: Request, response: Response) {
    const { id } = request.params;
    const { quantity } = await request.json();

    try {
      const cartItem = await DB.table("carts").where("id", id).first();
      if (!cartItem) {
        return response.status(404).json({ error: "Cart item not found" });
      }

      if (quantity > 0) {
        await DB.table("carts").where("id", id).update({ quantity });
      } else {
        await DB.table("carts").where("id", id).delete();
      }

      return response.json({
        message: "Cart item quantity updated successfully",
      });
    } catch (error) {
      return response
        .status(400)
        .json({ error: "Failed to update cart item quantity" });
    }
  }

  public async removeFromCart(request: Request, response: Response) {
    const { id } = request.params;

    try {
      const deletedCount = await DB.table("carts").where("id", id).delete();

      if (deletedCount === 0) {
        return response.status(404).json({ error: "Cart item not found" });
      }

      return response.json({
        message: "Product removed from cart successfully",
      });
    } catch (error) {
      return response
        .status(400)
        .json({ error: "Failed to remove product from cart" });
    }
  }

  public async getCartItems(request: Request, response: Response) {
    const { user_id } = request.params;

    try {
      const cartItems = await DB.table("carts")
        .select("carts.*", "products.name as product_name")
        .join("products", "carts.product_id", "products.id")
        .where("carts.user_id", user_id);

      return response.json(cartItems);
    } catch (error) {
      return response.status(400).json({ error: "Failed to fetch cart items" });
    }
  }
}

export default new CartsController();
