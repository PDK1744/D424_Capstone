const express = require('express');
const dotenv = require('dotenv');
const { connectDB } = require('./config/db');
const itemRoutes = require('./routes/itemRoutes');

// Load env variables
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Middleware
app.use(express.json());
app.use(express.static('public'));

//Routes
app.get('/', (req, res) => {
    res.send('API is running...');
});

app.use('/api/items', itemRoutes);

const PORT = process.env.PORT || 5000; 
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

