// Import File Stream Module
import { Readable } from 'stream'

// Import Cluster Module
import cluster from 'cluster'

// DotEnv Module
import dotenv from 'dotenv'

// Fetch Number of CPU Cores 
import { cpus } from 'os'

// Apply Environments
if (process.env.NODE_ENV != 'production') {

    // Load the config from the .env file
    dotenv.config()

}

// Import Database Function
import { initiliazeDatabase } from './src/database'

// Express App
import app from './src/api/app'

// Cluster variable
const isClusterRequired = process.env.CLUSTER

/**
 * Setup number of worker processes to share port which will be defined while setting up server
 */
async function setupWorkerProcesses() {

    // Console the confirmation
    process.stdout.write(`\n Master cluster is setting up ` + cpus().length + ' workers \n')
    process.stdout.write(`\n Master PID: ${process.pid} is running \n`)

    // Fork workers
    Readable.from(cpus())
        .on('data', (cpu) => {
            process.stdout.write(`\n Message: ${cpu.model} is starting ... \n`)
            cluster.fork()
        })

    // Handle Message from Cluster
    cluster.on('message', function (message) {
        process.stdout.write(`\n Message: ${JSON.stringify(message)} \n`)
    })

    // Handle online
    cluster.on('online', (worker) => {
        process.stdout.write(`\n Worker ID: ${worker.id} and the PID: ${worker.process.pid} \n`)
    })

    // Handle on exit
    cluster.on('exit', (worker, code, signal) => {
        process.stdout.write(`\n Worker ID: ${worker.id} with PID: ${worker.process.pid} died with CODE: ${code} and SIGNAL: ${signal} \n`)
        process.stdout.write(`\n Forking another Worker \n`)
        cluster.fork()
    })

    // Handle on error
    cluster.on('error', (error) => {
        process.stdout.write(`\n Error: ${error} \n`)
    })

}

/**
 * Setup an express server and define port to listen all incoming requests for this application
 */
async function setUpExpressApplication() {

    await initiliazeDatabase()
        .then(() => {

            // HTTP Module
            const http = require('http')

             // Fetch Environment Variables
             const { PORT, HOST, NODE_ENV, APP_NAME } = process.env

            // Creating Microservice Server
            const server = http.createServer(app)

            // Exposing the server to the desired port
            server.listen(PORT, HOST, async () => {
                process.stdout.write(`\n Application \t: ${APP_NAME} is working!\n`)
                process.stdout.write(`\n ${APP_NAME} \t: http://${HOST}:${PORT}\n`)
                process.stdout.write(`\n Environment \t: ${NODE_ENV}\n`)
                process.stdout.write(`\n Process \t: ${process.pid} is listening to all incoming requests \n`)
            })

        })

        .catch((error) => {
            process.stdout.write(`\n Could not connect to database ${JSON.stringify(error)} \n`)
            process.exit(1)
        })

}


/**
 * Setup server either with clustering or without it
 * @param isClusterRequired
 * @constructor
 */

// If it is a master process then call setting up worker process
if (isClusterRequired == 'true' && cluster.isMaster) {

    setupWorkerProcesses()

} else {

    // To setup server configurations and share port address for incoming requests
    setUpExpressApplication()
}