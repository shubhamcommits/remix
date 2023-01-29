// Import axios Module
import axios from 'axios'

// Import cheerio Module
import cheerio from 'cheerio'

// Import Dice's Coefficient String Similarity
import { compareTwoStrings, findBestMatch } from 'string-similarity'

// Import NLP Module
import nlp from 'compromise'

// Import lodash Module
import lodash from 'lodash'

// Export Service Class
export class HelperService {

    /**
     * This function is responsible for calling the custom Http API
     * @param {*} url 
     * @returns 
     */
    async scrapeURL(url: any) {
        return new Promise(async (resolve, reject) => {

            // Record the API response
            axios.get(url)
                .then(async (response) => {

                    let recipe = await new HelperService().parseRecipeAndIngredients(response.data)

                    // Resolve the Promise
                    resolve(recipe)

                })
                .catch((error) => {

                    // Reject the error
                    reject(error)
                })
        })
    }

    /**
     * This function is responsible for extracting the title, ingredients, and instructions
     * @param raw_text 
     * @returns 
     */
    extractRawRecipe(rawText: any) {
        return new Promise((resolve) => {

            // Split the Raw Text
            const lines = rawText.trim().split('\n')

            // Ingredient and Instruction Line
            let isIngredient = false
            let isInstruction = false

            // Fetch the title, indgredients, and instructions
            let title = ''
            let ingredients = []
            let instructions = []

            // Iterate over all the lines and perform the logic on text
            for (let i = 0; i < lines.length; i++) {

                // Remove the Leading & Trailing Spaces
                lines[i] = lines[i].trim()

                // Fetch the Ingredients
                if (compareTwoStrings('ingredient', lines[i].toLowerCase()) >= 0.75) {
                    isIngredient = true
                    continue
                }

                // Fetch the Instructions
                if (compareTwoStrings('instruction', lines[i].toLowerCase()) >= 0.75) {
                    isIngredient = false
                    isInstruction = true
                    continue
                }

                // Set the Title
                if (!isIngredient && !isInstruction && !title) {
                    title = lines[i]
                }

                // Set the Ingredients
                if (isIngredient && lines[i] != '') {
                    ingredients.push(lines[i])
                }

                // Set the Instructions
                if (isInstruction && lines[i] != '') {
                    instructions.push(lines[i])
                }
            }

            // Resolve the promise
            resolve({ title: title, ingredients: ingredients, instructions: instructions })
        })
    }

    /**
     * This function fetches the list of all the best matching properties from a JSON
     * @param json 
     * @param matchingProperties 
     * @returns 
     */
    getAllMatchingKeys(json: any, matchingProperties: string[]): string[] {

        // Global List of Keys from a JSON
        let keys: string[] = []

        // Fetch all the parent/nested Keys and Push into the global array
        function fetchKeys(obj: any) {
            for (let key in obj) {
                keys.push(key)
                if (typeof obj[key] === "object") {
                    fetchKeys(obj[key])
                }
            }
        }

        // Call the function
        fetchKeys(json)

        // Array of best matches from the global keys 
        let bestMatches: any = []

        // Push the key into the matching property
        matchingProperties.forEach((prop) => {
            bestMatches.push(findBestMatch(prop, keys).bestMatch.target || '')
        })

        // Return the list of best matches
        return bestMatches
    }

    /**
     * This function fetches the key position from a key
     * @param json 
     * @param key 
     * @param path 
     * @returns 
     */
    findKeyPosition(json: any, key: string, path: string[] = []): string[] | null {
        for (let k in json) {
            if (k === key) {
                return path.concat(k)
            }
            if (typeof json[k] === "object") {
                let result = this.findKeyPosition(json[k], key, path.concat(k))
                if (result !== null) {
                    return result
                }
            }
        }
        return null
    }

    /**
     * This function fetches the list of all the positions of keys
     * @param json 
     * @param keys 
     * @returns 
     */
    findKeyPositions(json: object, keys: string[]) {
        let result: any = {}
        keys.forEach((key: any) => {
            result[key] = this.findKeyPosition(json, key)
        })
        return result
    }

    /**
     * Check if an object is empty or not
     * @param obj 
     * @returns 
     */
    checkIfObjectIsEmpty(obj: object) {
        if (JSON.stringify(obj) == JSON.stringify('{}') || JSON.stringify(obj) == JSON.stringify(undefined) || JSON.stringify(obj) == JSON.stringify(null))
            return true
        else
            return false
    }

    /**
     * This function is responsible for fetching the data from an URL and parsing the recipes out from it
     * @param html 
     * @returns 
     */
    parseRecipeAndIngredients(html: any) {
        return new Promise((resolve, reject) => {
            try {

                // Load the Cheerio
                const $ = cheerio.load(html)

                // Fetch the LD-JSON Script
                const ldJsonScript = $('script[type="application/ld+json"]').html()

                // Fetch the Title
                const title = ($('title').text() || $('meta[property="og:title"]').attr('content'))?.trim().replaceAll('\n', '')

                // Check if LD-JSON Script exist
                if (ldJsonScript != null || ldJsonScript != undefined) {

                    // Possible matching keys which are supposed to be present in the JSON 
                    const recipeKeys = ['ingredient', 'author', 'image', 'instruction', 'name']

                    // Parse the JSON
                    let result: any = JSON.parse(ldJsonScript || '')

                    // If @type is not found
                    if(result['@type'] == undefined){

                        // Find Recipe Object
                        let recipeIndex = result['@graph'].findIndex((item: any)=> item['@type'] == 'Recipe')
                        if(recipeIndex != -1)
                            result = result['@graph'][recipeIndex]

                        // let personIndex = result['@graph'].findIndex((item: any)=> item['@type'] == 'Person')
                    }

                    // Get the Matching Keys from the JSON
                    let matchingKeys = this.getAllMatchingKeys(result, recipeKeys)

                    // Fetch the relevant position of all the keys
                    let positions = this.findKeyPositions(result, matchingKeys)

                    // Recipe Data
                    let recipe: any = {}

                    Object.entries(positions)
                        .forEach(([key, value]: any) => {

                            // Set Current Value
                            let curr_val = ''

                            // If value has only single element
                            if (value.length == 1)
                                curr_val = `${value[0]}`

                            // Iterate for each value present
                            else if (value.length > 1)
                                value.forEach((val: any) => {
                                    curr_val = curr_val.concat(`.${val}`)
                                })

                            // Matching Recipe Keys
                            let recipeKey = findBestMatch(key, recipeKeys).bestMatch.target

                            // Find the Property Values for the particular property
                            let propertyValue = lodash.get(result, curr_val)

                            // Set the Property Type
                            recipe[`${recipeKey}`] = propertyValue || ''
                        })

                    // Resolve the promise
                    resolve({
                        recipe: {
                            user_id: 'e8942adc-bb5d-477f-9a0f-ec4a1e98d838',
                            title: this.checkIfObjectIsEmpty(title || recipe.name) ? '' : (title || recipe.name) || '',
                            ingredients: this.checkIfObjectIsEmpty(recipe.ingredient) ? [] : recipe.ingredient || [],
                            original_author: (this.checkIfObjectIsEmpty(recipe.author.name) 
                                ? (this.checkIfObjectIsEmpty(recipe.author) ? '' : recipe.author)
                                : recipe.author.name) || '',
                            image: (this.checkIfObjectIsEmpty(recipe.image.url))
                                ? (this.checkIfObjectIsEmpty(recipe.image) ? '' : recipe.image)
                                : (recipe.image.url) || '',
                            instructions: this.checkIfObjectIsEmpty(recipe.instruction) ? '' : recipe.instruction || [],
                            recipe_raw : result
                        },
                    })
                } else {

                    // Remove the relevant tags from the dom tag
                    $('script, style, svg, noscript, link').remove()

                    let result = $('html').html() || ''

                    // Resolve the promise
                    resolve({
                        recipe: {
                            title: title,
                            recipe_raw : result
                        }
                    })
                }

                // Reject the Promise
                reject({ message: 'Unable to parse the recipe, please try again with a different URL!' })

            } catch (error) {
                reject({ error: error })
            }

            // Images for the Recipe
            // const images: any = []

            // // Create the result
            // let result = $('html').html() || ''

            // let doc = nlp($('body').text())
            // let ingredients = doc.match('#Noun').out('array')
            // let check 
            // console.log(ingredients)

            // let recipe = {
            //     author: author,
            //     title: title,
            //     image: image,
            //     instructions: instructions,
            //     ingredients: ingredients
            // }

            // if (!author || !instructions || !ingredients || !title || !image)
            //     reject('')
        })
    }
}