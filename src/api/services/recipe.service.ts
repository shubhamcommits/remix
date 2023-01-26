// Import Recipe Model
import { Recipe } from '../models'

// Export Service Class
export class RecipeService {

    /**
     * This function fetches all the recipes present in the system
     * @returns 
     */
    async fetchAllRecipes() {
        return new Promise(async (resolve, reject) => {
            try {

                // Fetch the list of subscribers
                Recipe.findAll({ raw: true })
                    .then((res: any) => {

                        // Resolve the Promise
                        resolve(res)
                    })
                    .catch((error: any) => {

                        // Reject the Promise with Data
                        reject([])
                    })

            } catch (error) {
                reject({ error: error })
            }
        })
    }
}