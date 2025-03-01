import { Schema, model } from 'mongoose';

const ingredientConstraintSchema = new Schema({
    ingredientId: { type: Schema.Types.ObjectId, ref: 'Ingredient' },
    name: { type: String },
    min: { type: Number },
    max: { type: Number },
    value: { type: Number },
});

const nutrientConstraintSchema = new Schema({
    nutrientId: { type: Schema.Types.ObjectId, ref: 'Nutrient' },
    name: { type: String },
    min: { type: Number },
    max: { type: Number },
    value: { type: Number },
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
