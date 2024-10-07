import { Request, Response } from "../../type";
import DB from "../services/DB";

class PagesController {
  public async home(request: Request, response: Response) {
    response.inertia("home");
  }

  public async films(request: Request, response: Response) {
    const films = await DB.from("films").select("*");
    return response.inertia("Films", { films });
  }

  public async cart(request: Request, response: Response) {
    const userId = request.user.id; // Assuming you have user authentication
    const cartItems = await DB.from("carts")
      .select("carts.*", "products.name as product_name")
      .join("products", "carts.product_id", "products.id")
      .where("carts.user_id", userId);

    return response.inertia("Cart", { cartItems });
  }

  public async products(request: Request, response: Response) {
    const products = await DB.from("products").select("*");
    return response.inertia("products", { products });
  }
}

export default new PagesController();
