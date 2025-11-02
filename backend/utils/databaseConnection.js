import mysql from "mysql2/promise";

const initDb = async () => {
    const connection = await mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "pass"  // Your password
    });

    const createDb = `CREATE DATABASE IF NOT EXISTS registration_system`;
    await connection.query(createDb);
    await connection.query("USE registration_system");

    const createUserTable = `CREATE TABLE IF NOT EXISTS user (
        id INT AUTO_INCREMENT PRIMARY KEY,
        first_name VARCHAR(255) NOT NULL,
        last_name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        password VARCHAR(255) NOT NULL,
        UNIQUE (email)
    )`;

    await connection.query(createUserTable);

    const createSessionTable = `CREATE TABLE IF NOT EXISTS session (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        token VARCHAR(255) NOT NULL
    )`;

    await connection.query(createSessionTable);

    await connection.end();
};

await initDb();

const db = await mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "pass",  // Your password
    database: "registration_system",
    namedPlaceholders: true
});

export default db;
