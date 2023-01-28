// Import axios Module
import axios from 'axios'

// Import cheerio Module
import cheerio from 'cheerio'

// Import Dice's Coefficient String Similarity
import { compareTwoStrings } from 'string-similarity'

// Import NLP Module
import nlp from 'compromise'

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

    parseRecipeAndIngredients(html: any) {
        return new Promise((resolve, reject) => {

            // Load the Cheerio
            const $ = cheerio.load(html)

            // Fetch the LD-JSON Script
            const ldJsonScript = $('script[type="application/ld+json"]').html()

            // Check if LD-JSON Script exist
            if (ldJsonScript != null || ldJsonScript != undefined) {

                // Parse the JSON
                let result = JSON.parse(ldJsonScript || '')

                // Resolve the promise
                resolve({
                    title: result.name,
                    user_id: 'e8942adc-bb5d-477f-9a0f-ec4a1e98d838',
                    original_author: result.author.name,
                    image: result.image.url,
                    instructions: result.recipeInstructions,
                    ingredients: result.recipeIngredient,
                })
            }

            // Images for the Recipe
            // const images: any = []

            // const title = ($('title').text() || $('meta[property="og:title"]').attr('content'))?.trim().replaceAll('\n', '')

            // // Remove the relevant tags from the dom tag
            // $('script, style, svg, noscript, link').remove()

            // // Create the result
            // let result = $('html').html() || ''

            // let doc = nlp($('body').text())
            // let ingredients = doc.match('#Noun').out('array')
            // let check 
            // console.log(ingredients)

            // const author = 'Rian Handler'
            // const title = 'Classic Stuffed Peppers'
            // const image = 'https://hips.hearstapps.com/hmg-prod/images/delish-classic-stuffed-peppers-horizontal-1538065876.jpg'
            // const instructions = `['\nPreheat oven to 400°. In a small saucepan, prepare rice according to package instructions. In a large skillet over medium heat, heat oil. Cook onion until soft, about 5 minutes. Stir in tomato paste and garlic and cook until fragrant, about 1 minute more. Add ground beef and cook, breaking up meat with a wooden spoon, until no longer pink, 6 minutes. Drain fat.\n','\nReturn beef mixture to skillet, then stir in cooked rice and diced tomatoes. Season with oregano, salt, and pepper. Let simmer until liquid has reduced slightly, about 5 minutes.\n','\nPlace peppers cut side-up in a 9"-x-13" baking dish and drizzle with oil. Spoon beef mixture into each pepper and top with Monterey jack, then cover baking dish with foil.\n','\nBake until peppers are tender, about 35 minutes. Uncover and bake until cheese is bubbly, 10 minutes more.\n','\nGarnish with parsley before serving.\n']`
            // const ingredients = `['\n1/2 c. uncooked rice\n', '\n2 tbsp. extra-virgin olive oil, plus more for drizzling\n','\n1 medium onion, chopped\n','\n2 tbsp. tomato paste\n','\n3 cloves garlic, minced\n','\n1 lb. ground beef\n','\n1 (14.5-oz.) can diced tomatoes\n','\n1 1/2 tsp. dried oregano\n','\nKosher salt\n','\nFreshly ground black pepper\n','\n6 bell peppers, tops and cores removed\n','\n1 c. shredded Monterey jack\n','\nFreshly chopped parsley, for garnish\n']`

            // let recipe = {
            //     author: author,
            //     title: title,
            //     image: image,
            //     instructions: instructions,
            //     ingredients: ingredients
            // }

            // if (!author || !instructions || !ingredients || !title || !image)
            //     reject('')

            // Resolve the promise
            // resolve({
            //     title: title,
            //     // result: result,
            //     images: images,
            //     ingredients: ingredients
            // })
        })
    }
}