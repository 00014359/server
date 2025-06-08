import { config } from "dotenv";
import { verifyToken } from "../utils/jwt.utils.js";
config();

export const auth = (req, res, next) => {
  try {
    let token = req.header("Authorization");
    console.log("Authorization Header:", token);

    if (!token) {
      return res
        .status(401)
        .json({ message: "No authentication token, authorization denied." });
    }

    if (token.startsWith("Bearer ")) {
      token = token.slice(7);
    }

    const verified = verifyToken(token);
    console.log("Verified Token:", verified);

    if (!verified) {
      return res
        .status(401)
        .json({ message: "Invalid or expired token, authorization denied." });
    }

    req.user = {
      id: verified.id,
      role: verified.role,
    };
    console.log("Authenticated User:", req.user);
    next();
  } catch (error) {
    res.status(401).json({ message: "Authentication failed. Invalid token." });
  }
};
