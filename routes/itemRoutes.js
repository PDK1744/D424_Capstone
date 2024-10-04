const express = require('express');
const router = express.Router();
const itemController = require('../controllers/itemController');

// GET al; items
router.get('/', itemController.getItems);

// Get item by ID
router.get('/:id', itemController.getItemById);

//POST a new item
router.post('/', itemController.createItem);

// Update an item
router.put('/:id', itemController.updateItem);

// Delete an item
router.delete('/:id', itemController.deleteItem);

module.exports = router;