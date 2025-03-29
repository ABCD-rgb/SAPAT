import { Schema, model } from 'mongoose';

const ingredientConstraintSchema = new Schema({
    ingredient_id: { type: Schema.Types.ObjectId, ref: 'Ingredient' },
    name: { type: String },
    minimum: { type: Number, default: 0 },
    maximum: { type: Number, default: 0 },
    value: { type: Number, default: 0 },
});

const nutrientConstraintSchema = new Schema({
    nutrient_id: { type: Schema.Types.ObjectId, ref: 'Nutrient' },
    name: { type: String },
    minimum: { type: Number, default: 0 },
    maximum: { type: Number, default: 0 },
    value: { type: Number, default:     0 },
})

const userAccessSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User' },
    access: { type: String, enum: ['view', 'edit', 'owner'] },
});

const formulationSchema = new Schema({
    code: { type: String, default: '' },
    name: { type: String, required: true },
    description: { type: String, default: '' },
    animal_group: { type: String, default: '' },
    ingredients: {
        type: [ingredientConstraintSchema],
        default: []
    },
    nutrients: {
        type: [nutrientConstraintSchema],
        default: []
    },
    collaborators: {
        type: [userAccessSchema],
        default: []
    },
    // TODO: include version control
    createdAt: {
        type: Date,
        default: Date.now
    }
});

export default model('Formulation', formulationSchema);
