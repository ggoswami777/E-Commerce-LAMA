import { consumer } from "./kafka";
import { createOrder } from "./order";

export const runKafkaSubscription=async()=>{
 
    consumer.subscribe("payment.successful",async(order)=>{
        console.log("[KAFKA-SUBSCRIPTION] Received message: payment.successful");
        console.log("[KAFKA-SUBSCRIPTION] Raw order data:", JSON.stringify(order, null, 2));
        
        // Unwrap the value property if it exists
        const actualOrder = order.value || order;
        console.log("[KAFKA-SUBSCRIPTION] Extracted order data:", JSON.stringify(actualOrder, null, 2));
        
        try {
            await createOrder(actualOrder);
            console.log("[KAFKA-SUBSCRIPTION] Order created successfully");
        } catch (error) {
            console.error("[KAFKA-SUBSCRIPTION] Failed to create order:", error);
        }
    })
    

}