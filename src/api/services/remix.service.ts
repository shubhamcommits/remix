// Import Recipe Model
import { Remix, RemixType } from '../models'

// Import OpenAI Class
import { OpenAI } from '../../utils'

// Import Helper Service
import { HelperService, RecipeService } from './index'

// Create openai instance
const openai = new OpenAI()

// Export Service Class
export class RemixService {

    /**
     * This function is responsible for remixing a recipe by it's recipe type
     * @returns 
     */
    async remixRecipe(remixTypeName: any, instructions: any) {
        return new Promise(async (resolve, reject) => {
            try {

                // Prepare the correct prompt for completion
                let recipe: any = `Please take the following recipe and make it ${remixTypeName}. Kindly provide title, instructions, and ingredients as the output. \n ${instructions.join('\n')}`

                openai.generateRemixRecipe(recipe)
                    .then((res: any) => {

                        // Fetch the recipe from generative response
                        let remix = res.data

                        new HelperService()
                            .extractRawRecipe(remix)
                            .then((data: any) => {

                                // Resolve the structured data
                                resolve({
                                    title: data.title,
                                    ingredients: data.ingredients,
                                    instructions: data.instructions
                                })
                            })
                            .catch((error) => {

                                // Reject the Promise
                                reject({ message: 'Unable to extract the details from the remixed recipe!', stack: error })
                            })
                    })
                    .catch((error) => {

                        // Reject the Promise
                        reject({ message: 'Unable to generate the remix from OpenAI', stack: error })
                    })

            } catch (error) {
                reject({ error: error })
            }
        })
    }

    /**
     * This function is responsible for creating the new remix type
     * @param name 
     * @param prompt 
     * @returns 
     */
    async createRemixType(name: string, prompt: string) {
        return new Promise(async (resolve, reject) => {
            try {

                // Create the new Remix Type
                RemixType.create({ name: name, prompt: prompt })
                    .then((data) => {

                        // Resolve the Promise
                        resolve(data)

                    })
                    .catch((error) => {

                        // Reject the Promise
                        reject({ message: 'Unable to create the Remix Type, please try again!', stack: error })
                    })

            } catch (error) {
                reject({ error: error })
            }
        })
    }

    /**
     * This function fetches a remix type by ID
     * @returns 
     */
    async fetchRemixType(id: any) {
        return new Promise(async (resolve, reject) => {
            try {

                // Fetch the RemixType
                RemixType.findOne({
                    where: {
                        remix_type_id: id
                    }
                })
                    .then((res: any) => {

                        // Resolve the Promise
                        resolve(res)
                    })
                    .catch((error: any) => {

                        // Reject the Promise
                        reject({ message: 'Unable to find the requested the Remix Type, please try again with a different ID!', stack: error })
                    })

            } catch (error) {
                reject({ error: error })
            }
        })
    }

    /**
     * This function fetches all the remix types present in the system
     * @returns 
     */
    async fetchAllRemixTypes() {
        return new Promise(async (resolve, reject) => {
            try {

                // Fetch the list of remix types
                RemixType.findAll({ 
                    raw: true,
                    attributes: ['remix_type_id', 'name', 'prompt'] 
                })
                    .then((data: any) => {

                        // Resolve the Promise
                        resolve(data)
                    })
                    .catch((error: any) => {

                        // Reject the Promise
                        reject({ message: 'Unable to fetch the Remix Type list, please try again!', stack: error })
                    })

            } catch (error) {
                reject({ error: error })
            }
        })
    }

    /**
     * This function is responsible for updating the remix type
     * @param id
     * @param name 
     * @param prompt 
     * @returns 
     */
    async updateRemixType(id: any, name: string, prompt: string) {
        return new Promise(async (resolve, reject) => {
            try {

                // Fetch the Remix Type Item
                new RemixService().fetchRemixType(id)
                    .then((remixType) => {

                        // Check if Remix Type Is not Null
                        if (remixType == null || !remixType) {

                            // Reject the Promise
                            reject({ message: 'Unable to find the requested the Remix Type, please try again with a different ID!' })

                        }

                        // Update the new Remix Type
                        RemixType.update({ name: name, prompt: prompt }, {
                            where: { remix_type_id: id }
                        })
                            .then((data) => {

                                // Resolve the Promise
                                resolve({ data: data })

                            })
                            .catch((error) => {

                                // Reject the Promise
                                reject({ message: 'Unable to update the Remix Type, please try again!', stack: error })
                            })
                    })
                    .catch((error) => {

                        // Reject the Promise
                        reject({ message: 'Unable to find the requested the Remix Type, please try again with a different ID!', stack: error })
                    })

            } catch (error) {
                reject({ error: error })
            }
        })
    }

    /**
     * This function removes a remix type from the system
     * @returns 
     */
    async removeRemixType(id: any) {
        return new Promise(async (resolve, reject) => {
            try {

                // Remove the Remix Type from the System
                RemixType.destroy({
                    where: {
                        remix_type_id: id
                    }
                })
                    .then((res: any) => {

                        // Resolve the Promise
                        resolve(res)
                    })
                    .catch((error: any) => {

                        // Reject the Promise
                        reject({ message: 'Unable to remove the requested Remix Type, please try again with a different ID!', stack: error })
                    })

            } catch (error) {
                reject({ error: error })
            }
        })
    }

    /**
     * This function is responsible for creating a new remixed recipe
     * @param name 
     * @param prompt 
     * @returns 
     */
    async createRemixedRecipe(remix_type_id: string, recipe_id: any) {
        return new Promise(async (resolve, reject) => {
            try {

                // Fetch Remix Type
                let remix_type: any = await this.fetchRemixType(remix_type_id)
                    .catch((error) => {

                        // Reject the Promise
                        reject({ message: 'Unable to find the requested Remix Type, please try again with a different ID!', stack: error })
                    })

                // If Remix Type is not found
                if (remix_type == null) {

                    // Reject the Promise
                    reject({
                        message: 'Unable to find the requested Remix Type to be remixed with, please try again with a different ID!'
                    })
                }

                // Fetch the Recipe Details
                let recipe: any = await new RecipeService().fetchRecipe(recipe_id)
                    .catch((error) => {

                        // Reject the Promise
                        reject({ message: 'Unable to find the requested Recipe to be remixed with, please try again with a different ID!', stack: error })
                    })

                // Recipe is not found
                if (recipe == null) {

                    // Reject the Promise
                    reject({
                        message: 'Unable to find the requested Recipe to be remixed with, please try again with a different ID!'
                    })
                }

                // Create the new Remix
                let remix: any = await Remix.create({
                    remix_type: remix_type.remix_type_id,
                    recipe_id: recipe_id,
                    remix_raw: recipe.recipe_raw,
                    ingredients: recipe.ingredients,
                    instructions: recipe.instructions
                })
                    .catch((error) => {

                        // Reject the Promise
                        reject({ message: 'Unable to create the Remix of the Recipe, please try again!', stack: error })
                    })

                // Remix Recipe From OpenAI
                this.remixRecipe(remix_type.name, recipe.instructions)
                    .then(async (recipe_ai: any) => {

                        // Update the Remix Recipe on Run Time
                        this.updateRemixedRecipe(
                            remix.remix_id,
                            remix_type.remix_type_id,
                            recipe_id,
                            recipe_ai.title,
                            recipe_ai.ingredients,
                            recipe_ai.instructions)
                            .then(() => { console.log(`\n Recipe - ${remix.remix_id} has been updated with response from Open-AI!\n`) })
                            .catch((error) => {

                                // Reject the Promise
                                reject({ message: 'Unable to update the Remixed Recipe, please try again!', stack: error })
                            })
                    })
                    .catch((error) => {

                        // Reject the Promise
                        reject({ message: 'Unable to generate the remix from OpenAI!', stack: error })
                    })
                
                // Resolve the Promise
                resolve(remix)

            } catch (error) {
                reject({ error: error })
            }
        })
    }

    /**
     * This function fetches a remixed recipe by ID
     * @returns 
     */
    async fetchRemixedRecipe(id: any) {
        return new Promise(async (resolve, reject) => {
            try {

                // Fetch the RemixType
                Remix.findOne({
                    where: {
                        remix_id: id
                    }
                })
                    .then((res: any) => {

                        // Resolve the Promise
                        resolve(res)
                    })
                    .catch((error: any) => {

                        // Reject the Promise
                        reject({ message: 'Unable to find the requested the Remixed Recipe, please try again with a different ID!', stack: error })
                    })

            } catch (error) {
                reject({ error: error })
            }
        })
    }

    /**
     * This function fetches all the remixed recipes present in the system
     * @returns 
     */
    async fetchAllRemixedRecipes() {
        return new Promise(async (resolve, reject) => {
            try {

                // Fetch the list of remix types
                Remix.findAll({ 
                    raw: true,
                    attributes: ['remix_id', 'recipe_id', 'title', 'ingredients', 'instructions', 'remix_type'] 
                })
                    .then((data: any) => {

                        // Resolve the Promise
                        resolve(data)
                    })
                    .catch((error: any) => {

                        // Reject the Promise
                        reject({ message: 'Unable to fetch the Remixed Recipes list, please try again!', stack: error })
                    })

            } catch (error) {
                reject({ error: error })
            }
        })
    }

    /**
     * This function is responsible for updating the remixed recipe
     * @param id
     * @param name 
     * @param prompt 
     * @returns 
     */
    async updateRemixedRecipe(id: any, remix_type: string, recipe_id: string, title?: string, ingredients?: any, instructions?: any) {
        return new Promise(async (resolve, reject) => {
            try {

                // Fetch the Remix Type Item
                new RemixService().fetchRemixedRecipe(id)
                    .then((remixRecipe) => {

                        // Check if Remixed Recipe Is Null
                        if (remixRecipe == null || !remixRecipe) {

                            // Reject the Promise
                            reject({ message: 'Unable to find the requested the Remixed Recipe, please try again with a different ID!' })

                        }

                        // Update the new Remix
                        Remix.update({
                            remix_type: remix_type,
                            recipe_id: recipe_id,
                            title: title,
                            ingredients: ingredients || [],
                            instructions: instructions || []
                        }, {
                            where: { remix_id: id }
                        })
                            .then((data) => {

                                // Resolve the Promise
                                resolve(data)

                            })
                            .catch((error) => {

                                // Reject the Promise
                                reject({ message: 'Unable to update the Remixed Recipe, please try again!', stack: error })
                            })
                    })
                    .catch((error) => {

                        // Reject the Promise
                        reject({ message: 'Unable to find the requested the Remixed Recipe, please try again with a different ID!', stack: error })
                    })

            } catch (error) {
                reject({ error: error })
            }
        })
    }

    /**
     * This function removes a remixed recipe from the system
     * @returns 
     */
    async removeRemixedRecipe(id: any) {
        return new Promise(async (resolve, reject) => {
            try {

                // Fetch the list of recipes
                Remix.destroy({
                    where: {
                        remix_id: id
                    }
                })
                    .then((res: any) => {

                        // Resolve the Promise
                        resolve(res)
                    })
                    .catch((error: any) => {

                        // Reject the Promise
                        reject({ message: 'Unable to remove the requested Remixed Recipe, please try again with a different ID!', stack: error })
                    })

            } catch (error) {
                reject({ error: error })
            }
        })
    }

}