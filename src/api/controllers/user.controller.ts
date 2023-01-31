// Import Express Types
import { NextFunction, Request, Response } from 'express'

// Import Utilities
import { SendError } from '../../utils'

// Import Services
import { UserService } from '../services'

// Export Controller Class
export class UserController {

    /**
    * Create User Controller
    * @param req 
    * @param res 
    * @param next 
    * @returns 
    */
    async createUser(req: Request, res: Response, next: NextFunction) {
        try {

            // Fetch the data from the request body
            let { name, email } = req.body

            // Validate the Data
            if (!name || !email) {

                // Send Status 400 response
                return res.status(400).json({
                    message: 'Validation Error!',
                    error: 'Name & Email are required in the request body!'
                })
            }

            // Call the Service Function
            new UserService()
                .createUser(name, email)
                .then((data: any) => {

                    // Send Status 200 response
                    return res.status(200).json({
                        success: true,
                        message: 'New User has been created successfully!',
                        user: data
                    })
                })
                .catch((error) => {

                    // Send Status 400 response
                    return res.status(400).json({
                        success: false,
                        message: error.message,
                        error: error.stack
                    })
                })

        } catch (error) {
            return SendError(res, error)
        }
    }

    /**
    * Fetch All Users Controller
    * @param req 
    * @param res 
    * @param next 
    * @returns 
    */
    async fetchAllUsers(req: Request, res: Response, next: NextFunction) {
        try {

            // Call the Service Function
            new UserService()
                .fetchAllUsers()
                .then((data: any) => {

                    // Send Status 200 response
                    return res.status(200).json({
                        success: true,
                        message: 'All the users are fetched successfully!',
                        users: data || []
                    })
                })
                .catch((error) => {

                    // Send Status 400 response
                    return res.status(400).json({
                        success: false,
                        message: error.message,
                        error: error.stack
                    })
                })

        } catch (error) {
            return SendError(res, error)
        }
    }

}