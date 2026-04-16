import express from "express";
import cors from "cors";
import { clerkMiddleware, getAuth } from "@clerk/express";

const app=express();
app.use(cors({
    origin:["https://localhost:3002","http://localhost:3003"],credentials:true,
}))
app.use(clerkMiddleware());
app.get("/test",(req,res)=>{
    const auth=getAuth(req);
    const userId=auth.userId;
    if(!userId){
        return res.status(401).json({message:"You are not logged in"});
    }
    console.log(auth);
    return res.json({message:"Product service authenticated"})
})
app.listen(8000,()=>{
    console.log("product service is running")
})