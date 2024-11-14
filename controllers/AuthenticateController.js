const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { pool } = require('../config/connection');

const generateToken = (user) => {
    return jwt.sign({ id: user.id, username: user.username }, process.env.JWT_SECRET, {
        expiresIn: '1h',
    });
};

const registerUser = async (req, res) => {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        return res.status(400).json({ message: 'All fields are required: username, email, and password' });
    }

    try {
        const conn = await (await pool).getConnection();
        
        const [existingEmail] = await conn.query(`SELECT * FROM users WHERE email = ?`, [email]);
        const [existingUser] = await conn.query(`SELECT * FROM users WHERE username = ?`, [username]);

        if (existingUser.length > 0) {
            return res.status(400).json({ message: 'Username already exists' });
        } else if (existingEmail.length > 0) {
            return res.status(400).json({ message: 'Email already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        await conn.query(`INSERT INTO users (username, email, password) VALUES (?, ?, ?)`, [username, email, hashedPassword]);

        const [newUser] = await conn.query(`SELECT * FROM users WHERE username = ?`, [username]);
        const token = generateToken(newUser[0]);

        res.cookie('token', token, { httpOnly: true, secure: true });
        return res.status(201).json({ message: 'User registered successfully', token });
    } catch (error) {
        console.error('Error in registerUser:', error);
        return res.status(500).json({ message: `Internal server error: ${error}` });
    }
};

const loginUser = async (req, res) => {
    try {
        const { username, password } = req.body;
        
        const conn = await (await pool).getConnection();
        const [user] = await conn.query(`SELECT * FROM users WHERE username = ?`, [username]);

        if (user.length === 0) {
            return res.status(401).json({ message: 'Invalid username or password' });
        }

        const isPasswordValid = await bcrypt.compare(password, user[0].password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid username or password' });
        }

        const token = generateToken(user[0]);
        res.cookie('token', token, { httpOnly: true });
        res.status(200).json({ message: 'Login successful', token });
    } catch (error) {
        console.error('Error in loginUser:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const protectedRoute = (req, res) => {
    return res.json({ message: 'This is a protected route', user: req.user });
};

const logoutUser = (req, res) => {
    res.clearCookie('token');
    return res.json({ message: 'Logged out successfully' });
};

module.exports = {
    registerUser,
    loginUser,
    protectedRoute,
    logoutUser
};
