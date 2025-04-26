import { Router } from "express";
import parfumeController from "./parfume.controller.js";
import { auth } from "../../middleware/auth.middleware.js"; // Assuming you have authentication middleware

const router = Router();

export const perfumeRoutes = router
  .get("/", parfumeController.getPerfumes)
  .post("/", auth, parfumeController.createPerfume)
  .get("/:id", parfumeController.getPerfumeById)
  .patch("/:id", auth, parfumeController.updatePerfume)
  .delete("/:id", auth, parfumeController.deletePerfume)
  .get("/:id/stock/:quantity", auth, parfumeController.checkStock);
