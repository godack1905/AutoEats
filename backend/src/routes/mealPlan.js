import express from "express";
import {
  getMealPlans,
  upsertMealPlan,
  deleteMealPlan
} from "../controllers/mealPlanController.js";

import { auth } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.use(auth);

router.get("/", getMealPlans);
router.post("/", upsertMealPlan);
router.delete("/:date", deleteMealPlan);

export default router;