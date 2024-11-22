const express = require('express');
//const zod = require('zod');

const router = express();

/*const recipeValidation = zod.object({
    title: zod.string().min(3).max(100),
    description: zod.string().min(10).max(1000),
    ingredients: z.array(z.object({
        name: z.string(),
        amount: z.string(),
        unit: z.string().optional()
    })),
    steps: z.array(z.object({
        stepNumber: z.number(),
        instruction: z.string()
    })),
    imageUrl: z.string().optional(),
    cookTime: z.number().optional()
})*/

router.get()

module.exports = {
    router
}