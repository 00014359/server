// module/user/user.controller.js
import { generateToken } from "../../utils/jwt.utils.js";
import userService from "./user.service.js";

class UserController {
  async signIn(req, res) {
    try {
      const user = await userService.signIn(req.body);
      if (!user) {
        return res.status(400).json({ message: "Invalid email or password" });
      }

      const token = generateToken(user);

      res.status(200).json({
        token,
        user: { id: user.user_id, name: user.name, role: user.role },
      });
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  }

  async registerUser(req, res) {
    try {
      const newUser = await userService.register(req.body);
      res.status(201).json({
        message: "User registered successfully",
        user: { id: newUser.user_id, name: newUser.name, role: newUser.role },
      });
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  }
  async getProfile(req, res) {
    try {
      const userId = req.user.id;
      if (!userId) {
        return res.status(401).json({ message: "User not authenticated." });
      }

      const userProfile = await userService.getUserProfile(userId);

      if (!userProfile) {
        return res.status(404).json({ message: "User profile not found." });
      }

      res.status(200).json(userProfile);
    } catch (err) {
      console.error("Error fetching user profile:", err);
      res.status(500).json({ message: err.message });
    }
  }
}

export default new UserController();
