import { Client } from 'pg';
import * as express from 'express';

const app = express();
app.use(express.json());

const pgClient = new Client('postgresql://neondb_owner:npg_7LTawG5Usrjx@ep-aged-violet-adh5o17p-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require');

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
  const username = req.body.username;
  const password = req.body.password;
  const email = req.body.email;
  const city= req.body.city;
  const country= req.body.country;
  const street= req.body.street;
  const pincode= req.body.pincode;


  try {
    const insertQuery = `INSERT INTO users (username, email, password) VALUES ($1, $2, $3);`;
    const response = await pgClient.query(insertQuery, [username, email, password]);
    const adressInsertQuery = `INSERT INTO address (username, street, city, country, pincode,user_id) VALUES ($1, $2, $3, $4, $5,$6);`
    const adressInsertResponse = await pgClient.query(adressInsertQuery,[city,pincode,street,country]);
    res.json({ message: "You have signed up" });
  } catch (e) {
    console.log(e);
    res.json({ message: "Error while signing up" });
  }
});
