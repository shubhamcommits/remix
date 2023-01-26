// Sequelize Module
import { Model, DataTypes, Sequelize } from 'sequelize';

// Import Database Class
import { db } from '../../sequelize'

// Extend Sequelize Model Class
export class Recipe extends Model {}

// Initiliase the Model
Recipe.init({
    recipe_id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false
    },
    user_id: {
        type: DataTypes.UUID,
        allowNull: false
    },
    title: {
        type: DataTypes.STRING,
        defaultValue: 'New Title',
        allowNull: false
    },
    image: {
        type: DataTypes.STRING,
        defaultValue: 'New Image',
        allowNull: false
    },
    original_author: {
        type: DataTypes.STRING,
        defaultValue: 'New Author',
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
    like_count: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        allowNull: false
    },
    remixes: {
        type: DataTypes.JSON,
        defaultValue: Sequelize.fn('JSON_ARRAY'),
        allowNull: true
    }
}, { sequelize: db })