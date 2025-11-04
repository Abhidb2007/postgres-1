import { Client } from 'pg';
import * as express from 'express';

const app = express();
app.use(express.json());

const pgClient = new Client('postgresql://neondb_owner:npg_7LTawG5Usrjx@ep-aged-violet-adh5o17p-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require');

pgClient.connect();
app.post("/signup", async (req: express.Request, res: express.Response) => {
    const username = req.body.username;
    const password = req.body.password;
    const email = req.body.email;
    const insertQuery = `INSERT INTO users (username, password, email) VALUES ('${username}', '${password}', '${email}')`;
    const response = await pgClient.query(insertQuery);
    res.json({
        message: "User signed up successfully"
    })
})
app.listen(3000);