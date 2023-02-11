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
                        resolve(data)
                    })
                    .catch((error: any) => {

                        // Reject the Promise
                        reject({
                            message: 'Unable to create the new user, please try again!',
                            stack: error
                        })
                    })

            } catch (error) {
                reject({ error: error })
            }
        })
    }

    /**
     * This function fetches all the users present in the system
     * @returns 
     */
    async fetchAllUsers() {
        return new Promise(async (resolve, reject) => {
            try {

                // Fetch the list of remix types
                User.findAll({ 
                    raw: true,
                    attributes: ['user_id', 'active', 'name', 'email'] 
                })
                    .then((data: any) => {

                        // Resolve the Promise
                        resolve(data)
                    })
                    .catch((error: any) => {

                        // Reject the Promise
                        reject({ message: 'Unable to fetch the Users list, please try again!', stack: error })
                    })

            } catch (error) {
                reject({ error: error })
            }
        })
    }

}