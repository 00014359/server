import { config } from "dotenv";
import { verifyToken } from "../utils/jwt.utils.js";
config();

// Authorize user
export const auth = (req, res, next) => {
  try {
    const token = req.header("authorization");
    if (!token)
      return res
        .status(401)
        .json({ message: "No authentication token, authorization denied." });

    const verified = verifyToken(token);
    if (!verified)
      return res
        .status(401)
        .json({ message: "Token verification failed, authorization denied." });

    req.user = verified.id;
    req.token = token;
    next();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
