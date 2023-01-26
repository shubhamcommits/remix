// Import Sequelize Module
import { Sequelize } from 'sequelize'

// Fetch Environment Variables
const { DB_HOST, DB_PORT, DB_USER, DB_PASS, DB_NAME, MAX_POOL, MIN_POOL } = process.env

// Initilize the Sequelize
export const db = new Sequelize(DB_NAME || '', DB_USER || '', DB_PASS || '', {
    dialect: 'mysql',
    host: DB_HOST,
    port: Number(DB_PORT),
    pool: {
        max: Number(MAX_POOL),
        min: Number(MIN_POOL),
        acquire: 30000,
        idle: 10000
    },
    logging: false,
    define: {
        timestamps: true
    }
})

