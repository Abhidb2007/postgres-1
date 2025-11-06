"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pg_1 = require("pg");
const express = require("express");
const app = express();
app.use(express.json());
const pgClient = new pg_1.Client('postgresql://neondb_owner:npg_7LTawG5Usrjx@ep-aged-violet-adh5o17p-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require');
// Connect to database when starting the server
pgClient.connect()
    .then(() => {
    console.log('Connected to database successfully');
})
    .catch(err => {
    console.error('Failed to connect to database:', err);
    process.exit(1); // Exit if we can't connect to database
});
app.post("/signup", async (req, res) => {
    try {
        const { username, password, email } = req.body;
        // Validate required fields
        if (!username || !password || !email) {
            return res.status(400).json({
                error: "Username, password, and email are required"
            });
        }
        // Check if username already exists
        const checkUser = await pgClient.query('SELECT username FROM users WHERE username = $1', [username]);
        if (checkUser.rows.length > 0) {
            return res.status(409).json({
                error: `Username '${username}' is already taken. Please choose a different username.`
            });
        }
        // Use parameterized query to prevent SQL injection
        const insertQuery = 'INSERT INTO users (username, password, email) VALUES ($1, $2, $3) RETURNING *';
        const response = await pgClient.query(insertQuery, [username, password, email]);
        res.status(201).json({
            message: "User signed up successfully",
            user: {
                username: response.rows[0].username,
                email: response.rows[0].email
            }
        });
    }
    catch (error) {
        console.error('Signup error:', error);
        res.status(500).json({
            error: "Internal server error"
        });
    }
});
app.listen(3000);
//# sourceMappingURL=index.js.map