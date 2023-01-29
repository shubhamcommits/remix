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

    // Fetch all Recipes
    .get(recipeControllers.fetchAllRecipes)

    // Create new Recipe
    .post(recipeControllers.createRecipe)

// Route Definition
RecipeRoutes.route('/:id')

    // Fetch the Recipe by ID 
    .get(recipeControllers.fetchRecipe)

    // Remove the Recipe
    .delete(recipeControllers.removeRecipe)