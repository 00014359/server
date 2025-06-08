import { Router } from "express";
import parfumeController from "./parfume.controller.js";
import { auth } from "../../middleware/auth.middleware.js";
import { authorizeRole } from "../../middleware/auth.role.js";
import { UserRole } from "@prisma/client";

const router = Router();

export const perfumeRoutes = router
  // Public routes
  .get("/", parfumeController.getPerfumes)

  .get("/:id", parfumeController.getPerfumeById)
  .get("/:id/similar", parfumeController.getSimilarPerfumes)

  .get("/for-you/recommendations", auth, parfumeController.getForYouPage)

  // Admin
  .post(
    "/",
    auth,
    authorizeRole([UserRole.ADMIN]),
    parfumeController.createPerfume
  )
  .patch(
    "/:id",
    auth,
    authorizeRole([UserRole.ADMIN]),
    parfumeController.updatePerfume
  )
  .delete(
    "/:id",
    auth,
    authorizeRole([UserRole.ADMIN]),
    parfumeController.deletePerfume
  )
  .get(
    "/:id/stock/:quantity",
    auth,
    authorizeRole([UserRole.ADMIN]),
    parfumeController.checkStock
  );
