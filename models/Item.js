const pool = require('../config/db').pool;

// Create Item
const createItem = async (itemData) => {
    const { name, price, numberInStock, category, sku } = itemData;
    const query = `INSERT INTO items (name, price, numberInStock, category, sku) VALUES ($1, $2, $3, $4, $5) RETURNING *`;
    const values = [name, price, numberInStock, category, sku];
    const result = await pool.query(query, values);
    return result.rows[0];
};

// Get ALL Items
const getAllItems = async () => {
    const result = await pool.query('SELECT * FROM items');
    return result.rows;
};

// Get item by ID
const getItemById = async (id) => {
    const result = await pool.query('SELECT * FROM items WHERE id = $1', [id]);
    return result.rows[0];
}

// Update Item
const updateItem = async (id, itemData) => {
    const { name, price, numberInStock, category, sku } = itemData;
    const query = `UPDATE items
                    SET name=$1, price=$2, numberInStock=$3, category=$4, sku=$5
                    WHERE id=$6 RETURNING *`;
    const values = [name, price, numberInStock, category, sku, id];
    const result = await pool.query(query, values);
    return result.rows[0];
};

// Delete Item
const deleteItem = async (id) => {
    const query = 'DELETE FROM items WHERE id=$1 RETURNING *';
    const values = [id];
    const result = await pool.query(query, values);
    return result.rows[0];
};

module.exports = { createItem, getAllItems, getItemById, updateItem, deleteItem};