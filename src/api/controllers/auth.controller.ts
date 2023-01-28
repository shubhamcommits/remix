// Import Express Types
import { NextFunction, Request, Response } from 'express'

// Import Utilities
import { SendError } from '../../utils'

// Import Services
import { AuthService } from '../services'

// Export Controller Class
export class AuthController {

 /**
* Fetch All Recipes Controller
* @param req 
* @param res 
* @param next 
* @returns 
*/
    async login(req: Request, res: Response, next: NextFunction) {
        try {

            // Fetch the data from the request body
            let { email, password } = req.body

            // Validate the Data
            if (!email || !password) {

                // Send Status 400 response
                return res.status(400).json({
                    message: 'Validation Error!',
                    error: 'Email & Password are required in the request body!'
                })
            }

            // Call the Service Function
            new AuthService()
                .login(email, password)
                .then((data: any) => {

                    // Send Status 200 response
                    return res.status(200).json({
                        success: true,
                        message: 'User has been authenticated successfully!',
                        data: data
                    })
                })
                .catch((error) => {

                    // Send Status 400 response
                    return res.status(400).json({
                        success: false,
                        message: 'Unable to authenticate the user!',
                        error: error
                    })
                })

        } catch (error) {
            return SendError(res, error)
        }
    }

}