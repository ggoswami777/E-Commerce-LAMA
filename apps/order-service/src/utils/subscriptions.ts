import { consumer } from "./kafka";
import { createOrder } from "./order";

export const runKafkaSubscription=async()=>{
 
    consumer.subscribe("payment.successful",async(order)=>{
         
        // Unwrap the value property if it exists
        const actualOrder = order.value || order;
         
        try {
            await createOrder(actualOrder);
        } catch (error) {
            console.error("[KAFKA-SUBSCRIPTION] Failed to create order:", error);
        }
    })
    

}