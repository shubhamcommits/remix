// Import openai Module
import { Configuration, OpenAIApi } from 'openai'

// Export OpenAI Class
export class OpenAI {

    constructor() { }

    /**
     * This function initialiases the OpenAI Module
     * @returns 
     */
    private initOpenAI() {
        const configuration = new Configuration({
            apiKey: process.env.OPEN_AI_SECRET_KEY
        })

        return new OpenAIApi(configuration)
    }

    /**
     * This function calls the Open AI Create Completion on the basis of the prompt provided
     * @param prompt 
     * @returns 
     */
    async generateRecipe(prompt: String) {
        return new Promise((resolve, reject) => {
            this.initOpenAI()
            .createCompletion({
                model: process.env.OPEN_AI_ADA_MODEL || '',
                prompt: `${prompt}`,
                temperature: 0.7,
                max_tokens: 2000,
                top_p: 1,
                frequency_penalty: 0,
                presence_penalty: 0
            })
                .then((data) => {
                    resolve(({ data: data }))
                })
                .catch((error) => {
                    reject({ error: error })
                })
        })
    }

    /**
     * This function calls the Open AI Create Completion on the basis of the prompt provided
     * @param prompt 
     * @returns 
     */
    async generateRemixRecipe(prompt: String) {
        return new Promise((resolve, reject) => {
            this.initOpenAI()
            .createCompletion({
                model: process.env.OPEN_AI_DAVINCI_MODEL || '',
                prompt: `${prompt}`,
                temperature: 0.7,
                max_tokens: 3000,
                top_p: 1,
                frequency_penalty: 0,
                presence_penalty: 0
            })
                .then((data) => {
                    resolve(({ data: data }))
                })
                .catch((error) => {
                    reject({ error: error })
                })
        })
    }

}