// Import mysql Module
import mysql from 'mysql2/promise'

// Import Sequelize
import { db } from './sequelize'

/**
 * This function initliases the mysql database
 * @returns 
 */
export function initiliazeDatabase() {

    return new Promise(async (resolve, reject) => {

        try {

            // Fetch Environment Variables
            const { DB_HOST, DB_PORT, DB_USER, DB_PASS, DB_NAME } = process.env

            // Test the connection
            await mysql.createConnection({
                host: DB_HOST,
                port: Number(DB_PORT),
                user: DB_USER,
                password: DB_PASS
            })
                .then(async (connection) => {

                    // Create Database if not exist
                    connection.query(`CREATE DATABASE IF NOT EXISTS \`${DB_NAME}\`;`)
                        .then((conn) => {

                            // Console the confirmation
                            process.stdout.write(`\n Database \t: Connection Initialization and Query execution is Completed! \n`)

                            // Authenticate the Sequilize and Initilize the ORM inside the application
                            db.authenticate()
                                .then((res: any) => {
                                    db.sync({ alter: true })
                                        .then((res) => {
                                            process.stdout.write(`\n Database \t: All the Models are Synced with the Database Tables! \n`)
                                        })
                                        .catch((error: any) => {
                                            process.stdout.write(`\n Database \t: Unable to sync the Database Tables! \n ${error} \n`)
                                        })
                                    process.stdout.write(`\n Database \t: Sequelize has been authenticated! \n`)
                                })
                                .catch((error: any) => {
                                    process.stdout.write(`\n Database \t: Unable to authenticate the Database with Sequelize! \n ${error} \n`)
                                })

                            // Resolve the promise
                            resolve({ connection: conn })
                        })
                        .catch((error) => {

                            // Console the output
                            process.stdout.write(`\n Database \t: Unable to create the Database! \n ${error} \n`)

                            // Reject the promise
                            reject({ error: `Unable to create the Database! \n ${error}` })
                        })
                })
                .catch((error) => {

                    // Console the output
                    process.stdout.write(`\n Database \t: Unable to connect to the Database! \n ${error} \n`)

                    // Reject the promise
                    reject({ error: `Unable to connect to the Database! \n ${error}` })
                })

        } catch (error) {

            // Reject the promise
            reject({ error: error })
        }
    })
}