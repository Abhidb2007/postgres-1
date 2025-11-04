"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pg_1 = require("pg");
const pgClient = new pg_1.Client('postgresql://neondb_owner:npg_7LTawG5Usrjx@ep-aged-violet-adh5o17p-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require');
async function main() {
    try {
        await pgClient.connect();
        // Await the query and log the rows (not the full response object)
        const response = await pgClient.query('SELECT * FROM users;');
        console.log(response.rows);
    }
    catch (err) {
        console.error('Database error:', err);
    }
    finally {
        // Ensure the client is closed when finished
        try {
            await pgClient.end();
        }
        catch (endErr) {
            // Log but don't throw from finally
            console.error('Error closing client:', endErr);
        }
    }
}
// Run main and surface any unexpected top-level errors
main().catch((err) => console.error('Unhandled error in main:', err));
//# sourceMappingURL=index.js.map