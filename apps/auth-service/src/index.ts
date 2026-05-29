import express, { NextFunction } from "express";
import cors from "cors";
import { clerkMiddleware, getAuth } from "@clerk/express";
import { shouldBeAdmin } from "./middleware/authMiddleware.js";
import userRoute from "./routes/user.route.js";

import { Request,Response } from "express";

const app=express();
app.use(cors({
    origin:["http://localhost:3003"],credentials:true,
}))
app.use(express.json());
app.use(clerkMiddleware());

app.use('/users',shouldBeAdmin,userRoute);

app.use((err:any,req:Request,res:Response,next:NextFunction)=>{
    console.log(err);
    return res.status(err.status || 500).json({message:err.message || "Internal Server Error!"})
})

const start=async ()=>{
    try {
       
        app.listen(8003,()=>{
            console.log("Auth service is running on 8003")
        })
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
}
start();