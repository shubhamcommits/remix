// Import Recipe Model
import { Recipe } from '../models'

// Import Helper Service
import { HelperService } from './helper.service'

// Create Helper Service Instance
const helperService = new HelperService()

// Export Service Class
export class RecipeService {

    /**
     * This function is responsible for creating the new recipe
     * @param name 
     * @param prompt 
     * @returns 
     */
    async createRecipe(url: any) {
        return new Promise(async (resolve, reject) => {
            try {

                // Parse the Recipe from the URL
                helperService.scrapeURL(url)
                    .then((data: any) => {

                        // Create the new Recipe Type
                        Recipe.create(data)
                            .then((recipe) => {

                                // Resolve the Promise
                                resolve({ data: recipe })

                            })
                            .catch((error) => {

                                // Reject the Promise
                                reject({ message: 'Unable to create the Recipe, please try again!', stack: error })
                            })
                    })
                    .catch((error: any) => {

                        // Reject the Promise
                        reject({
                            message: 'Unable to parse the recipe!',
                            data: error
                        })
                    })

            } catch (error) {
                reject({ error: error })
            }
        })
    }

    /**
     * This function fetches all the recipes present in the system
     * @returns 
     */
    async fetchAllRecipes() {
        return new Promise(async (resolve, reject) => {
            try {

                // Fetch the list of recipes
                Recipe.findAll({ raw: true })
                    .then((res: any) => {

                        // Resolve the Promise
                        resolve(res)
                    })
                    .catch((error: any) => {

                        // Reject the Promise
                        reject([])
                    })

            } catch (error) {
                reject({ error: error })
            }
        })
    }

    /**
     * This function is responsible to scrap the recipe from a website
     * @returns 
     */
    async parseRecipe(url: any) {
        return new Promise(async (resolve, reject) => {
            try {

                // Parse the Recipe from the URL
                helperService.scrapeURL(url)
                    .then((data: any) => {

                        // Resolve the Promise
                        resolve({
                            message: 'Recipe has been parsed successfully!',
                            recipe: data
                        })
                    })
                    .catch((error: any) => {

                        // Reject the Promise
                        reject({
                            message: 'Unable to parse the recipe!',
                            data: error
                        })
                    })

            } catch (error) {
                reject({ error: error })
            }
        })
    }

    /**
     * This function is responsible to extracting the title, ingredients, and instructions from a raw recipe
     * @returns 
     */
    async extractRawRecipe(rawText: any) {
        return new Promise(async (resolve, reject) => {
            try {

                // Extrace the Recipe Details from Raw Text
                helperService.extractRawRecipe(rawText)
                    .then((data: any) => {

                        // Resolve the Promise
                        resolve({
                            message: 'Recipe detail has been extracted successfully!',
                            recipe: data
                        })
                    })
                    .catch((error: any) => {

                        // Reject the Promise
                        reject({
                            message: 'Unable to extrace the recipe detail!',
                            data: error
                        })
                    })

            } catch (error) {
                reject({ error: error })
            }
        })
    }
}