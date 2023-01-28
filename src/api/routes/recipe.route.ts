// Router Module
import { Router } from 'express'

// Import Recipe Controllers
import { RecipeController } from '../controllers'

// Instantiate Controller
const recipeControllers = new RecipeController()

// Export Router
export const RecipeRoutes = Router()

// POST - Extract Recipe Details
RecipeRoutes.post('/extract', recipeControllers.extractRawRecipe)

// POST - Parse Recipe
RecipeRoutes.post('/parse', recipeControllers.parseRecipe)

// Route Definition
RecipeRoutes.route('/')

    // Fetch all recipes
    .get(recipeControllers.fetchAllRecipes)

    // Create new recipe
    .post(recipeControllers.createRecipe)