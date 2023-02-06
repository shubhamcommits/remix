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
RemixRoutes.post('/generate',isloggedInToAuth0, requiresAuth(), remixControllers.remixRecipe)

// Route Definition
RemixRoutes.route('/types')

    // Fetch all Remix Types
    .get(isloggedInToAuth0, requiresAuth(), remixControllers.fetchAllRemixTypes)

    // Create new Remix Type
    .post(isloggedInToAuth0, requiresAuth(), remixControllers.createRemixType)

// Route Definition
RemixRoutes.route('/types/:id')

    // Fetch Remix Type by ID
    .get(isloggedInToAuth0, requiresAuth(), remixControllers.fetchRemixType)

    // Update Remix Type by ID
    .put(isloggedInToAuth0, requiresAuth(), remixControllers.updateRemixType)

    // Delete Remix Type by ID
    .delete(isloggedInToAuth0, requiresAuth(), remixControllers.removeRemixType)

// Route Definition
RemixRoutes.route('/')

    // Fetch all Remixed Recipes
    .get(isloggedInToAuth0, requiresAuth(), remixControllers.fetchAllRemixedRecipes)

    // Create new Remixed Recipe
    .post(isloggedInToAuth0, requiresAuth(), remixControllers.createRemixedRecipe)

// Route Definition
RemixRoutes.route('/:id')

    // Fetch Remixed Recipe by ID
    .get(isloggedInToAuth0, requiresAuth(), remixControllers.fetchRemixedRecipe)

    // Update Remixed Recipe by ID
    .put(isloggedInToAuth0, requiresAuth(), remixControllers.updateRemixedRecipe)

    // Delete Remixed Recipe by ID
    .delete(isloggedInToAuth0, requiresAuth(), remixControllers.removeRemixedRecipe)