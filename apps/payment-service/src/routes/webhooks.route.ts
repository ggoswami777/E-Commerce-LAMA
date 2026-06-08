import { Hono } from "hono";
import Stripe from "stripe";
import stripe from "../utils/stripe";
import { producer } from "../utils/kafka";

const webhookSecret=process.env.STRIPE_WEBHOOK_SECRET as string
const webhookRoute=new Hono();


webhookRoute.post("/stripe", async (c) => {
    const body = await c.req.text();
    const sig = c.req.header("stripe-signature");

    if (!sig || !webhookSecret) {
      
        return c.json({ error: "Webhook signature or secret missing" }, 400);
    }

    let event: Stripe.Event;

    try {
        event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
    } catch (err: any) {
     
        return c.json({ error: `Webhook Error: ${err.message}` }, 400);
    }

   

    try {
        switch (event.type) {
            case "checkout.session.completed":
                const session = event.data.object as Stripe.Checkout.Session;
                
            
                const sessionWithLineItems = await stripe.checkout.sessions.retrieve(session.id, {
                    expand: ["line_items"],
                });

                console.log("[WEBHOOK] Checkout session completed:", sessionWithLineItems.id);
                console.log("[WEBHOOK] Customer email:", session.customer_details?.email);
                 
                // TODO: Trigger order creation (Kafka, database, etc.)
              await producer.send("payment.successful", {
                value: {
                    userId: session.client_reference_id,
                    email: session.customer_details?.email,
                    amount: session.amount_total,
                    status: session.payment_status === "paid" ? "success" : "failed",
                    product: sessionWithLineItems.line_items?.data.map((item) => ({
                        name: item.description || "Unknown Product",
                        quantity: item.quantity || 1,
                        price: item.price?.unit_amount || 0,
                    })) || [],
                    products: sessionWithLineItems.line_items?.data.map((item) => ({
                        name: item.description || "Unknown Product",
                        quantity: item.quantity || 1,
                        price: item.price?.unit_amount || 0,
                    })) || [],
                }
              });


            case "checkout.session.expired":
                const expiredSession = event.data.object as Stripe.Checkout.Session;
                console.log("Checkout session expired:", expiredSession.id);
                break;

            default:
                console.log(`Unhandled event type: ${event.type}`);
        }

        return c.json({ received: true }, 200);
    } catch (err: any) {
        console.error(`Error processing webhook: ${err.message}`);
        return c.json({ error: "Webhook handler failed" }, 500);
    }
});
export default webhookRoute