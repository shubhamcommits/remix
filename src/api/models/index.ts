// Import Recipe Model
import { Recipe } from './recipe.model'

// Import Remix Model
import { Remix } from './remix.model'

// Import Remix Type Model
import { RemixType } from './remix-type.model'

// Import User Model
import { User } from './user.model'

Recipe.belongsTo(User, {
    foreignKey: 'user_id',
    targetKey: 'user_id',
    onDelete: 'CASCADE',
})

Recipe.hasMany(Remix, {
    foreignKey: 'remixes'
})

Remix.belongsTo(RemixType, {
    foreignKey: 'remix_type',
    targetKey: 'remix_type_id',
    onDelete: 'CASCADE',
})

// Export Models
export { Recipe, Remix, RemixType, User }