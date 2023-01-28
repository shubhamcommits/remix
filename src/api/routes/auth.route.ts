// Router Module
import { Router } from 'express'

// Import Auth Controllers
import { AuthController } from '../controllers'

// Instantiate Controller
const authControllers = new AuthController()

// Export Router
export const AuthRoutes = Router()

// POST - Login Route Definition
AuthRoutes.post('/login', authControllers.login)