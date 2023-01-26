// Router Module
import { Router } from 'express'

// Import Recipe Controllers
import { RecipeController } from '../controllers'

// Instantiate Controller
const recipeControllers = new RecipeController()

// Export Router
export const recipeRoutes = Router()

// Route Definition
recipeRoutes.route('/')

    // Fetch all recipes
    .get(recipeControllers.fetchAllRecipes)