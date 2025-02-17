const { Recipe } = require('../db/db');
const { processIngredients } = require('./ingredientProcessor');
const natural = require('natural');
const openai = require('../utils/openaiClient'); 

const { User } = require('../db/db')

const TfIdf = natural.TfIdf;

module.exports = {
  getSuggestions: async (userIngredients, userId) => {
    const processedInput = processIngredients(userIngredients);

    // Get all recipes with processed ingredients
    const allRecipes = await Recipe.find().lean();
    const recipesWithProcessed = allRecipes.map(recipe => ({
      ...recipe,
      processedIngredients: processIngredients(recipe.ingredients)
    }));

    // Filter recipes that contain at least one matching ingredient
    const filteredRecipes = recipesWithProcessed.filter(recipe =>
      recipe.processedIngredients.some(ingredient =>
        processedInput.includes(ingredient)
      )
    );

    // If no matches, generate a new recipe using OpenAI
    if (filteredRecipes.length === 0) {
      return { 
        message: "No existing recipes with these ingredients. Here let me suggest a new recipe for you!",
        newRecipe: await generateRecipe(userIngredients, userId)
      };
    }    

    // TF-IDF Vectorization for ranking
    const tfidf = new TfIdf();
    const documentMap = new Map();

    filteredRecipes.forEach((recipe, idx) => {
      tfidf.addDocument(recipe.processedIngredients.join(' '));
      documentMap.set(idx, recipe);
    });

    // Calculate scores
    const scores = [];
    tfidf.tfidfs(processedInput.join(' '), (i, measure) => {
      scores.push({
        score: measure,
        recipe: documentMap.get(i)
      });
    });

    return scores
      .sort((a, b) => b.score - a.score)
      .slice(0, 5)
      .map(item => item.recipe);
  }
};

// Function to generate a new recipe using OpenAI
async function generateRecipe(ingredients, userId) {
  try {
    //console.log("Generating recipe for:", ingredients);
    const user = await User.findById(userId);

    if (!user) {
      throw new Error("User not found");
    }

    if (user.aiUsageCount >= 5) {
      throw new Error("AI usage limit reached. No more requests allowed.");
    }

    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [{ role: "user", content: `Suggest a well-formatted recipe using ${ingredients.join(', ')}. Format it properly and leave a line in between the recipe title, recipe ingredients and recipe instructions.` }]
    });

    //console.log("API Full Response:", JSON.stringify(response, null, 2));

    // Update usage count
    user.aiUsageCount += 1;
    await user.save();

    if (!response.choices || response.choices.length === 0) {
      console.error("OpenAI API returned an empty response.");
      return { message: "Sorry, I couldn't generate a recipe at the moment." };
    }

    // Ensure formatting with proper new lines
    return response.choices[0].message.content.replace(/(\d+\.)/g, '\n$1');
    
  } catch (error) {
    console.error("OpenAI API Error:", error.response ? error.response.data : error.message);
    return { message: "Error generating recipe. Please try again later." };
  }
}