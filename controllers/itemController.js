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
    const newItem = new Item({
        name: req.body.name,
        description: req.body.description,
        quantity: req.body.quantity,
        location: req.body.location,
    });

    try {
        const savedItem = await newItem.save();
        res.status(201).json(savedItem);
    } catch (err) {
        res.status(400).json({message: err.message});
    }
};

module.exports = { getItems, createItem};