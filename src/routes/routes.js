import { Router } from "express";
import { userRoutes } from "../module/user/user.routes.js";
import { perfumeRoutes } from "../module/parfume/parfume.routes.js";
import { orderRoutes } from "../module/order/order.routes.js";

export const router = Router()
  .use("/user", userRoutes)
  .use("/parfume", perfumeRoutes)
  .use("/order", orderRoutes);
