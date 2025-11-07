import express, { Router } from "express";
const app=express();    
const router1=Router()
router1.get("/brain/share",(req,res)=>{
    res.json({message: "upper open"});
})
const router2=Router()
//@ts-ignore
const middleware=(req, res, next)=>{
    console.log("middleware");
    next();
}
app.use("/api/v1",router1);
app.use("api/v2",middleware,router2);
app.get("/api/v1/brain/share",(req,res)=>{
    res.json({message: "hi there"});
})

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
