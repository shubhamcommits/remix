// Import Express Types
import { NextFunction, Request, Response } from 'express'

// Import Utilities
import { SendError } from '../../utils'

// Import Services
import { RecipeService } from '../services'

// Export Controller Class
export class RecipeController {

    /**
    * Create Recipe Controller
    * @param req 
    * @param res 
    * @param next 
    * @returns 
    */
    async createRecipe(req: Request, res: Response, next: NextFunction) {
        try {

            // Fetch the data from the request body
            let { url } = req.body

            // Validate the Data
            if (!url) {

                // Send Status 400 response
                return res.status(400).json({
                    message: 'Validation Error!',
                    error: 'URL is required in the request body!'
                })
            }

            // Call the Service Function
            new RecipeService()
                .createRecipe(url)
                .then((data: any) => {

                    // Send Status 200 response
                    return res.status(200).json({
                        success: true,
                        message: 'New Recipe has been created successfully!',
                        recipe: data
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
                        success: true,
                        message: 'All the recipes are fetched!',
                        recipes: data
                    })
                })
                .catch((error) => {

                    // Send Status 400 response
                    return res.status(400).json({
                        success: false,
                        message: 'Unable to fetch the recipes!',
                        error: error
                    })
                })

        } catch (error) {
            return SendError(res, error)
        }
    }

    /**
    * Fetch Recipe by ID Controller
    * @param req 
    * @param res 
    * @param next 
    * @returns 
    */
    async fetchRecipe(req: Request, res: Response, next: NextFunction) {
        try {

            // Fetch the ID from the params body
            let { id } = req.params

            // Validate the ID
            if (!id) {

                // Send Status 400 response
                return res.status(400).json({
                    message: 'Validation Error!',
                    error: 'Recipe ID is required in the request params!'
                })
            }

            // Call the Service Function
            new RecipeService()
                .fetchRecipe(id)
                .then((recipe: any) => {

                    // Recipe is not found
                    if (recipe == null) {

                        // Send Status 404 response
                        return res.status(404).json({
                            success: false,
                            message: 'Unable to find the requested the Recipe, please try again with a different ID!'
                        })
                    }

                    // Send Status 200 response
                    return res.status(200).json({
                        success: true,
                        message: 'Recipe has been fetched successfully!',
                        recipe: recipe
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
    * Remove Recipe by ID Controller
    * @param req 
    * @param res 
    * @param next 
    * @returns 
    */
    async removeRecipe(req: Request, res: Response, next: NextFunction) {
        try {

            // Fetch the ID from the params body
            let { id } = req.params

            // Validate the ID
            if (!id) {

                // Send Status 400 response
                return res.status(400).json({
                    message: 'Validation Error!',
                    error: 'Recipe ID is required in the request params!'
                })
            }

            // Call the Service Function
            new RecipeService()
                .removeRecipe(id)
                .then((recipe: any) => {

                    // Recipe is not found
                    if (recipe == 0) {

                        // Send Status 404 response
                        return res.status(404).json({
                            success: false,
                            message: 'Unable to find the requested Recipe, please try again with a different ID!'
                        })
                    }

                    // Send Status 200 response
                    return res.status(200).json({
                        success: true,
                        message: 'The requested recipe has been removed successfully!',
                        recipe: recipe
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
    * Parse Recipe Controller
    * @param req 
    * @param res 
    * @param next 
    * @returns 
    */
    async parseRecipe(req: Request, res: Response, next: NextFunction) {
        try {

            // Fetch the data from the request body
            let { url } = req.body

            // Validate the Data
            if (!url) {

                // Send Status 400 response
                return res.status(400).json({
                    message: 'Validation Error!',
                    error: 'URL is required in the request body!'
                })
            }

            // Call the Service Function
            new RecipeService()
                .parseRecipe(url)
                .then((data: any) => {

                    // Send Status 200 response
                    return res.status(200).json({
                        success: true,
                        message: data.message,
                        recipe: data.recipe
                    })
                })
                .catch((data: any) => {

                    // Send Status 400 response
                    return res.status(400).json({
                        code: data.code,
                        success: false,
                        message: data.message,
                        description: data.description
                        // recipe: data.recipe,
                    })
                })

        } catch (error) {
            return SendError(res, error)
        }
    }

    /**
    * Extract Recipe from Raw Text Controller
    * @param req 
    * @param res 
    * @param next 
    * @returns 
    */
    async extractRawRecipe(req: Request, res: Response, next: NextFunction) {
        try {

            // Fetch the data from the request body
            let { raw_recipe } = req.body

            // Validate the Data
            if (!raw_recipe) {

                // Send Status 400 response
                return res.status(400).json({
                    message: 'Validation Error!',
                    error: 'Raw Recipe is required in the request body!'
                })
            }

            // Call the Service Function
            new RecipeService()
                .extractRawRecipe(raw_recipe)
                .then((data: any) => {

                    // Send Status 200 response
                    return res.status(200).json({
                        success: true,
                        message: data.message,
                        recipe: data.recipe
                    })
                })
                .catch((error: any) => {

                    // Send Status 400 response
                    return res.status(400).json({
                        success: false,
                        message: error.message,
                        error: error.data
                    })
                })

        } catch (error) {
            return SendError(res, error)
        }
    }
}