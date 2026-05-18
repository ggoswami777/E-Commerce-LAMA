import { consumer } from "./kafka";
import { createOrder } from "./order";

export const runKafkaSubscription=async()=>{
 
    consumer.subscribe("payment.successful",async(message)=>{
        
        console.log("Received message: payment.successful",message);
        const order=message.value;
        await createOrder(order);
        
    })
    

}