// Sequelize Module
import { Model, DataTypes } from 'sequelize'

// Import Database Class
import { db } from '../../sequelize'

// Extend Sequelize Model Class
export class Auth extends Model { }

// Initiliase the Model
Auth.init({
    auth_id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false
    },
    token: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    user_id: {
        type: DataTypes.UUID,
        allowNull: false
    },
    last_login: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    },
    last_logout: {
        type: DataTypes.DATE,
        defaultValue: null,
        allowNull: true
    },
    created_date: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    },
    logged_in: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    },
    ip_address: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: true
    }
}, { sequelize: db, engine: 'InnoDB' })
