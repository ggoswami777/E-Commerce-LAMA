import { Order } from "@repo/order-db";
import { OrderType } from "@repo/types";

export const createOrder=async(order:OrderType)=>{
     const newOrder=new Order(order);
     try {
         await newOrder.save();
     } catch (error) {
        console.error("[CREATE-ORDER] Error saving order to database:", error);
        throw error;
     }
}