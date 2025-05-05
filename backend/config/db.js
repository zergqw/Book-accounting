require("dotenv").config();
const { Pool } = require("pg");

const pool = new Pool({
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
});

pool.on("connect", () => {
    console.log("Успешное подключение к БД.");
});

pool.on("error", () => {
    console.log("Ошибка подключения к БД.");
});

// Выполнение SQL запроса к БД
const query = async (text, params) => {
    const start = Date.now();
    try {
        const result = await pool.query(text, params);
        const duration = Date.now() - start;
        console.log("Выполнен запрос", {
            text,
            duration,
            rows: result.rowCount,
        });
        return result;
    } catch (error) {
        console.error("Ошибка выполнения запроса: ", error);
        throw error;
    }
};

module.exports = {
    query,
    pool,
};
