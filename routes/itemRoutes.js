const express = require('express');
const router = express.Router();
const { getItems, createItem, updateItem, deleteItem, getItemByID} = require('../controllers/itemController');

// GET al; items
router.get('/', getItems);

// Get item by ID
router.get('/:id', getItemByID);

//POST a new item
router.post('/', createItem);

// Update an item
router.put('/:id', updateItem);

// Delete an item
router.delete('/:id', deleteItem);

module.exports = router;