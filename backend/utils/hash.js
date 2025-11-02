import crypto from "crypto";

export const hashPassword = (password) => {
    return new Promise((resolve, reject) => {
        const salt = crypto.randomBytes(16).toString("hex");

        crypto.scrypt(password, salt, 64, (error, derivedKey) => {
            if (error) reject(error);

            resolve(`${salt}:${derivedKey.toString("hex")}`);
        });
    });
};

export const verifyPassword = (password, hashedPassword) => {
    return new Promise((resolve, reject) => {
        const [salt, originalKey] = hashedPassword.split(":");

        crypto.scrypt(password, salt, 64, (error, derivedKey) => {
            if (error) reject(error);

            resolve(originalKey === derivedKey.toString("hex"));
        });
    });
};
