import Formulation from '../models/formulation-model.js';


const createFormulation = async (req, res) => {
    const {
        code, name, description, animal_group, owner
    } = req.body;
    try {
        const newFormulation = await Formulation.create({
            code, name, description, animal_group, collaborators: [{ userId: owner, access: 'owner' }],
        });
        const filteredFormulation = {
            "_id": newFormulation._id,
            "code": code,
            "name": name,
            "description": description ? description : "",
            "animal_group": animal_group ? animal_group : "",
        }
        res.status(200).json({ message: 'success', formulations: filteredFormulation });
    } catch (err) {
        res.status(500).json({ error: err.message, message: 'error' })
    }
};


const getAllFormulations = async (req, res) => {
    const { collaboratorId } = req.params;
    const { skip=0, limit=8 } = req.query;

    try {
        // only show formulations where the user is part of the collaborators
        const formulations = await Formulation.find({'collaborators.userId': collaboratorId}).select('code name description animal_group collaborators createdAt');
        // aside from the basic details, return the access level of the user
        const filteredFormulations = formulations.map(formulation => {
            const access = formulation.collaborators.find(c => c.userId.toString() === collaboratorId)?.access;
            return {
                "_id": formulation._id,
                "code": formulation.code,
                "name": formulation.name,
                "description": formulation.description ? formulation.description : "",
                "animal_group": formulation.animal_group ? formulation.animal_group : "",
                "access": access,
                "createdAt": formulation.createdAt
            }
        })

        // pagination
        const totalCount = filteredFormulations.length;
        const paginatedFormulations = filteredFormulations.slice(skip, skip + limit);

        res.status(200).json({
            message: 'success',
            formulations: paginatedFormulations,
            pagination: {
                totalSize: totalCount,
                totalPages: Math.ceil(totalCount / limit),
                pageSize: paginatedFormulations.length,
                page: Math.floor(skip / limit) + 1,
            }
        });
    } catch (err) {
        res.status(500).json({ error: err.message, message: 'error' })
    }
};


const getFormulation = async (req, res) => {
    const { id } = req.params;
    try {
        const formulation = await Formulation.findById(id);
        if (!formulation) {
            return res.status(404).json({ message: 'Formulation not found' });
        }
        res.status(200).json({ message: 'success', formulations: formulation });
    } catch (err) {
        res.status(500).json({ error: err.message, message: 'error' })
    }
};

const getFormulationByName = async (req, res) => {
    const { searchQuery, skip=0, limit=10 } = req.query;
    const { userId } = req.params;
    try {
        const formulations = await Formulation.find({'collaborators.userId': userId})
        if (!formulations) {
            return res.status(404).json({ message: 'No formulations', fetched: [] });
        }
        // partial matching
        const filteredFormulations = formulations.filter(item => item.name.toLowerCase().includes(searchQuery.toLowerCase()));

        const formattedFormulations = filteredFormulations.map(formulation => {
            const access = formulation.collaborators.find(c => c.userId.toString() === userId)?.access;
            return {
                "_id": formulation._id,
                "code": formulation.code,
                "name": formulation.name,
                "description": formulation.description ? formulation.description : "",
                "animal_group": formulation.animal_group ? formulation.animal_group : "",
                "access": access,
                "createdAt": formulation.createdAt
            }
        })

        // pagination
        const totalCount = formattedFormulations.length;
        const paginatedFormulations = formattedFormulations.slice(skip, skip + limit);

        res.status(200).json({
            message: 'success',
            fetched: paginatedFormulations,
            pagination: {
                totalSize: totalCount,
                totalPages: Math.ceil(totalCount / limit),
                pageSize: paginatedFormulations.length,
                page: Math.floor(skip / limit) + 1,
            }
        });
    } catch (err) {
        res.status(500).json({ error: err.message, message: 'error' })
    }
}


const updateFormulation = async (req, res) => {
    const { id } = req.params;
    const { code, name, description, animal_group, cost, ingredients, nutrients } = req.body;
    try {
        const formulation = await Formulation.findByIdAndUpdate(
          id,
          {
              $set:
                {
                    code, name, description, animal_group, cost, ingredients, nutrients
                }
          },
          { new: true },
        );
        if (!formulation) {
            return res.status(404).json({ message: 'error' });
        }
        const filteredFormulation = {
            "_id": formulation._id,
            "code": code,
            "name": name,
            "description": description ? description : "",
            "animal_group": animal_group ? animal_group : "",
            "cost": cost,
            "ingredients": ingredients ? ingredients : [],
            "nutrients": nutrients ? nutrients : [],
        }
        res.status(200).json({ message: 'success', formulations: filteredFormulation });
    } catch (err) {
        res.status(500).json({ error: err.message, message: 'error' })
    }
};


const deleteFormulation = async (req, res) => {
    const { id } = req.params;
    try {
        const formulation = await Formulation.findByIdAndDelete(id);
        if (!formulation) {
            return res.status(404).json({ message: 'error' });
        }
        res.status(200).json({ message: 'success' });
    } catch (err) {
        res.status(500).json({ error: err.message, message: 'error' })
    }
};

const getFormulationOwner = async (req, res) => {
    const { id } = req.params;
    try {
        const formulation = await Formulation.findById(id);
        const owner = formulation.collaborators.filter(item => item.access === 'owner');
        if (owner.length === 0) {
            return res.status(404).json({ message: 'error' });
        }
        res.status(200).json({ message: 'success', owner: owner[0].userId });
    } catch (err) {
        res.status(500).json({ error: err.message, message: 'error' })
    }
}

const addIngredients = async (req, res) => {
    const { id } = req.params;
    const { ingredients } = req.body;

    try {
        const formulation = await Formulation.findByIdAndUpdate(
          id,
          {
              $push:
                {
                    ingredients: { $each: ingredients },
                }
          },
          { new: true },
        );
        if (!formulation) {
            return res.status(404).json({ message: 'error' });
        }
        res.status(200).json({ message: 'success', addedIngredients: ingredients });
    } catch (err) {
        res.status(500).json({ error: err.message, message: 'error' })
    }
}

const addNutrients = async (req, res) => {
    const { id } = req.params;
    const { nutrients } = req.body;

    try {
        const formulation = await Formulation.findByIdAndUpdate(
          id,
          {
              $push:
                {
                    nutrients: { $each: nutrients },
                }
          },
          { new: true },
        );
        if (!formulation) {
            return res.status(404).json({ message: 'error' });
        }
        res.status(200).json({ message: 'success', addedNutrients: nutrients });
    } catch (err) {
        res.status(500).json({ error: err.message, message: 'error' })
    }
}

const removeIngredient = async (req, res) => {
    const { id, ingredient_id } = req.params;
    try {
        const formulation = await Formulation.findByIdAndUpdate(
          id,
          {
              $pull:
                {
                    ingredients: { ingredient_id: ingredient_id },
                }
          },
          { new: true },
        );
        if (!formulation) {
            return res.status(404).json({ message: 'error' });
        }
        res.status(200).json({ message: 'success' });
    } catch (err) {
        res.status(500).json({ error: err.message, message: 'error' })
    }
}

const removeNutrient = async (req, res) => {
    const { id, nutrient_id } = req.params;

    try {
        const formulation = await Formulation.findByIdAndUpdate(
          id,
          {
              $pull:
                {
                    nutrients: { nutrient_id: nutrient_id },
                }
          },
          { new: true },
        );
        if (!formulation) {
            return res.status(404).json({ message: 'error' });
        }
        res.status(200).json({ message: 'success' });
    } catch (err) {
        res.status(500).json({ error: err.message, message: 'error' })
    }
}

const validateCollaborator = async (req, res) => {
    const { formulationId, collaboratorId } = req.params;
    try {
        const formulation = await Formulation.findById(formulationId);
        if (!formulation) {
            return res.status(404).json({ message: 'error' });
        }
        // check the list of collaborators under the Formulation and see the user's access level
        const collaborator = formulation.collaborators.find(c => c.userId.toString() === collaboratorId);
        if (!collaborator) {
            return res.status(200).json({ message: 'success', access: 'notFound' });
        }
        res.status(200).json({ message: 'success', access: collaborator.access });
    } catch (err) {
        res.status(500).json({ error: err.message, message: 'error' })
    }
};


const updateCollaborator = async (req,res) => {
    const { id } = req.params;
    const { updaterId, collaboratorId, access } = req.body;
    // there should only be one owner
    if (access === 'owner') return res.status(400).json({ message: 'error' })
    try {
        const formulation = await Formulation.findById(id);
        if (!formulation) {
            return res.status(404).json({ message: 'error' });
        };
        // owner is the only one who can update
        const updater = formulation.collaborators.find(c => c.userId.toString() === updaterId);
        if (updater.access !== 'owner') {
            return res.status(401).json({ message: 'error' });
        }
        const collaborator = formulation.collaborators.find(c => c.userId.toString() === collaboratorId);
        if (!collaborator) {
            formulation.collaborators.push({ userId: collaboratorId, access: access });
            await formulation.save();
            return res.status(200).json({ message: 'success' });
        }
        if (collaborator.access === access) {
            return res.status(200).json({ message: 'success' });
        }
        collaborator.access = access;
        await formulation.save();
        res.status(200).json({ message: 'success' });
    } catch (err) {
        res.status(500).json({ error: err.message, message: 'error' })
    }
};

const removeCollaborator = async (req,res) => {
    const { formulationId, collaboratorId } = req.params;
    try {
        const formulation = await Formulation.findById(formulationId);
        if (!formulation) {
            return res.status(404).json({ message: 'error' });
        }
        // owner cannot be removed
        const toRemoveisOwner = formulation.collaborators.find(
          c => c.userId.toString() === collaboratorId && c.access === 'owner'
        );
        if (toRemoveisOwner) {
            return res.status(403).json({
                message: 'error',
            });
        }

        // remove the collaborator
        const updatedFormulation = await Formulation.findByIdAndUpdate(
          formulationId,
          {
              $pull: {
                  collaborators: { userId: collaboratorId }
              }
          },
          { new: true }
        );

        if (!updatedFormulation) {
            return res.status(404).json({ message: 'error' });
        }

        res.status(200).json({
            message: 'success',
            formulation: updatedFormulation
        });


    } catch (err) {
        res.status(500).json({ error: err.message, message: 'error' })
    }
}



export {
    createFormulation,
    getAllFormulations,
    getFormulation,
    getFormulationByName,
    updateFormulation,
    deleteFormulation,
    getFormulationOwner,
    addIngredients,
    addNutrients,
    removeIngredient,
    removeNutrient,
    validateCollaborator,
    updateCollaborator,
    removeCollaborator
};