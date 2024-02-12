const { Parent } = require('../models/modelsIndex');

// Get a parent's children information
const getChildrenInfo = async (req, res) => {
    const parent = await Parent.findById(req.params.parentId).populate('children');
    if (!parent) {
        return res.status(404).json({ message: 'Parent not found' });
    }
    res.status(200).json(parent.children);
};

module.exports = {
    getChildrenInfo,
};
