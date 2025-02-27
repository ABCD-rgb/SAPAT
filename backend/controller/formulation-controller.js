import Formulation from '../models/formulation-model.js';


const createFormulation = async (req, res) => {
    const {
        ownerId, code, name, description, animal_group
    } = req.body;
    try {
        const newFormulation = await Formulation.create({
            code, name, description, animal_group, collaborators: [{ userId: ownerId, access: 'owner' }],
        });
        res.status(200).json({ message: 'success', formulations: newFormulation });
    } catch (err) {
        res.status(500).json({ error: err.message, message: 'Failed to create new formulation' })
    }
};


const getAllFormulations = async (req, res) => {
    try {
        const formulations = await Formulation.find();
        res.status(200).json({ message: 'success', formulations: formulations });
    } catch (err) {
        res.status(500).json({ error: err.message, message: 'Failed to get all formulations' })
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
        res.status(500).json({ error: err.message, message: 'Failed to get formulation' })
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
            return res.status(404).json({ message: 'Formulation not found' });
        }
        res.status(200).json({ message: 'success', formulations: formulation });
    } catch (err) {
        res.status(500).json({ error: err.message, message: 'Failed to update formulation' })
    }
};


const deleteFormulation = async (req, res) => {
    const { id } = req.params;
    try {
        const formulation = await Formulation.findByIdAndDelete(id);
        if (!formulation) {
            return res.status(404).json({ message: 'Formulation not found' });
        }
        res.status(200).json({ message: 'success' });
    } catch (err) {
        res.status(500).json({ error: err.message, message: 'Failed to delete formulation' })
    }
};


const validateCollaborator = async (req, res) => {
    const { formulationId, collaboratorId } = req.params;
    try {
        const formulation = await Formulation.findById(formulationId);
        if (!formulation) {
            return res.status(404).json({ message: 'Formulation not found' });
        }
        // check the list of collaborators under the Formulation and see the user's access level
        const collaborator = formulation.collaborators.find(c => c.userId.toString() === collaboratorId);
        if (!collaborator) {
            return res.status(200).json({ message: 'success', access: 'notFound' });
        }
        res.status(200).json({ message: 'success', access: collaborator.access });
    } catch (err) {
        res.status(500).json({ error: err.message, message: 'Failed to validate collaborator' })
    }
};


const updateCollaborator = async (req,res) => {
    const { id } = req.params;
    const { updaterId, collaboratorId, access } = req.body;
    // there should only be one owner
    if (access === 'owner') return res.status(400).json({ message: 'Unauthorized' })
    try {
        const formulation = await Formulation.findById(id);
        if (!formulation) {
            return res.status(404).json({ message: 'Formulation not found' });
        };
        // owner is the only one who can update
        const updater = formulation.collaborators.find(c => c.userId.toString() === updaterId);
        if (updater.access !== 'owner') {
            return res.status(401).json({ message: 'Unauthorized' });
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
        res.status(500).json({ error: err.message, message: 'Failed to update collaborator' })
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