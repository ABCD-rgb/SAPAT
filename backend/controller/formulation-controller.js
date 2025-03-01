import Formulation from '../models/formulation-model.js';


const createFormulation = async (req, res) => {
    const {
        ownerId, code, name, description, animal_group
    } = req.body;
    try {
        const newFormulation = await Formulation.create({
            code, name, description, animal_group, collaborators: [{ userId: ownerId, access: 'owner' }],
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
    try {
        const formulations = await Formulation.find().select('code name description animal_group');
        res.status(200).json({ message: 'success', formulations: formulations });
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


const updateFormulation = async (req, res) => {
    const { id } = req.params;
    const { code, name, description, animal_group } = req.body;
    try {
        const formulation = await Formulation.findByIdAndUpdate(
          id,
          {
              $set:
                {
                    code, name, description, animal_group
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



export {
    createFormulation,
    getAllFormulations,
    getFormulation,
    updateFormulation,
    deleteFormulation,
    validateCollaborator,
    updateCollaborator
};