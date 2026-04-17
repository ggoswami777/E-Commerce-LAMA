import express from "express";
import cors from "cors";
import { clerkMiddleware, getAuth } from "@clerk/express";
import { shouldBeUser } from "./middleware/authMiddleware.js";

const app=express();
app.use(cors({
    origin:["https://localhost:3002","http://localhost:3003"],credentials:true,
}))
app.use(clerkMiddleware());
app.get("/test",shouldBeUser,(req,res)=>{
   
   
    return res.json({message:"Product service authenticated",userId:req.userId})
})
app.listen(8000,()=>{
    console.log("product service is running")
})