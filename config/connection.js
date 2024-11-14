require('dotenv').config();
const mysql = require('mysql2/promise');
const { Connector } = require('@google-cloud/cloud-sql-connector');

const connector = new Connector();

async function createPool() {
    const clientOpts = await connector.getOptions({
        instanceConnectionName: process.env.INSTANCE_CONNECTION_NAME,
        ipType: process.env.IP_TYPE,
    });

    const pool = mysql.createPool({
        ...clientOpts,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
    });

    return pool;
}

const pool = createPool();

const testConnection = async () => {
    try {
        await (await pool).getConnection();
        console.log('Connection has been established successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
};

testConnection();
module.exports = { pool, connector };
