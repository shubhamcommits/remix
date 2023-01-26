// Express Module
import express, { NextFunction, Request, Response } from 'express'

// Cors Module
import cors from 'cors'

// Morgan Module
import morgan from 'morgan'

// Compression Module
import compression from 'compression'

// Routes
import { recipeRoutes } from './routes'

// Define the express application
const app = express()

// Cors middleware for origin and Headers
app.use(cors())

// Allow any method from any host and log requests
app.use((req: Request, res: Response, next: NextFunction) => {
    res.header('Access-Control-Allow-Origin', '*')
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
    res.header('Access-Control-Allow-Methods', 'OPTIONS, GET, POST, PUT, DELETE, PATCH')
    if ('OPTIONS' === req.method) {
        res.sendStatus(200)
    } else {
        console.log(`\n${req.ip} ${req.method} ${req.url}\n`)
        next()
    }
})

// Adding The 'body-parser' middleware only handles JSON and urlencoded data
app.use(express.json())

// Use Morgan middleware for logging every request status on console
app.use(morgan('dev'))

// Default Route
app.get('/', (req: Request, res: Response, next: NextFunction) => {
    res.status(200).json({ message: `${process.env.APP_NAME} is working!` })
})

// Correct REST naming
app.use('/api/v1/recipes', recipeRoutes)

// Invalid routes handling middleware
app.all('*', (req: Request, res: Response, next: NextFunction) => {
    
    // Send Status 404 response
    res.status(404).json({
        message: 'Not found, check your URL please!'
    })
})

// Error handling middleware
app.use((error: any, req: Request, res: Response, next: NextFunction) => {
    res.status(error.status || 500)
    res.json({
        error: {
            message: JSON.stringify(error)
        }
    })
})

// Compressing the application
app.use(compression())

// Export the application
export default app 