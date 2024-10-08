const express = require('express');
const dotenv = require('dotenv');
const session = require('express-session');
const bcrypt = require('bcrypt');
const { connectDB } = require('./config/db');
const itemRoutes = require('./routes/itemRoutes');
const { Pool } = require('pg');
const path = require('path');

// Load env variables
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // For parsing application/x-www-form-urlencoded
app.use(express.static('public')); // To serve static files

// Session configuration
app.use(session({
    secret: process.env.SESSION_SECRET || 'your_secret_key', 
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true } 
}));

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false,
    },
});

// Function to create a new user
const createUser = async (username, password) => {
    const hashedPassword = await bcrypt.hash(password, 10); // Hash the password with 10 salt rounds
    const result = await pool.query('INSERT INTO users (username, password) VALUES ($1, $2) RETURNING *', [username, hashedPassword]);
    return result.rows[0];
};

// User Registration Route
app.post('/register', async (req, res) => {
    const { username, password } = req.body;

    try {
        const newUser = await createUser(username, password);
        res.status(201).json({ message: 'User created successfully', user: newUser });
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({ message: 'Error creating user' });
    }
});

// User Login Route (GET)
app.get('/login', (req, res) => {
    // Send login.html if the user is not authenticated
    if (!req.session.userId) {
        res.sendFile(path.join(__dirname, 'public', 'login.html'));
    } else {
        // Redirect to home if authenticated
        res.redirect('/home');
    }
});

// User Login Route (POST)
app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    const result = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
    const user = result.rows[0];

    if (user && await bcrypt.compare(password, user.password)) {
        // Password matches, create session
        req.session.userId = user.id;
        req.session.username = user.username;
        res.redirect('/home'); // Redirect to home page after login
    } else {
        res.status(401).send('Invalid credentials');
    }
});

// Logout Route
app.get('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.redirect('/home'); // Redirect to home if there's an error
        }
        res.clearCookie('connect.sid'); // Clear session cookie
        res.redirect('/login'); // Redirect to login page after logout
    });
});

// Middleware to protect routes
const isAuthenticated = (req, res, next) => {
    if (req.session.userId) {
        return next();
    }
    res.redirect('/login'); // Redirect to login if not authenticated
};

// Protected route for home page
app.get('/home', isAuthenticated, (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html')); // Serve home page if authenticated
});

// Default route to check authentication
app.get('/', (req, res) => {
    if (!req.session.userId) {
        res.redirect('/login'); // Redirect to login if not authenticated
    } else {
        res.redirect('/home'); // Redirect to home if authenticated
    }
});

// API routes
app.use('/api/items', itemRoutes);

const PORT = process.env.PORT || 5000; 
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
