import { Router } from "express";
import { userRoutes } from "../module/user/user.routes.js";
import { perfumeRoutes } from "../module/parfume/parfume.routes.js";
import { orderRoutes } from "../module/order/order.routes.js";
import { preferencesRoutes } from "../module/preferences/preferences.route.js";
import { reviewRoutes } from "../module/reviews/review.routes.js";

export const router = Router()
  .use("/user", userRoutes)
  .use("/parfume", perfumeRoutes)
  .use("/preferences", preferencesRoutes)
  .use("/review", reviewRoutes)
  .use("/order", orderRoutes);
