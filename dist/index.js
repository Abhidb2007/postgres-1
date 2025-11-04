"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pg_1 = require("pg");
const express = require("express");
const app = express();
app.use(express.json());
const pgClient = new pg_1.Client('postgresql://neondb_owner:npg_7LTawG5Usrjx@ep-aged-violet-adh5o17p-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require');
pgClient.connect();
app.post("/signup", async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    const email = req.body.email;
    const insertQuery = `INSERT INTO users (username, password, email) VALUES ('${username}', '${password}', '${email}')`;
    const response = await pgClient.query(insertQuery);
    res.json({
        message: "User signed up successfully"
    });
});
app.listen(3000);
//# sourceMappingURL=index.js.map