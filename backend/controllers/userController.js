import db from "../utils/databaseConnection.js";
import parseBody from "../utils/parseRequest.js";
import { hashPassword, verifyPassword } from "../utils/hash.js";
import crypto from "crypto";

export const register = async (req, res) => {
    try {
        const body = await parseBody(req);
        const { firstName, lastName, email, password } = body;

        const checkIfUserExists = `SELECT 1 FROM user WHERE email = ? LIMIT 1`;
        const [rows] = await db.query(checkIfUserExists, [email]);

        if (rows.length > 0) {
            res.writeHead(400, "User already exists");
            return res.end();
        }

        const hashedPassword = await hashPassword(password);

        const createUser = `INSERT INTO user (first_name, last_name, email, password) VALUES (?, ?, ?, ?)`;
        await db.query(createUser, [firstName, lastName, email, hashedPassword]);

        await login({ email, password }, res);
    } catch (error) {
        res.writeHead(500, `Server error: ${error}`);
        res.end();
    }
};

export const login = async (req, res) => {
    try {
        let email, password;
        if (!req.email) {
            const body = await parseBody(req);
            ({ email, password } = body);
        } else {  // When register() calls login()
            ({ email, password } = req);
        }

        const findUser = `SELECT id, password FROM user WHERE email = ?`;
        const [rows] = await db.query(findUser, [email]);

        if (rows.length === 0) {
            res.writeHead(404, "User not found");
            return res.end();
        }

        const user = rows[0];
        const hashedPassword = user.password;
        const passwordsMatch = await verifyPassword(password, hashedPassword);
        if (!passwordsMatch) {
            res.writeHead(400, "Incorrect password");
            return res.end();
        }

        const sessionToken = crypto.randomBytes(16).toString("hex");
        const createSession = `INSERT INTO session (user_id, token) VALUES (?, ?)`;
        await db.query(createSession, [user.id, sessionToken]);

        res.writeHead(200, {
            "Set-Cookie": `session=${sessionToken}; HttpOnly; Path=/; SameSite=None; Secure; Max-Age=86400`,
            "Access-Control-Allow-Origin": "http://127.0.0.1:5500",
            "Access-Control-Allow-Credentials": "true",
            "Content-Type": "application/json"
        });
    } catch (error) {
        res.writeHead(500, `Server error: ${error}`);
    } finally {
        res.end();
    }
};

export const updateAccount = async (req, res) => {
    try {
        const body = await parseBody(req);
        const { email, firstName, lastName, password, newPassword } = body;

        if (firstName && lastName) {
            const updateUser = `UPDATE user SET first_name = ?, last_name = ? WHERE email = ?`;
            await db.query(updateUser, [firstName, lastName, email]);
        } else if (password && newPassword) {
            const getUserPass = `SELECT password FROM user WHERE email = ?`;
            const [rows] = await db.query(getUserPass, [email]);

            const passwordsMatch = await verifyPassword(password, rows[0].password);
            if (!passwordsMatch) {
                res.writeHead(400, "Incorrect password");
                return res.end();
            }

            const hashedPassword = await hashPassword(newPassword);
            const updateUser = `UPDATE user SET password = ? WHERE email = ?`;
            await db.query(updateUser, [hashedPassword, email]);
        }

        res.writeHead(200);
    } catch (error) {
        res.writeHead(500, `Server error: ${error}`);
    } finally {
        res.end();
    }
};

export const getMe = async (req, res) => {
    try {
        const cookies = req.headers.cookie;
        const sessionToken = cookies?.split("=")[1];

        const getUserId = `SELECT user_id FROM session WHERE token = ?`;
        const [rows] = await db.query(getUserId, [sessionToken]);

        if (rows.length === 0) {
            res.writeHead(401, "Unauthorized");
            return res.end();
        }

        const userId = rows[0].user_id;
        const getUser = `SELECT first_name, last_name, email FROM user WHERE id = ?`;
        const [userRow] = await db.query(getUser, [userId]);
        const { first_name, last_name, email } = userRow[0];

        const user = { firstName: first_name, lastName: last_name, email };
        res.end(JSON.stringify(user));
    } catch (error) {
        res.writeHead(500, `Server error: ${error}`);
        res.end();
    }
};
