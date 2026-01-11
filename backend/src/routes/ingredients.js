import express from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const router = express.Router();

// Para __dirname en ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ingredientsPath = path.join(__dirname, "../data/ingredients.json");

// Obtener todos los ingredientes o buscar
router.get("/", (req, res) => {
  try {
    const { query, lang = "es", limit = 20 } = req.query;
    const data = JSON.parse(fs.readFileSync(ingredientsPath, "utf-8"));

    let results = data;

    if (query) {
      const q = query.toLowerCase();
      results = data.filter(i =>
        i.names[lang] && i.names[lang].toLowerCase().includes(q)
      );
    }

    // Limitar resultados
    results = results.slice(0, parseInt(limit));

    res.json({
      success: true,
      count: results.length,
      ingredients: results
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ 
      success: false, 
      error: "Error al obtener ingredientes" 
    });
  }
});

// Obtener ingrediente por ID
router.get("/:id", (req, res) => {
  try {
    const data = JSON.parse(fs.readFileSync(ingredientsPath, "utf-8"));
    const ingredient = data.find(i => i.id === req.params.id);

    if (!ingredient) {
      return res.status(404).json({ 
        success: false, 
        error: "Ingrediente no encontrado" 
      });
    }

    res.json({
      success: true,
      ingredient
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ 
      success: false, 
      error: "Error al obtener el ingrediente" 
    });
  }
});

// Obtener ingredientes por categoría
router.get("/category/:category", (req, res) => {
  try {
    const data = JSON.parse(fs.readFileSync(ingredientsPath, "utf-8"));
    const ingredients = data.filter(i => 
      i.categoria.toLowerCase() === req.params.category.toLowerCase()
    );

    res.json({
      success: true,
      count: ingredients.length,
      ingredients
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ 
      success: false, 
      error: "Error al obtener ingredientes por categoría" 
    });
  }
});

export default router;