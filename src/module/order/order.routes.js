import { Router } from "express";
import orderController from "./order.controller.js";
import { auth } from "../../middleware/auth.middleware.js";

const router = Router();

export const orderRoutes = router
  .get("/", auth, orderController.getAllOrders)
  .post("/", orderController.createOrder);
