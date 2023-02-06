// Router Module
import { Router } from 'express'

// Import Remix Controllers
import { RemixController } from '../controllers'

// Auth Module from Auth0
import { requiresAuth } from 'express-openid-connect'

// Instantiate Controller
const remixControllers = new RemixController()

// Export Router
export const RemixRoutes = Router()

// Route Definition
RemixRoutes.post('/generate', requiresAuth(), remixControllers.remixRecipe)

// Route Definition
RemixRoutes.route('/types')

    // Fetch all Remix Types
    .get(requiresAuth(), remixControllers.fetchAllRemixTypes)

    // Create new Remix Type
    .post(requiresAuth(), remixControllers.createRemixType)

// Route Definition
RemixRoutes.route('/types/:id')

    // Fetch Remix Type by ID
    .get(requiresAuth(), remixControllers.fetchRemixType)

    // Update Remix Type by ID
    .put(requiresAuth(), remixControllers.updateRemixType)

    // Delete Remix Type by ID
    .delete(requiresAuth(), remixControllers.removeRemixType)

// Route Definition
RemixRoutes.route('/')

    // Fetch all Remixed Recipes
    .get(requiresAuth(), remixControllers.fetchAllRemixedRecipes)

    // Create new Remixed Recipe
    .post(requiresAuth(), remixControllers.createRemixedRecipe)

// Route Definition
RemixRoutes.route('/:id')

    // Fetch Remixed Recipe by ID
    .get(requiresAuth(), remixControllers.fetchRemixedRecipe)

    // Update Remixed Recipe by ID
    .put(requiresAuth(), remixControllers.updateRemixedRecipe)

    // Delete Remixed Recipe by ID
    .delete(requiresAuth(), remixControllers.removeRemixedRecipe)