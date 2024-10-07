const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');
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

// Reports route for total items by category
router.get('/reports/in-stock-by-category', reportController.getItemsInStockByCategory);

// Report route for items low on stock
router.post('/reports/low-stock', reportController.getItemsLowOnStock);

module.exports = router;