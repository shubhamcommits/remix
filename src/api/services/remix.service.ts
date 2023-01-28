// Import Recipe Model
import { Remix, RemixType } from '../models'

// Import OpenAI Class
import { OpenAI } from '../../utils'

// Import Helper Service
import { HelperService } from './helper.service'

// Create openai instance
const openai = new OpenAI()

// Export Service Class
export class RemixService {

    /**
     * This function is responsible for remixing a recipe by it's recipe type
     * @returns 
     */
    async remixRecipe(recipe: any, remixType: any) {
        return new Promise(async (resolve, reject) => {
            try {

                // Prepare the correct prompt for completion
                recipe = `Please take the following recipe and make it ${remixType.name}. Kindly provide a JSON containing title, instructions, and ingredients. \n ${recipe}`

                openai.generateRemixRecipe(recipe)
                    .then((data: any) => {

                        // Fetch the recipe from generative response
                        let remix = data.choices[0].text

                        new HelperService()
                            .extractRawRecipe(remix)
                            .then((data: any) => {

                                // Resolve the structured data
                                resolve({
                                    title: data.title,
                                    ingredients: data.ingredients,
                                    instructions: data.ingredients
                                })
                            })
                            .catch((error) => {

                                // Reject the Promise
                                reject({ message: 'Unable to extract the details from the remixed recipe!', stack: error })
                            })

                        // Resolve the promise
                        resolve({ recipe: remix })
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
                        resolve({ data: data })

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
     * This function fetches all the remix types present in the system
     * @returns 
     */
    async fetchAllRemixTypes() {
        return new Promise(async (resolve, reject) => {
            try {

                // Fetch the list of remix types
                RemixType.findAll({ raw: true })
                    .then((data: any) => {

                        // Resolve the Promise
                        resolve({ data: data })
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
     * This function is responsible for creating the new remix recipe
     * @param name 
     * @param prompt 
     * @returns 
     */
    async createRemixRecipe(remix_type: string, remix_raw?: string, ingredients?: any, instructions?: any) {
        return new Promise(async (resolve, reject) => {
            try {

                // Create the new Remix Type
                Remix.create({
                    remix_type: remix_type,
                    remix_raw: remix_raw,
                    ingredients: ingredients || [],
                    instructions: instructions || []
                })
                    .then((data) => {

                        // Resolve the Promise
                        resolve({ data: data })

                    })
                    .catch((error) => {

                        // Reject the Promise
                        reject({ message: 'Unable to create the Remix of the Recipe, please try again!', stack: error })
                    })

            } catch (error) {
                reject({ error: error })
            }
        })
    }

    /**
     * This function fetches a remix recipe by ID
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
                        reject({ message: 'Unable to find the requested the Remix Recipe, please try again with a different ID!', stack: error })
                    })

            } catch (error) {
                reject({ error: error })
            }
        })
    }

    /**
     * This function is responsible for updating the remix recipe
     * @param id
     * @param name 
     * @param prompt 
     * @returns 
     */
    async updateRemixedRecipe(id: any, remix_type: string, remix_raw?: string, ingredients?: any, instructions?: any) {
        return new Promise(async (resolve, reject) => {
            try {

                // Fetch the Remix Type Item
                new RemixService().fetchRemixedRecipe(id)
                    .then((remixRecipe) => {

                        // Check if Remix Recipe Is not Null
                        if (remixRecipe == null || !remixRecipe) {

                            // Reject the Promise
                            reject({ message: 'Unable to find the requested the Remix Recipe, please try again with a different ID!' })

                        }

                        // Update the new Remix
                        Remix.update({
                            remix_type: remix_type,
                            remix_raw: remix_raw,
                            ingredients: ingredients || [],
                            instructions: instructions || []
                        }, {
                            where: { remix_id: id }
                        })
                            .then((data) => {

                                // Resolve the Promise
                                resolve({ data: data })

                            })
                            .catch((error) => {

                                // Reject the Promise
                                reject({ message: 'Unable to update the Remix Recipe, please try again!', stack: error })
                            })
                    })
                    .catch((error) => {

                        // Reject the Promise
                        reject({ message: 'Unable to find the requested the Remix Recipe, please try again with a different ID!', stack: error })
                    })

            } catch (error) {
                reject({ error: error })
            }
        })
    }

    /**
     * This function fetches all the remix recipes present in the system
     * @returns 
     */
    async fetchAllRemixRecipes() {
        return new Promise(async (resolve, reject) => {
            try {

                // Fetch the list of remix types
                Remix.findAll({ raw: true })
                    .then((data: any) => {

                        // Resolve the Promise
                        resolve({ data: data })
                    })
                    .catch((error: any) => {

                        // Reject the Promise
                        reject({ message: 'Unable to fetch the Remix Recipes list, please try again!', stack: error })
                    })

            } catch (error) {
                reject({ error: error })
            }
        })
    }

}