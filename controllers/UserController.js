const { pool } = require('../config/connection');

const getUsers = async (req, res) => {
    try {
        const conn = await (await pool).getConnection();
        const [users] = await conn.query('SELECT * FROM users');
        res.json(users);
        conn.release();
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports = {
    getUsers
};
