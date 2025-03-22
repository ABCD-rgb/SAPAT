import Nutrient from '../models/nutrient-model.js';
import UserNutrientOverride from '../models/user_nutrient_override-model.js';
import Ingredient from '../models/ingredient-model.js';
import UserIngredientOverride from '../models/user_ingredient_override-model.js';

const createNutrient = async (req, res) => {
  const { abbreviation, name, unit, description, group, source, user  } = req.body;
  try {
    const newNutrient = await Nutrient.create({
      abbreviation, name, unit, description, group, source, user
    });
    // when nutrient is created, update all user ingredients to add that nutrient
    await handleIngredientChanges('add', newNutrient, user);
    res.status(200).json({ message: 'success', nutrients: newNutrient });
  } catch (err) {
    res.status(500).json({ error: err.message, message: 'error' });
  }
}

const getAllNutrients = async (req, res) => {
  const { userId } = req.params;
  try {
    // user-created nutrients
    const userNutrients = await Nutrient.find({'user': userId});
    // global nutrients and overrides
    const globalNutrients = await handleGetNutrientGlobalAndOverride(userId);
    const nutrients = [...userNutrients, ...globalNutrients];
    res.status(200).json({ message: 'success', nutrients: nutrients });
  } catch (err) {
    res.status(500).json({ error: err.message, message: 'error' });
  }
}

const getNutrient = async (req, res) => {
  const { id } = req.params;
  try {
    const nutrient = await Nutrient.findById(id);
    if (!nutrient) {
      return res.status(404).json({ message: 'nutrient not found' });
    }
    res.status(200).json({ message: 'success', nutrients: nutrient });
  } catch (err) {
    res.status(500).json({ error: err.message, message: 'error' });
  }
}

const updateNutrient = async (req, res) => {
  const { id, userId } = req.params;
  const { abbreviation, name, unit, description, group } = req.body;
  try {
    const nutrient = await Nutrient.findById(id);
    if (!nutrient && nutrient.user !== userId) {
      return res.status(404).json({ message: 'error' });
    }

    // user-created nutrient
    if (nutrient.source === 'user') {
      if (abbreviation) nutrient.abbreviation = abbreviation;
      if (name) nutrient.name = name;
      if (unit) nutrient.unit = unit;
      if (description) nutrient.description = description;
      if (group) nutrient.group = group;
    }
    // global-created nutrient
    else {
      // revisions on the userNutrientOverride
      const updatedNutrient = await handleUpdateNutrientOverride(nutrient, abbreviation, name, unit, description, group, id, userId);
      res.status(200).json({ message: 'success', nutrients: updatedNutrient });
    }
  } catch (err) {
    res.status(500).json({ error: err.message, message: 'error' });
  }
}

const deleteNutrient = async (req, res) => {
  const { id, userId } = req.params;
  try {
    const nutrient = await Nutrient.findById(id);
    if (!nutrient) {
      return res.status(404).json({ message: 'error' });
    }

    // user-created nutrient
    if (nutrient.source === 'user') {
      const nutrient = await Nutrient.findByIdAndDelete(id);
    }
    // global-created nutrient
    else {
      await handleDeleteNutrientOverride(id, userId);
    }
    // TODO: when nutrient is deleted, update all user ingredients to remove that nutrient
    await handleIngredientChanges('remove', nutrient, userId);
    res.status(200).json({ message: 'success' });
  } catch (err) {
    res.status(500).json({ error: err.message, message: 'error' });
  }
}


const handleGetNutrientGlobalAndOverride = async (userId) => {
  try {
    const globalNutrients = await Nutrient.find({ 'source': "global" });
    const allNutrients = await Promise.all(globalNutrients.map(async nutrient => {
      const override = await UserNutrientOverride.find({ 'nutrient_id': nutrient._id, 'user': userId });
      // there are no overrides
      if (override.length === 0) {
        return nutrient;
      }
      // there is an override that is not deleted
      if (override[0].deleted !== 1) {
        return override[0];
      }
      // there is an override that is deleted
      return undefined;
    }))
    return allNutrients.filter(item => item !== undefined);
  } catch (err) {
    console.log(err);
  }
}

const handleUpdateNutrientOverride = async (globalNutrient, abbreviation, name, unit, description, group, nutrient_id, user_id) => {
  try {
    const nutrient = await UserNutrientOverride.find({ 'nutrient_id': nutrient_id, 'user': user_id });
    // there is no override yet
    if (nutrient.length === 0) {
      const updatedNutrient = {
        ...globalNutrient,
        abbreviation: abbreviation ?? globalNutrient.abbreviation,
        name: name ?? globalNutrient.name,
        unit: unit ?? globalNutrient.unit,
        description: description ?? globalNutrient.description,
        group: group ?? globalNutrient.group,
      }
      const nutrientOverride = await UserNutrientOverride.create({
        ...updatedNutrient,
        nutrient_id,
        user: user_id,
      })
      return nutrientOverride;
    }
    // there is an existing override
    else {
      if (nutrient_id) nutrient[0].nutrient_id = nutrient_id;
      if (name) nutrient[0].name = name;
      if (unit) nutrient[0].unit = unit;
      if (description) nutrient[0].description = description;
      if (group) nutrient[0].group = group;
      await nutrient[0].save();
      return nutrient[0];
    }
  } catch (err) {
    console.log(err);
  }
}

const handleDeleteNutrientOverride = async (nutrient_id, user_id) => {
  try {
    const nutrient = await UserNutrientOverride.find({ 'nutrient_id': nutrient_id, 'user': user_id });
    if (nutrient.length === 0) {
      await UserNutrientOverride.create({
        nutrient_id,
        "deleted": 1,
        "user": user_id,
      })
    } else {
      nutrient[0].deleted = 1;
      await nutrient[0].save();
    }
  } catch (err) {
    console.log(err);
  }
}

const handleIngredientChanges = async (type, nutrient, user_id) => {
  if (type === 'add') {
    // <user-created ingredients>
    const userIngredients = await Ingredient.find({ 'user': user_id });
    const updatedUserIngredients = await Promise.all(userIngredients.map(async userIngredient => {
      // insert the new nutrient to list of nutrients on each User Ingredient
      userIngredient.nutrients.push({ 'nutrient': nutrient._id, 'value': 0 });
      await userIngredient.save();
    }));
    // <global overrides ingredients>
    const globalIngredients = await Ingredient.find({ 'source': 'global' });
    const updatedGlobalIngredients = await Promise.all(globalIngredients.map(async globalIngredient => {

      const override = await UserIngredientOverride.find({ 'ingredient_id': globalIngredient._id, 'user': user_id });
      // no existing override
      if (override.length === 0) {
        const updatedIngredient = globalIngredient.toObject();  // convert Mongoose document to a plain Object
        updatedIngredient.nutrients.push({ 'nutrient': nutrient._id, 'value': 0 });
        const ingredientOverride = await UserIngredientOverride.create({
          ...updatedIngredient,
          ingredient_id: globalIngredient._id,
          user: user_id,
        })
      }
      // has an existing override (and not deleted as well)
      else if (override[0].deleted !== 1) {
        override[0].nutrients.push({ 'nutrient': nutrient._id, 'value': 0 });
        await override[0].save();
      }
    }));

  } else if (type === 'remove') {
    // <user-created ingredients>
    const userIngredients = await Ingredient.find({ user: user_id });
    const updatedUserIngredients = await Promise.all(userIngredients.map(async userIngredient => {
      // remove the nutrient to be deleted on all User Ingredients
      userIngredient.nutrients = userIngredient.nutrients.filter(item => String(item.nutrient) !== String(nutrient._id));
      await userIngredient.save();
    }))
    // <global overrides ingredients>
    const globalIngredients = await Ingredient.find({ 'source': 'global' });
    const updatedGlobalIngredients = await Promise.all(globalIngredients.map(async globalIngredient => {
      const override = await UserIngredientOverride.find({ 'ingredient_id': globalIngredient._id, 'user': user_id });
      // no existing override
      if (override.length === 0) {
        const updatedIngredient = globalIngredient.toObject();
        updatedIngredient.nutrients = updatedIngredient.nutrients.filter(item => String(item.nutrient) !== String(nutrient._id));
        const ingredientOverride = await UserIngredientOverride.create({
          ...updatedIngredient,
          ingredient_id: globalIngredient._id,
          user: user_id,
        })
      }
      // has an existing override (and not deleted as well)
      else if (override[0].deleted !== 1) {
        override[0].nutrients = override[0].nutrients.filter(item => String(item.nutrient) !== String(nutrient._id));
        await override[0].save();
      }
    }));
  }
}


export {
  createNutrient,
  getAllNutrients,
  getNutrient,
  updateNutrient,
  deleteNutrient,
};