// Router Module
import { Router } from 'express'

// Import Remix Controllers
import { RemixController } from '../controllers'

// Instantiate Controller
const remixControllers = new RemixController()

// Export Router
export const RemixRoutes = Router()

// Route Definition
RemixRoutes.route('/types')

    // Fetch all remix types
    .get(remixControllers.fetchAllRemixTypes)

    // Create new remix type
    .post(remixControllers.createRemixType)

// Route Definition
RemixRoutes.route('/types/:id')

    // Fetch remix type
    .get(remixControllers.fetchRemixType)

    // Update remix type
    .put(remixControllers.updateRemixType)

// Route Definition
RemixRoutes.route('/')

    // Fetch all remix recipes
    .get(remixControllers.fetchAllRemixRecipes)

    // Create new remix recipe
    .post(remixControllers.createRemixRecipe)

// Route Definition
RemixRoutes.route('/:id')

    // Fetch remixed recipe
    .get(remixControllers.fetchRemixedRecipe)

    // Update remixed recipe
    .put(remixControllers.updateRemixedRecipe)