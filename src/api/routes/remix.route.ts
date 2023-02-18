// Router Module
import { Router } from 'express'

// Import Remix Controllers
import { RemixController } from '../controllers'

// Import Auth from Utils
import { isloggedInToAuth0 } from '../../utils/auth'

// Auth Module from Auth0
import { requiresAuth } from 'express-openid-connect'

// Instantiate Controller
const remixControllers = new RemixController()

// Export Router
export const RemixRoutes = Router()

// Route Definition
RemixRoutes.post('/generate',remixControllers.remixRecipe)

// Route Definition
RemixRoutes.route('/types')

    // Fetch all Remix Types
    .get(remixControllers.fetchAllRemixTypes)

    // Create new Remix Type
    .post(remixControllers.createRemixType)

// Route Definition
RemixRoutes.route('/types/:id')

    // Fetch Remix Type by ID
    .get(remixControllers.fetchRemixType)

    // Update Remix Type by ID
    .put(remixControllers.updateRemixType)

    // Delete Remix Type by ID
    .delete(remixControllers.removeRemixType)

// Route Definition
RemixRoutes.route('/')

    // Fetch all Remixed Recipes
    .get(remixControllers.fetchAllRemixedRecipes)

    // Create new Remixed Recipe
    .post(remixControllers.createRemixedRecipe)

// Route Definition
RemixRoutes.route('/:id')

    // Fetch Remixed Recipe by ID
    .get(remixControllers.fetchRemixedRecipe)

    // Update Remixed Recipe by ID
    .put(remixControllers.updateRemixedRecipe)

    // Delete Remixed Recipe by ID
    .delete(remixControllers.removeRemixedRecipe)