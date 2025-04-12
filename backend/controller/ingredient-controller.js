import Ingredient from '../models/ingredient-model.js';
import UserIngredientOverride from '../models/user_ingredient_override-model.js';
import Nutrient from '../models/nutrient-model.js';

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
  const { skip=0, limit=10 } = req.query;

  try {
    // user-created ingredients
    const userIngredients = await Ingredient.find({'user': userId});
    //  global ingredients (and overrides)
    const globalIngredients = await handleGetIngredientGlobalAndOverride(userId);
    const ingredients = [...globalIngredients, ...userIngredients];
    const formattedIngredients = ingredients.map((ingredient) => {
      const data = ingredient._doc || ingredient;
      return {
        ...data,
        price: Number(data.price).toFixed(2)
      };
    })

    // pagination
    const totalCount = formattedIngredients.length;
    const paginatedIngredients = formattedIngredients.slice(skip, skip + limit);

    res.status(200).json({
      message: 'success',
      ingredients: paginatedIngredients,
      pagination: {
        hasMore: (skip + limit) < totalCount,
        totalSize: totalCount,
        totalPages: Math.ceil(totalCount / limit),
        pageSize: paginatedIngredients.length,
        page: Math.floor(skip / limit) + 1,
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message, message: 'error' })
  }
};

const getIngredient = async (req, res) => {
  const { id, userId } = req.params;
  try {
    const ingredient = await Ingredient.findById(id);
    if (!ingredient) {
      return res.status(404).json({ message: 'Ingredient not found' });
    }
    if (ingredient.source === 'global') {
      const override = await UserIngredientOverride.find({ingredient_id: ingredient._id, user: userId});
      if (override.length !== 0) {
        return res.status(200).json({ message: 'success', ingredients: override[0] });
      }
    }
    res.status(200).json({ message: 'success', ingredients: ingredient });
  } catch (err) {
    res.status(500).json({ error: err.message, message: 'error' })
  }
}

const getIngredientsByName = async (req, res) => {
  const { searchQuery } = req.query;
  const { userId } = req.params;
  try {
    // user-created ingredients
    const userIngredients = await Ingredient.find({'user': userId});
    //  global ingredients (and overrides)
    const globalIngredients = await handleGetIngredientGlobalAndOverride(userId);
    const ingredients = [...globalIngredients, ...userIngredients];
    // partial matching
    const filteredIngredients = ingredients.filter(item => item.name.toLowerCase().includes(searchQuery.toLowerCase()));
    res.status(200).json({ message: 'success', fetched: filteredIngredients });
  } catch (err) {
    res.status(500).json({ error: err.message, message: 'error' })
  }
}

const updateIngredient = async (req, res) => {
  const { id, userId } = req.params;
  const { name, price, available, group, nutrients } = req.body;
  try {
    const ingredient = await Ingredient.findById(id);
    if (!ingredient) {
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

//
// const importIngredient = async (req, res) => {
//   const ingredientsData = req.body;  // Get the ingredients data from the request body
//   try {
//     // Validate that the incoming data is an array
//     if (!ingredientsData || !Array.isArray(ingredientsData)) {
//       return res.status(400).json({ message: "Invalid data format, expected an array of ingredients." });
//     }
//     // Validate that required fields are there
//     if (ingredientsData.some(item => !item.name || !item.price || !item.nutrients)) {
//       return res.status(400).json({ message: "Each ingredient must have a 'name' and 'quantity'." });
//     }
//
//     const newIngredients = await Ingredient.insertMany(ingredientsData);
//     res.status(200).json({ message: 'success', ingredients: newIngredients });
//   } catch (err) {
//     res.status(500).json({ error: err.message, message: 'error' });
//   }
// }

const importIngredient = async (req, res) => {
  const { userId } = req.params;
  const ingredientsData = req.body;

  try {
    // Validate that the incoming data is an array
    if (!ingredientsData || !Array.isArray(ingredientsData)) {
      return res.status(400).json({ message: "Invalid data format, expected an array of ingredients." });
    }

    // Validate that required fields are there
    if (ingredientsData.some(item => !item.name || !item.price || !item.nutrients)) {
      return res.status(400).json({ message: "Each ingredient must have a name, price, and nutrients." });
    }

    // Escape special regex characters
    const escapeRegex = (string) => {
      return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    };

    const newIngredientsData = await Promise.all(
      ingredientsData.map(async (ingredient) => {
        const existingIngredient = await Ingredient.findOne({
          $or: [
            { user: userId },
            { source: 'global' }
          ],
          name: { $regex: new RegExp('^' + escapeRegex(ingredient.name) + '$', 'i') }
        });

        return existingIngredient ? null : ingredient;
      })
    ).then(results => results.filter(result => result !== null));

    // Process all new ingredients and handle matching/creating nutrients
    const processedIngredients = await Promise.all(newIngredientsData.map(async (ingredient) => {

      // Escape special regex characters
      const escapeRegex = (string) => {
        return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      };

      // Process each nutrient in the ingredient
      const processedNutrients = await Promise.all(ingredient.nutrients.map(async (nutrientData) => {
        // Get the nutrient name from the nutrient field
        const nutrientName = nutrientData.nutrient.trim();

        // Escape special regex characters
        const escapeRegex = (string) => {
          return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        };

        const existingNutrient = await Nutrient.findOne({
          $or: [
            { user: userId },
            { source: 'global' }
          ],
          name: { $regex: new RegExp('^' + escapeRegex(nutrientName) + '$', 'i') }
        });

        let nutrientId;
        if (existingNutrient) {
          // Use existing nutrient's ID
          nutrientId = existingNutrient._id;
        } else {
          // Create a new nutrient
          const newNutrient = await Nutrient.create({
            name: nutrientName,
            abbreviation: nutrientName.substring(0, 3).toUpperCase(),
            unit: '',
            description: '',
            group: '',
            source: 'user',
            user: userId
          });

          // when nutrient is created, update all user ingredients to add that nutrient
          await handleIngredientChanges(newNutrient, userId);
          nutrientId = newNutrient._id;
        }

        // Return nutrient with ID and value
        return {
          nutrient: nutrientId,
          value: nutrientData.value
        };
      }));

      // Create the ingredient with processed nutrients
      return {
        name: ingredient.name,
        price: ingredient.price,
        available: ingredient.available || 1,
        group: '',
        source: ingredient.source || 'user',
        user: userId,
        nutrients: processedNutrients
      };
    }));

    // Insert all processed new ingredients
    const newIngredients = await Ingredient.insertMany(processedIngredients);

    res.status(200).json({
      message: 'success',
      ingredients: newIngredients,
      skippedIngredients: ingredientsData.length - newIngredients.length
    });
  } catch (err) {
    res.status(500).json({ error: err.message, message: 'error' });
  }
};


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

const handleIngredientChanges = async (nutrient, user_id) => {
  // <user-created ingredients>
  const userIngredients = await Ingredient.find({ 'user': user_id });
  await Promise.all(userIngredients.map(async userIngredient => {
    // insert the new nutrient to list of nutrients on each User Ingredient
    userIngredient.nutrients.push({ 'nutrient': nutrient._id, 'value': 0 });
    await userIngredient.save();
  }));

  // <global overrides ingredients>
  const globalIngredients = await Ingredient.find({ 'source': 'global' });
  await Promise.all(globalIngredients.map(async globalIngredient => {
    const override = await UserIngredientOverride.find({ 'ingredient_id': globalIngredient._id, 'user': user_id });
    // no existing override
    if (override.length === 0) {
      await UserIngredientOverride.create({
        ingredient_id: globalIngredient._id,
        user: user_id,
        nutrients: [
          ...globalIngredient.nutrients,
          { 'nutrient': nutrient._id, 'value': 0 }
        ],
        // Copy other relevant fields from globalIngredient
        name: globalIngredient.name,
        price: globalIngredient.price,
        available: globalIngredient.available,
        source: globalIngredient.source
      });
    }
    // has an existing override (and not deleted as well)
    else if (override[0].deleted !== 1) {
      override[0].nutrients.push({ 'nutrient': nutrient._id, 'value': 0 });
      await override[0].save();
    }
  }));
}


export {
  createIngredient,
  getAllIngredients,
  getIngredient,
  getIngredientsByName,
  updateIngredient,
  deleteIngredient,
  importIngredient,
};