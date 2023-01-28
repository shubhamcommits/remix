// Import Recipe Model
import { User } from '../models'

// Export Service Class
export class UserService {

    /**
     * This function is responsible for creating a new user
     * @param name 
     * @param prompt 
     * @returns 
     */
    async createUser(name: any, email: any) {
        return new Promise(async (resolve, reject) => {
            try {

                // Create the new User
                User.create({ name: name, email: email })
                    .then((data: any) => {

                        // Resolve the Promise
                        resolve({ data: data })
                    })
                    .catch((error: any) => {

                        // Reject the Promise
                        reject({
                            message: 'Unable to create the new user, please try again!',
                            astack: error
                        })
                    })

            } catch (error) {
                reject({ error: error })
            }
        })
    }

}