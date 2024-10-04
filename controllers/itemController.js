const Item = require('../models/Item');

// Create an item
exports.createItem = async (req, res) => {
    try {
        const newItem = await Item.createItem(req.body);
        res.status(201).json(newItem);
    } catch (error) {
        res.status(500).json({ error: error.message});
    }
};

// Get all items
exports.getItems = async (req, res) => {
    try {
        const items = await Item.getAllItems();
        res.json(items);
    } catch (error) {
        res.status(500).json({ error: error.message});
    }
};

// Get an item by ID
exports.getItemById = async (req, res) => {
    try {
        const itemId = req.params.id;
        const item = await Item.getItemById(itemId);
        if (item) {
            res.json(item);
        } else {
            res.status(404).json({ message: 'Item not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Update an item
exports.updateItem = async (req, res) => {
    try {
        const updatedItem = await Item.updateItem(req.params.id, req.body);
        res.json(updatedItem);
    } catch (error) {
        res.status(500).json({ error: error.message});
    }
};

// Delete an item
exports.deleteItem = async (req, res) => {
    try {
        const deletedItem = await Item.deleteItem(req.params.id);
        res.json(deletedItem);
    } catch (error) {
        res.status(500).json({ error: error.message});
    }
};