// Sequelize Module
import { Model, DataTypes } from 'sequelize'

// Import Database Class
import { db } from '../../sequelize'

// Extend Sequelize Model Class
export class RemixType extends Model {}

// Initiliase the Model
RemixType.init({
    remix_type_id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false
    },
    name: {
        type: DataTypes.STRING,
        unique: true,
        defaultValue: 'New Remix Type',
        allowNull: false
    },
    prompt: {
        type: DataTypes.STRING,
        defaultValue: 'New Prompt Type',
        allowNull: false
    }
}, { sequelize: db, engine: 'InnoDB' })