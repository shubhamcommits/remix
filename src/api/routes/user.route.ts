// Router Module
import { Router } from 'express'

// Import User Controllers
import { UserController } from '../controllers'

// Auth Module from Auth0
import { requiresAuth } from 'express-openid-connect'

// Import Auth from Utils
import { isloggedInToAuth0 } from '../../utils/auth'

// Instantiate Controller
const userControllers = new UserController()

// Export Router
export const UserRoutes = Router()

// Route Definition
UserRoutes.route('/')

    // GET - Fetch all Users
    .get(isloggedInToAuth0, requiresAuth(), userControllers.fetchAllUsers)

    // POST - Create User Route Definition
    .post(isloggedInToAuth0, requiresAuth(), userControllers.createUser)