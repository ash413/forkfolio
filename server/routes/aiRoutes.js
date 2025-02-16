const express = require('express');
const { authMiddleware } = require('../middleware/authMiddleware');
const { getSuggestions } = require('../ai/recipeSuggestions');

const router = express.Router();

router.post('/ai-suggestions', authMiddleware, async (req, res) => {
  try {
    const { ingredients } = req.body;

    if (!ingredients || !Array.isArray(ingredients)) {
      return res.status(400).json({
        message: "Ingredients array required"
      });
    }

    const suggestions = await getSuggestions(ingredients);

    if (suggestions.message) {
      return res.json({ message: suggestions.message, newRecipe: suggestions.newRecipe });
    }

    res.json(suggestions);
  } catch (error) {
    res.status(500).json({
      message: "Error generating suggestions",
      error: error.message
    });
  }
});

module.exports = router;