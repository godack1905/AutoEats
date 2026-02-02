import express from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

import { MESSAGE_CODES } from '../messages/messageCodes.js';
import { sendSuccess, throwApiError } from '../messages/responseHelper.js';
import { ApiError } from '../messages/ApiError.js';

const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ingredientsPath = path.join(__dirname, "../data/ingredients.json");

// Get all ingredients with optional filtering
router.get("/", (req, res) => {
  try {
    const { query } = req.query;
    const data = JSON.parse(fs.readFileSync(ingredientsPath, "utf-8"));

    let results = data;

    if (query) {
      const q = query.toLowerCase();
      results = data.filter(i =>
        i.name && i.name.toLowerCase().includes(q)
      );
    }

    return sendSuccess(res, MESSAGE_CODES.INGREDIENTS_FETCHED, { count: results.length, ingredients: results }, 200);
    
  } catch (err) {
    if (err instanceof ApiError)
      return next(err);
    
    console.error("Error in getIngredients:", err);
    throwApiError(500, MESSAGE_CODES.INTERNAL_ERROR, { originalMessage: err.message });
}
});

// Obtener ingredientes por categoría
router.get("/category/:category", (req, res) => {
  try {
    const data = JSON.parse(fs.readFileSync(ingredientsPath, "utf-8"));
    const ingredients = data.filter(i => 
      i.categoria.toLowerCase() === req.params.category.toLowerCase()
    );

    sendSuccess(res, MESSAGE_CODES.INGREDIENTS_FETCHED, { count: ingredients.length, ingredients }, 200);
  } catch (err) {
    if (err instanceof ApiError)
      return next(err);
    
    console.error("Error in getIngredientsByCategory:", err);
    throwApiError(500, MESSAGE_CODES.INTERNAL_ERROR, { originalMessage: err.message });
  }
});

export default router;