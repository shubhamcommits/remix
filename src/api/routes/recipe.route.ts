// Router Module
import { Router } from 'express'

// Import Recipe Controllers
import { RecipeController } from '../controllers'

// Auth Module from Auth0
import { requiresAuth } from 'express-openid-connect'

// Import Auth from Utils
import { isloggedInToAuth0 } from '../../utils/auth'

// Instantiate Controller
const recipeControllers = new RecipeController()

// Export Router
export const RecipeRoutes = Router()

// POST - Extract Recipe Details
RecipeRoutes.post('/extract', isloggedInToAuth0, requiresAuth(), recipeControllers.extractRawRecipe)

// POST - Parse Recipe
RecipeRoutes.post('/parse', isloggedInToAuth0, requiresAuth(), recipeControllers.parseRecipe)

// Route Definition
RecipeRoutes.route('/')

    // Fetch all Recipes
    .get(isloggedInToAuth0, requiresAuth(), recipeControllers.fetchAllRecipes)

    // Create new Recipe
    .post(isloggedInToAuth0, requiresAuth(), recipeControllers.createRecipe)

// Route Definition
RecipeRoutes.route('/:id')

    // Fetch the Recipe by ID 
    .get(isloggedInToAuth0, requiresAuth(), recipeControllers.fetchRecipe)

    // Remove the Recipe
    .delete(isloggedInToAuth0, requiresAuth(), recipeControllers.removeRecipe)