import { Router } from "express";
import reviewController from "./review.controller.js";
import { auth } from "../../middleware/auth.middleware.js";

const router = Router();

export const reviewRoutes = router
  .get("/perfume/:perfumeId", reviewController.getPerfumeReviews)
  .post("/perfume/:perfumeId", auth, reviewController.createReview);
