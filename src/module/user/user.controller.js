import { generateToken } from "../../utils/jwt.utils.js";
import userService from "./user.service.js";

class UserController {
  async signIn(req, res) {
    try {
      const user = await userService.signIn(req.body);

      if (!user) {
        return res.status(400).json({ message: "Invalid email or password" });
      }

      console.log(user);

      const token = generateToken(user);
      res.cookie("token", token);
      res.header("authentication", token);

      res.status(200).json({ token, ...user });
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  }
}

export default new UserController();
