import { Order } from "@repo/order-db";
import { OrderType } from "@repo/types";

export const createOrder=async(order:OrderType)=>{
     console.log("[CREATE-ORDER] Creating order for userId:", order.userId);
     console.log("[CREATE-ORDER] Order object:", JSON.stringify(order, null, 2));
     const newOrder=new Order(order);
     console.log("[CREATE-ORDER] Order instance created, attempting to save...");
     try {
        await newOrder.save();
        console.log("[CREATE-ORDER] Order saved successfully to MongoDB:", newOrder._id);
     } catch (error) {
        console.error("[CREATE-ORDER] Error saving order to database:", error);
        throw error;
     }
}