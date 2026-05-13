import { consumer } from "./kafka"
import { createStripeProduct, deleteStripeProduct } from "./stripeProduct";

export const runKafkaSubscription=async()=>{
    // Subscribe to topics matching the producer's naming convention
    consumer.subscribe("product.created",async(message)=>{
        const product=message.value;
        console.log("Received message: product-created",product);
        await createStripeProduct(product);
    })
    consumer.subscribe("product.deleted",async(message)=>{
        const productId=message.value;
        if (!productId || isNaN(Number(productId))) {
            console.error("Invalid product ID received");
            return;
        }
        console.log("Received message: product.deleted",productId);
        await deleteStripeProduct(productId);
    })

}