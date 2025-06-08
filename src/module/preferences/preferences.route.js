import { Router } from "express";
import preferencesController from "./preferences.controller.js";
import { auth } from "../../middleware/auth.middleware.js";

const router = Router();

export const preferencesRoutes = router
  .get("/quiz", preferencesController.getQuizQuestions)
  .post("/quiz", auth, preferencesController.submitQuiz)
  .get("/", auth, preferencesController.getUserPreferences)
  .patch("/", auth, preferencesController.updatePreferences)
  .get("/recommendations", auth, preferencesController.getRecommendations);
