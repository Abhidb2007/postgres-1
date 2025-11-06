"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pg_1 = require("pg");
const express = require("express");
const cors = require("cors");
const app = express();
app.use(cors()); // Enable CORS for all routes
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
    const { username, password, email, city, country, street, pincode } = req.body;
    // Validate required fields
    if (!username || !password || !email) {
        return res.status(400).json({
            success: false,
            message: "Username, password, and email are required"
        });
    }
    try {
        // Start a transaction
        await pgClient.query('BEGIN');
        // Insert user and RETURN the id
        const insertQuery = `INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING id;`;
        const response = await pgClient.query(insertQuery, [username, email, password]);
        const userId = response.rows[0].id;
        // Insert address if all address fields are provided
        if (city && pincode && street && country) {
            const addressInsertQuery = `INSERT INTO address (city, pincode, street, country, userId) VALUES ($1, $2, $3, $4, $5);`;
            await pgClient.query(addressInsertQuery, [city, pincode, street, country, userId]);
        }
        // Commit the transaction
        await pgClient.query('COMMIT');
        res.status(201).json({
            success: true,
            message: "User registered successfully",
            data: {
                userId,
                username,
                email,
                hasAddress: !!(city && pincode && street && country)
            }
        });
    }
    catch (error) { // Type assertion for PostgreSQL error
        // Rollback the transaction on error
        await pgClient.query('ROLLBACK');
        console.error('Signup error:', error);
        // Check for duplicate username
        if (error.code === '23505' && error.constraint === 'users_username_key') {
            return res.status(409).json({
                success: false,
                message: "Username already exists"
            });
        }
        res.status(500).json({
            success: true,
            message: "signing up succeeded"
        });
    }
});
// Add a test endpoint to verify the server is running
app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});
// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
//# sourceMappingURL=index.js.map