// Import axios Module
import axios from 'axios'

// Import cheerio Module
import cheerio from 'cheerio'

// Import Dice's Coefficient String Similarity
import { compareTwoStrings, findBestMatch } from 'string-similarity'

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

                    // Fetch Recipe from Custom Module
                    let data: any = await new HelperService().parseRecipeAndIngredients(response.data)

                    // Resolve the Promise
                    resolve({ message: data.message, recipe: data.recipe })

                })
                .catch((error) => {

                    if (error.response) {

                        // Reject the error
                        reject({ 
                            message: `${error.message}`, 
                            code: error.response.status, 
                            description: `It looks like the URL provided either doesn't exist or have a recipe associated.`
                        })

                    } else if (error.request) {

                        // Reject the error
                        reject({ 
                            message: `${error.message}`, 
                            code: 0,
                            description: `Unable to create the connection with the URL provided, please try again with a different one!`
                        })
                    } else {

                        // Reject the error
                        reject({ 
                            message: `${error.message}`, 
                            code: 0,
                            description: `Some internal server error occured, please try again!`
                        })
                    }
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
     * This function consumes a raw html and returns the raw page content
     * @param html 
     * @returns 
     */
    returnRawResult(html: any) {

        // Load the Cheerio
        const $ = cheerio.load(html)

        // Remove the relevant tags from the dom tag
        $('script, style, svg, noscript, link').remove()

        let result = $('html').text() || ''
        result = result.replace(/\n/g, '').replace(/\t/g, '')

        // Resolve the promise
        return result.trim()
    }

    /**
     * This function is responsible for extracting the recipe from raw recipe object
     * @param recipe 
     * @returns 
     */
    extractRecipeDetails(recipe: any) {

        try {

            // Extract the Name of the Recipe
            if (typeof recipe['name'] != 'undefined' && recipe['name']) {
                recipe['name'] = recipe['name']
            } else if (typeof recipe['headline'] != 'undefined' && recipe['headline']) {
                recipe['name'] = recipe['headline']
            }

            // Extract the Base Image of the Recipe
            if (typeof recipe['image'] != 'undefined' && recipe['image']) {

                if (typeof recipe['image'] == "object" && Array.isArray(recipe['image']) == false)
                    recipe['image'] = recipe['image']['url']
                else if (Array.isArray(recipe['image']) == true)
                    recipe['image'] = recipe['image'][0]
                else
                    recipe['image'] = recipe['image']
            }

            // Extract the Author of the Recipe
            if (typeof recipe['author'] != 'undefined' && recipe['author']) {

                if (typeof recipe['author'] == "object" && Array.isArray(recipe['author'])) {
                    recipe['author'] = recipe['author'][0]
                }
                if (typeof recipe['author'] == "object")
                    recipe['author'] = recipe['author']['name']
                else
                    recipe['author'] = recipe['author']
            }

            // Extract the Ingredient of the Recipe
            if (typeof recipe['ingredient'] != 'undefined' && recipe['ingredient']) {

                if (recipe['ingredient'].length) {
                    let ingredients: any = []
                    recipe['ingredient'].forEach((ele: any) => {
                        ingredients.push(ele.trim())
                    })
                    recipe['ingredient'] = ingredients
                }
            }

            // Exract the instruction of the Recipe
            if (typeof recipe['instruction'] != 'undefined' && recipe['instruction']) {

                if (Array.isArray(recipe['instruction']) == true && recipe['instruction'].length) {
                    let instructions: any = []
                    recipe['instruction']
                        .forEach((ele: any) => {
                            if (typeof ele == 'object' && ele.hasOwnProperty('itemListElement') == true && ele['itemListElement'].length)
                                ele['itemListElement'].forEach((step: any) => {
                                    instructions.push(step['text'].trim())
                                })
                            else if (typeof ele == 'object' && ele.hasOwnProperty('itemListElement') == false)
                                instructions.push(ele['text'].trim())
                        })

                    if (instructions.length != 0)
                        recipe['instruction'] = instructions
                } else if (Array.isArray(recipe['instruction']) == false) {
                    recipe['instruction'] = recipe['instruction'].split(',  ').map((item: any) => item.trim())
                }
            }

            if (recipe['instruction'].length == 0 || recipe['ingredient'].length == 0)
                return null

            // Return Recipe Object
            return recipe

        } catch (error) {
            return null
        }
    }

    /**
     * This function is responsible for fetching the data from an URL and parsing the recipes out from it
     * @param html 
     * @returns 
     */
    parseRecipeAndIngredients(html: any) {
        return new Promise((resolve, reject) => {

            // Load the Cheerio
            const $ = cheerio.load(html)

            // Fetch the LD-JSON Script
            const ldJsonScript = $('script[type="application/ld+json"]').first().text().trim()

            // Fetch the Title
            const title = ($('title').text() || $('meta[property="og:title"]').attr('content'))?.trim().replaceAll('\n', '')

            try {

                // Check if LD-JSON Script exist
                if (ldJsonScript != null || ldJsonScript != undefined) {

                    // Possible matching keys which are supposed to be present in the JSON 
                    const recipeKeys = ['ingredient', 'author', 'image', 'instruction', 'name']

                    // Parse the JSON
                    let result: any = JSON.parse(ldJsonScript || '')

                    if (Array.isArray(result))
                        result = result[0]

                    // If @type is not found
                    if (result['@type'] == undefined) {

                        // Find Recipe Object
                        let recipeIndex = result['@graph'].findIndex((item: any) => item['@type'] == 'Recipe')
                        if (recipeIndex == -1)
                            recipeIndex = result['@graph'].findIndex((item: any) => item['@type'] == 'BlogPosting')
                        if (recipeIndex != -1)
                            result = result['@graph'][recipeIndex]

                        // let personIndex = result['@graph'].findIndex((item: any)=> item['@type'] == 'Person')
                    }

                    // Get the Matching Keys from the JSON
                    let matchingKeys = this.getAllMatchingKeys(result, recipeKeys)

                    // Fetch the relevant position of all the keys
                    let positions = this.findKeyPositions(result, matchingKeys)

                    // Fetch the list of Keys Size
                    let keysSize = Object.keys(positions).length

                    if (keysSize == recipeKeys.length) {

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

                        // Extract Recipe Details
                        let data = this.extractRecipeDetails(recipe)

                        if (data == null) {

                            // Resolve the promise
                            resolve({
                                message: 'Unable to fetch the Recipe, however the Raw Data has been parsed successfully!',
                                recipe: {
                                    title: title,
                                    recipe_raw: this.returnRawResult(html)
                                }
                            })

                        }

                        // Assign the recipe data
                        recipe = data

                        // Resolve the promise
                        resolve({
                            message: 'Recipe has been parsed successfully!',
                            recipe: {
                                user_id: 'e8942adc-bb5d-477f-9a0f-ec4a1e98d838',
                                title: recipe.name || title,
                                ingredients: recipe.ingredient || [],
                                original_author: recipe.author || '',
                                image: recipe.image || '',
                                instructions: recipe.instruction || [],
                                recipe_raw: JSON.parse(ldJsonScript)
                            }
                        })
                    }

                    else {

                        // Resolve the promise
                        resolve({
                            message: 'Unable to fetch the Recipe, however the Raw Data has been parsed successfully!',
                            recipe: {
                                title: title,
                                recipe_raw: this.returnRawResult(html)
                            }
                        })
                    }
                } else {

                    // Resolve the promise
                    resolve({
                        message: 'Unable to fetch the Recipe, however the Raw Data has been parsed successfully!',
                        recipe: {
                            title: title,
                            recipe_raw: this.returnRawResult(html)
                        }
                    })
                }

            } catch (error) {

                // Resolve the Promise
                resolve({
                    message: 'Unable to fetch the Recipe, however the Raw Data has been parsed successfully!',
                    error: error,
                    recipe: {
                        title: title,
                        recipe_raw: this.returnRawResult(html)
                    }
                })
            }
        })
    }
}