import { Router } from "express";
import orderController from "./order.controller.js";
import { auth } from "../../middleware/auth.middleware.js";
import { authorizeRole } from "../../middleware/auth.role.js";
import { UserRole } from "@prisma/client";

const router = Router();

export const orderRoutes = router
  .get("/", auth, authorizeRole([UserRole.ADMIN]), orderController.getAllOrders)
  .post("/", auth, orderController.createOrder)
  .get("/my", auth, orderController.getUserOrders);
