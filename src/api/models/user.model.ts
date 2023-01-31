// Sequelize Module
import { Model, DataTypes } from 'sequelize'

// Import Database Class
import { db } from '../../sequelize'

// Extend Sequelize Model Class
export class User extends Model { }

// Initiliase the Model
User.init({
    user_id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false
    },
    active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
        allowNull: false
    },
    name: {
        type: DataTypes.STRING,
        defaultValue: 'New User Name',
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        defaultValue: 'New User Email',
        unique: true,
        allowNull: false
    }
}, { sequelize: db, engine: 'InnoDB' })