const express = require('express');
const router = express.Router();
const { getItems, createItem } = require('../controllers/itemController');

// GET al items
router.get('/', getItems);

//POST a new item
router.post('/', createItem);

module.exports = router;