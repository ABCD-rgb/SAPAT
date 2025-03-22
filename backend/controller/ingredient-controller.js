import Ingredient from '../models/ingredient-model.js';
import UserIngredientOverride from '../models/user_ingredient_override-model.js';

const createIngredient = async (req, res) => {
  const {
      name, price, available, group, source, nutrients, user,
  } = req.body;

  try {
    const newIngredient = await Ingredient.create({
      name, price, available, group, source, nutrients, user
    });
    res.status(200).json({ message: 'success', ingredients: newIngredient });
  } catch (err) {
    res.status(500).json({ error: err.message, message: 'error' })
  }
};

const getAllIngredients = async (req, res) => {
  const { userId } = req.params;
  try {
    // user-created ingredients
    const userIngredients = await Ingredient.find({'user': userId});
    //  global ingredients (and overrides)
    const globalIngredients = await handleGetIngredientGlobalAndOverride(userId);
    const ingredients = [...userIngredients, ...globalIngredients];
    res.status(200).json({ message: 'success', ingredients: ingredients });
  } catch (err) {
    res.status(500).json({ error: err.message, message: 'error' })
  }
};

const getIngredient = async (req, res) => {
  const { id } = req.params;
  try {
    const ingredient = await Ingredient.findById(id);
    if (!ingredient) {
      return res.status(404).json({ message: 'Ingredient not found' });
    }
    res.status(200).json({ message: 'success', ingredients: ingredient });
  } catch (err) {
    res.status(500).json({ error: err.message, message: 'error' })
  }
}

const updateIngredient = async (req, res) => {
  const { id, userId } = req.params;
  const { name, price, available, group, nutrients } = req.body;
  try {
    const ingredient = await Ingredient.findById(id);
    if (!ingredient && ingredient.user !== userId) {
      return res.status(404).json({ message: 'error' });
    }

    // user-created ingredient
    if (ingredient.source === 'user') {
      if (name) ingredient.name = name;
      if (price) ingredient.price = price;
      if (available) ingredient.available = available;
      if (group) ingredient.group = group;
      if (nutrients) ingredient.nutrients = nutrients;
      const updatedIngredient = await ingredient.save();
      res.status(200).json({ message: 'success', ingredients: updatedIngredient });
    }
    // global-created ingredient
    else {
      // revisions on the userIngredientOverride
      const updatedIngredient = await handleUpdateIngredientOverride(ingredient, name, price, available, group, nutrients, id, userId);
      res.status(200).json({ message: 'success', ingredients: updatedIngredient });
    }
  } catch (err) {
    res.status(500).json({ error: err.message, message: 'error' })
  }
};

const deleteIngredient = async (req, res) => {
  const { id, userId } = req.params;
  try {
    const ingredient = await Ingredient.findById(id);
    if (!ingredient) {
      return res.status(404).json({ message: 'error' });
    }

    // user-created ingredient
    if (ingredient.source === 'user') {
      const ingredient = await Ingredient.findByIdAndDelete(id);
    }
    // global-created ingredient
    else {
      // revisions on the userIngredientOverride
      await handleDeleteIngredientOverride(id, userId);
    }
    res.status(200).json({ message: 'success' });
  } catch (err) {
    res.status(500).json({ error: err.message, message: 'error' })
  }
};



const importIngredient = async (req, res) => {
  const ingredientsData = req.body;  // Get the ingredients data from the request body
  try {
    // Validate that the incoming data is an array
    if (!ingredientsData || !Array.isArray(ingredientsData)) {
      return res.status(400).json({ message: "Invalid data format, expected an array of ingredients." });
    }
    // Validate that required fields are there
    if (ingredientsData.some(item => !item.name || !item.price || !item.nutrients)) {
      return res.status(400).json({ message: "Each ingredient must have a 'name' and 'quantity'." });
    }

    const newIngredients = await Ingredient.insertMany(ingredientsData);
    res.status(200).json({ message: 'success', ingredients: newIngredients });
  } catch (err) {
    res.status(500).json({ error: err.message, message: 'error' });
  }
}


// helpers
const handleGetIngredientGlobalAndOverride = async (userId) => {
  try {
    const globalIngredients = await Ingredient.find({ 'source': "global" });
    const allIngredients = await Promise.all(globalIngredients.map(async ingredient => {
      const override = await UserIngredientOverride.find({'ingredient_id': ingredient._id, 'user': userId});
      // there are no overrides
      if (override.length === 0) {
        return ingredient;
      }
      // there is an override that is not deleted
      if (override[0].deleted !== 1) {
        return override[0]; // assuming that each global ingredient has at most one override
      }
      // there is an override that is deleted
      return undefined;
    }))
    return allIngredients.filter(item => item !== undefined);
  } catch (err) {
    console.log(err);
  }
}

const handleUpdateIngredientOverride = async (globalIngredient, name, price, available, group, nutrients, ingredient_id, user_id) => {
  try {
    const ingredient = await UserIngredientOverride.find({ 'ingredient_id': ingredient_id, "user": user_id });
    // there is no override yet
    if (ingredient.length === 0) {
      const updatedIngredient = {
        ...globalIngredient,
        name: name ?? globalIngredient.name,
        price: price ?? globalIngredient.price,
        available: available ?? globalIngredient.available,
        group: group ?? globalIngredient.group,
        nutrients: nutrients ?? globalIngredient.nutrients,
      }
      const ingredientOverride = await UserIngredientOverride.create({
        ...updatedIngredient,
        ingredient_id,
        user: user_id
      });
      return ingredientOverride;
    }
    // there is an existing override
    else {
      if (ingredient_id) ingredient[0].ingredient_id = ingredient_id;
      if (name) ingredient[0].name = name;
      if (price) ingredient[0].price = price;
      if (available) ingredient[0].available = available;
      if (group) ingredient[0].group = group;
      if (nutrients) ingredient[0].nutrients = nutrients;
      await ingredient[0].save();
      return ingredient[0];
    }
  } catch (err) {
    console.log(err);
  }
};


const handleDeleteIngredientOverride = async (ingredient_id, user_id) => {
  try {
    const ingredient = await UserIngredientOverride.find({ 'ingredient_id': ingredient_id, 'user': user_id });
    if (ingredient.length === 0) {
      await UserIngredientOverride.create({
        ingredient_id,
        "deleted": 1,
        "user": user_id,
      });
    } else {
      ingredient[0].deleted = 1;
      await ingredient[0].save();
    }
  } catch (err) {
    console.log(err);
  }
}


export {
  createIngredient,
  getAllIngredients,
  getIngredient,
  updateIngredient,
  deleteIngredient,
  importIngredient,
};