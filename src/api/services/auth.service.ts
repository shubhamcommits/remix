// Import AuthenticationClient
import { AuthenticationClient } from 'auth0'

// Create Auth0 Client
const auth0 = new AuthenticationClient({
    domain: process.env.AUTH0_DOMAIN || '',
    clientId: process.env.AUTH0_CLIENT_ID || '',
    clientSecret: process.env.AUTH0_CLIENT_SECRET || ''
})

// Export Service Class
export class AuthService {

    /**
     * This function is responsible for calling the custom Http API
     * @param {*} url 
     * @returns 
     */
    async login(email: string, password: string) {
        return new Promise(async (resolve, reject) => {

            // Record the API response
            auth0.clientCredentialsGrant({
                scope: 'read:users',
                audience: `https://${process.env.AUTH0_DOMAIN }/api/v2`,
            })
                .then(async (response) => {

                    // Resolve the Promise
                    resolve(response)

                })
                .catch((error) => {

                    // Reject the error
                    reject(error)
                })
        })
    }

}