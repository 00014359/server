import { Router } from "express";
import userController from "./user.controller.js";
import { auth } from "../../middleware/auth.middleware.js";

const router = Router();

export const userRoutes = router
  .post("/login", userController.signIn)
  .post("/register", userController.registerUser)
  .get("/profile", auth, userController.getProfile);
