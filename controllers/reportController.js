const pool = require('../config/db').pool;

// Get total items in stock by category
const getItemsInStockByCategory = async (req, res) => {
    try {
        const query = `SELECT category, SUM(numberInStock) AS totalStock
                       FROM items
                       GROUP BY category`;
        const result = await pool.query(query);
        res.json(result.rows);
    } catch (error) {
        console.error('Error generating report:', error);
        res.status(500).json({ error: 'Failed to generate report' });
    }
};

// Get items low on stock (based on threshold input from user)
const getItemsLowOnStock = async (req, res) => {
    const { threshold } = req.body;
    try {
        const query = `SELECT * FROM items WHERE numberInStock <= $1`;
        const values = [threshold];
        const result = await pool.query(query, values);
        res.json(result.rows);
    } catch (error) {
        console.error('Error generating report:', error);
        res.status(500).json({ error: 'Failed to generate report' });
    }
};

module.exports = { getItemsInStockByCategory, getItemsLowOnStock };
