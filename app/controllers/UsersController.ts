import { Request, Response } from "../../type";
import DB from "../services/DB";
import Authenticate from "../services/Authenticate";

class UsersController {
  public async register(request: Request, response: Response) {
    const { username, email, password } = await request.json();

    try {
      const hashedPassword = await Authenticate.hash(password);
      const [userId] = await DB.table("users").insert({
        username,
        email,
        password: hashedPassword,
      });

      return response
        .status(201)
        .json({ message: "User registered successfully", userId });
    } catch (error) {
      return response.status(400).json({ error: "Registration failed" });
    }
  }

  public async login(request: Request, response: Response) {
    const { username, password } = await request.json();

    try {
      const user = await DB.table("users").where("username", username).first();

      if (!user) {
        return response.status(404).json({ error: "User not found" });
      }

      const isPasswordValid = await Authenticate.compare(
        password,
        user.password
      );

      if (!isPasswordValid) {
        return response.status(401).json({ error: "Invalid credentials" });
      }

      await Authenticate.process(user, request, response);
    } catch (error) {
      return response.status(400).json({ error: "Login failed" });
    }
  }

  public async delete(request: Request, response: Response) {
    const { id } = request.params;

    try {
      const deletedCount = await DB.table("users").where("id", id).delete();

      if (deletedCount === 0) {
        return response.status(404).json({ error: "User not found" });
      }

      return response.json({ message: "User deleted successfully" });
    } catch (error) {
      return response.status(400).json({ error: "User deletion failed" });
    }
  }
}

export default new UsersController();
