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
    recipe_raw: {
        type: DataTypes.JSON,
        defaultValue: '',
        allowNull: true,
    },
    user_id: {
        type: DataTypes.UUID,
        allowNull: true
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
        type: DataTypes.JSON,
        defaultValue: []
    },
    instructions: {
        type: DataTypes.JSON,
        defaultValue: []
    },
    like_count: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        allowNull: false
    }
}, { sequelize: db, engine: 'InnoDB' })