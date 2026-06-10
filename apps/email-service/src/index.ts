import { createConsumer, createKafkaClient } from "@repo/kafka";
import sendMail from "./utils/mailer";

const kafka=createKafkaClient("email-service");
const consumer=createConsumer(kafka,"email-service")
const start=async()=>{
    try{
        await consumer.subscribe("user.created",async(message)=>{
            const {email,username}=message.value;
           
            if(email){
                await sendMail({
                    email,
                    subject:"Welcome to Ecommerce App",
                    text:`Welcome ${username}. Your account has been created !`
                })
            }
        })
    }catch(error){
        console.error('Error starting the email service:', error);
    }
}
start();