import http from "http";
import { parse } from "url";
import { register, login, getMe, updateAccount } from "./controllers/userController.js";

const server = http.createServer(async (req, res) => {
    res.setHeader("Access-Control-Allow-Origin", "http://127.0.0.1:5500");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    res.setHeader("Access-Control-Allow-Credentials", "true");

    if (req.method === "OPTIONS") {
        res.writeHead(204);
        return res.end();
    }
    const parsedUrl = parse(req.url, true);
    const { pathname } = parsedUrl;

    if (pathname === "/api/user/register" && req.method === "POST") {
        await register(req, res);
    } else if (pathname === "/api/user/login" && req.method === "POST") {
        await login(req, res);
    } else if (pathname === "/api/user/me" && req.method === "GET") {
        await getMe(req, res);
    } else if (pathname === "/api/user/update" && req.method === "PATCH") {
        await updateAccount(req, res);
    } else if (pathname === "/api/user/logout" && req.method === "POST") {
        res.writeHead(200, {
            "Set-Cookie": "session=; HttpOnly; SameSite=None; Secure; Path=/; Max-Age=0",
            "Access-Control-Allow-Origin": "http://127.0.0.1:5500",
            "Access-Control-Allow-Credentials": "true",
            "Content-Type": "application/json"
        });
        res.end();
    } else {
        res.writeHead(404);
        res.end(JSON.stringify({ error: "API endpoint not found" }));
    }
});

server.listen(3000);
