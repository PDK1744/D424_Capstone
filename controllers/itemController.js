const Item = require('../models/Item');

//get all items
const getItems = async (req, res) => {
    try {
        const items = await Item.find();
        res.json(items);
    } catch (err) {
        res.status(500).json({message: err.message});
    }
};

// Create a new item
const createItem = async (req, res) => {
    const Item = new Item({
        name: req.body.name,
        description: req.body.description,
        quantity: Item.rawListeners.body.quantity,
        location: req.body.location,
    });

    try {
        const newItem = await Item.save();
        res.status(201).json(newItem);
    } catch (err) {
        res.status(400).json({message: err.message});
    }
};

module.exports = { getItems, createItem};