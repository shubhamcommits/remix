// Sequelize Module
import { Model, DataTypes } from 'sequelize'

// Import Database Class
import { db } from '../../sequelize'

// Extend Sequelize Model Class
export class Remix extends Model {}

// Initiliase the Model
Remix.init({
    remix_id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false
    },
    ingredients: {
        type: DataTypes.TEXT,
        defaultValue: '[]'
    },
    instructions: {
        type: DataTypes.TEXT,
        defaultValue: '[]'
    },
    remix_type: {
        type: DataTypes.UUID,
        allowNull: true
    }
}, { sequelize: db })