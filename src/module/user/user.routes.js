import { Router } from "express";
import userController from "./user.controller.js";

const router = Router();

export const userRoutes = router.post("/login", userController.signIn);
