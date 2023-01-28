// Router Module
import { Router } from 'express'

// Import User Controllers
import { UserController } from '../controllers'

// Instantiate Controller
const userControllers = new UserController()

// Export Router
export const UserRoutes = Router()

// Route Definition
UserRoutes.route('/')

    // POST - Create User Route Definition
    .post(userControllers.createUser)