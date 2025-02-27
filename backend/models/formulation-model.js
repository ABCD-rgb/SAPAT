import { Schema, model } from 'mongoose';

const ingredientConstraintSchema = new Schema({
    ingredient: { type: Schema.Types.ObjectId, ref: 'Ingredient' },
    min: { type: Number },
    max: { type: Number },
    value: { type: Number },
});

const nutrientConstraintSchema = new Schema({
    nutrient: { type: Schema.Types.ObjectId, ref: 'Nutrient' },
    min: { type: Number },
    max: { type: Number },
    value: { type: Number },
})

const userAccessSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    access: { type: String, enum: ['view', 'edit', 'owner'] },
});

const formulationSchema = new Schema({
    code: { type: String },
    name: { type: String, required: true },
    description: { type: String },
    animal_group: { type: String },
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
