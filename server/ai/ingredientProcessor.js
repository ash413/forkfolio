const stopWords = new Set([
    'chopped', 'diced', 'sliced', 'fresh', 'dried', 'organic', 
    'large', 'small', 'medium', 'extra', 'virgin', 'powder', 
    'sauce', 'oil', 'and', 'or', 'of'
  ]);
  
module.exports = {
    processIngredients: (ingredients) => {
      return ingredients
        .map(i => i.toLowerCase()
          .replace(/[\d\/\.]+(?: tsp| tbsp| cup| ml| g)?\s*/g, '') // Remove quantities
          .replace(/\b(\w+)(?:ed|s)\b/g, '$1') // Stemming
          .replace(/[^\w\s]/g, '') // Remove special chars
          .trim()
        )
        .filter(i => i.length > 2 && !stopWords.has(i));
    }
};