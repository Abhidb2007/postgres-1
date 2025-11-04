import { Client } from 'pg';

const pgClient = new Client('postgresql://neondb_owner:npg_7LTawG5Usrjx@ep-aged-violet-adh5o17p-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require');

pgClient.connect()
app.post("/signup",async(req, res)=>{
    const username=req.body.username;
    const password=req.body.password;
    const email=req.body.email;
     let sqlQuery="INSERT INTO users(username,password,email) VALUES ("
     sqlQuery+=username;
     sqlQuery+=",";
     sqlQuery+=email;
     sqlQuery+=",";
     sqlQuery+=password;
     sqlQuery+=");"
    const response=await pgClient.query("INSERT INTO users (username,email.password) VALUES (${username},${email},${password});");
    res.json({
        message:"User signed up successfully"
    })
})
export default pgClient