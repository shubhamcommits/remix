// Import Express Types
import { NextFunction, Request, Response } from 'express'

// Import Utilities
import { SendError } from '../../utils'

// Import Services
import { RemixService } from '../services'

// Export Controller Class
export class RemixController {

    /**
    * Create Remix Type Controller
    * @param req 
    * @param res 
    * @param next 
    * @returns 
    */
    async createRemixType(req: Request, res: Response, next: NextFunction) {
        try {

            // Fetch the data from the request body
            let { name, prompt } = req.body

            // Validate the Data
            if (!name || !prompt) {

                // Send Status 400 response
                return res.status(400).json({
                    message: 'Validation Error!',
                    error: 'Name & Prompt are required in the request body!'
                })
            }

            // Call the Service Function
            new RemixService()
                .createRemixType(name, prompt)
                .then((data: any) => {

                    // Send Status 200 response
                    return res.status(200).json({
                        success: true,
                        message: 'New Remix Type has been created successfully!',
                        remix_type: data
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
    * Fetch Remix Types by ID Controller
    * @param req 
    * @param res 
    * @param next 
    * @returns 
    */
    async fetchRemixType(req: Request, res: Response, next: NextFunction) {
        try {

            // Fetch the ID from the params body
            let { id } = req.params

            // Validate the ID
            if (!id) {

                // Send Status 400 response
                return res.status(400).json({
                    message: 'Validation Error!',
                    error: 'Remix Type ID is required in the request params!'
                })
            }

            // Call the Service Function
            new RemixService()
                .fetchRemixType(id)
                .then((remix_type: any) => {

                    // Remix Type is not found
                    if (remix_type == null) {

                        // Send Status 404 response
                        return res.status(404).json({
                            success: false,
                            message: 'Unable to find the requested the Remix Type, please try again with a different ID!'
                        })
                    }

                    // Send Status 200 response
                    return res.status(200).json({
                        success: true,
                        message: 'Remix Type has been fetched successfully!',
                        remix_type: remix_type
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
    * Fetch All Remix Types Controller
    * @param req 
    * @param res 
    * @param next 
    * @returns 
    */
    async fetchAllRemixTypes(req: Request, res: Response, next: NextFunction) {
        try {

            // Call the Service Function
            new RemixService()
                .fetchAllRemixTypes()
                .then((remix_types: any) => {

                    // Send Status 200 response
                    return res.status(200).json({
                        success: true,
                        message: 'All the remix types are fetched successfully!',
                        remix_types: remix_types.data || []
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
    * Update Remix Type Controller
    * @param req 
    * @param res 
    * @param next 
    * @returns 
    */
    async updateRemixType(req: Request, res: Response, next: NextFunction) {
        try {

            // Fetch the data from the request body
            let { name, prompt } = req.body

            // Fetch the ID from the params body
            let { id } = req.params

            // Validate the Data
            if (!name || !prompt) {

                // Send Status 400 response
                return res.status(400).json({
                    message: 'Validation Error!',
                    error: 'Name & Prompt are required in the request body!'
                })
            }

            // Validate the ID
            if (!id) {

                // Send Status 400 response
                return res.status(400).json({
                    message: 'Validation Error!',
                    error: 'Remix Type ID is required in the request params!'
                })
            }

            // Call the Service Function
            new RemixService()
                .updateRemixType(id, name, prompt)
                .then((data: any) => {

                    // Send Status 200 response
                    return res.status(200).json({
                        success: true,
                        message: 'Remix Type has been updated successfully!'
                    })
                })
                .catch((error) => {

                    console.log(error)

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
    * Create Remix Controller
    * @param req 
    * @param res 
    * @param next 
    * @returns 
    */
    async createRemixRecipe(req: Request, res: Response, next: NextFunction) {
        try {

            // Fetch the data from the request body
            let { remix_type, remix_raw, ingredients, instructions } = req.body

            // Validate the Data
            if (!remix_type || !remix_raw) {

                // Send Status 400 response
                return res.status(400).json({
                    message: 'Validation Error!',
                    error: 'Recipe Type & Raw Recipe are required in the request body!'
                })
            }

            // Call the Service Function
            new RemixService()
                .createRemixRecipe(remix_type, remix_raw, ingredients, instructions)
                .then((data: any) => {

                    // Send Status 200 response
                    return res.status(200).json({
                        success: true,
                        message: 'New Remix Recipe has been created successfully!',
                        remix: data
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
    * Fetch Remixed Recipe by ID Controller
    * @param req 
    * @param res 
    * @param next 
    * @returns 
    */
    async fetchRemixedRecipe(req: Request, res: Response, next: NextFunction) {
        try {

            // Fetch the ID from the params body
            let { id } = req.params

            // Validate the ID
            if (!id) {

                // Send Status 400 response
                return res.status(400).json({
                    message: 'Validation Error!',
                    error: 'Remixed Recipe ID is required in the request params!'
                })
            }

            // Call the Service Function
            new RemixService()
                .fetchRemixedRecipe(id)
                .then((remix: any) => {

                    // Remixed Recipe is not found
                    if (remix == null) {

                        // Send Status 404 response
                        return res.status(404).json({
                            success: false,
                            message: 'Unable to find the requested the Remixed Recipe, please try again with a different ID!'
                        })
                    }

                    // Send Status 200 response
                    return res.status(200).json({
                        success: true,
                        message: 'Remixed Recipe has been fetched successfully!',
                        remix: remix
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
    * Fetch All Remix Recipes Controller
    * @param req 
    * @param res 
    * @param next 
    * @returns 
    */
    async fetchAllRemixRecipes(req: Request, res: Response, next: NextFunction) {
        try {

            // Call the Service Function
            new RemixService()
                .fetchAllRemixRecipes()
                .then((remixes: any) => {

                    // Send Status 200 response
                    return res.status(200).json({
                        success: true,
                        message: 'All the remix recipes are fetched successfully!',
                        remixes: remixes.data || []
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
    * Update Remix Type Controller
    * @param req 
    * @param res 
    * @param next 
    * @returns 
    */
    async updateRemixedRecipe(req: Request, res: Response, next: NextFunction) {
        try {

            // Fetch the data from the request body
            let { remix_type, remix_raw, ingredients, instructions } = req.body

            // Fetch the ID from the params body
            let { id } = req.params

            // Validate the ID
            if (!id) {

                // Send Status 400 response
                return res.status(400).json({
                    message: 'Validation Error!',
                    error: 'Remixed Recipe ID is required in the request params!'
                })
            }

            // Validate the Data
            if (!remix_type || !remix_raw) {

                // Send Status 400 response
                return res.status(400).json({
                    message: 'Validation Error!',
                    error: 'Remix Type & Raw Recipe are required in the request body!'
                })
            }

            // Call the Service Function
            new RemixService()
                .updateRemixedRecipe(id, remix_type, remix_raw, ingredients, instructions)
                .then((data: any) => {

                    // Send Status 200 response
                    return res.status(200).json({
                        success: true,
                        message: 'Remixed Recipe has been updated successfully!'
                    })
                })
                .catch((error) => {

                    console.log(error)

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