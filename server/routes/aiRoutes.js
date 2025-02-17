const express = require('express');
const { authMiddleware } = require('../middleware/authMiddleware');
const aiUsageLimitter = require('../middleware/aiUsageLimitter')
const { getSuggestions } = require('../ai/recipeSuggestions');

const router = express.Router();

router.post('/ai-suggestions', authMiddleware, aiUsageLimitter, async (req, res) => {
  try {
    const { ingredients } = req.body;
    const userId = req.userId;

    if (!ingredients || !Array.isArray(ingredients)) {
      return res.status(400).json({
        message: "Ingredients array required"
      });
    }

    const suggestions = await getSuggestions(ingredients, userId);

    if (suggestions.message) {
      return res.json({ message: suggestions.message, newRecipe: suggestions.newRecipe });
    }

    res.json(suggestions);

  } catch (error) {
    console.error("Error in AI suggestions:", error);
    res.status(error.message.includes("AI usage limit") ? 403 : 500).json({
      message: error.message || "Error generating suggestions"
    });
  }
});

module.exports = router;