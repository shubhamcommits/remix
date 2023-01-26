// Import Express Types
import { NextFunction, Request, Response } from 'express'

// Import Utilities
import { SendError } from '../../utils'

// Import Services
import { RecipeService } from '../services'

// Export Controller Class
export class RecipeController {

 /**
 * Fetch All Recipes Controller
 * @param req 
 * @param res 
 * @param next 
 * @returns 
 */
    async fetchAllRecipes(req: Request, res: Response, next: NextFunction) {
        try {

            // Call the Service Function
            new RecipeService()
                .fetchAllRecipes()
                .then((data: any) => {

                    // Send Status 200 response
                    return res.status(200).json({
                        message: 'All the recipes are fetched!',
                        success: true,
                        recipes: data
                    })
                })
                .catch((error) => {

                    // Send Status 400 response
                    return res.status(400).json({
                        message: 'Unable to fetch the recipes!',
                        success: false,
                        error: error
                    })
                })

        } catch (error) {
            return SendError(res, error)
        }
    }
}