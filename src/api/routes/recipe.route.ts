// Router Module
import { Router } from 'express'

// Import Recipe Controllers
import { RecipeController } from '../controllers'

// Auth Module from Auth0
import { requiresAuth } from 'express-openid-connect'

// Instantiate Controller
const recipeControllers = new RecipeController()

// Export Router
export const RecipeRoutes = Router()

// POST - Extract Recipe Details
RecipeRoutes.post('/extract', requiresAuth(), recipeControllers.extractRawRecipe)

// POST - Parse Recipe
RecipeRoutes.post('/parse', requiresAuth(), recipeControllers.parseRecipe)

// Route Definition
RecipeRoutes.route('/')

    // Fetch all Recipes
    .get(requiresAuth(), recipeControllers.fetchAllRecipes)

    // Create new Recipe
    .post(requiresAuth(), recipeControllers.createRecipe)

// Route Definition
RecipeRoutes.route('/:id')

    // Fetch the Recipe by ID 
    .get(requiresAuth(), recipeControllers.fetchRecipe)

    // Remove the Recipe
    .delete(requiresAuth(), recipeControllers.removeRecipe)