import { Hono } from "hono";
import stripe from "../utils/stripe";
import { shouldBeUser } from "../middleware/authMiddleware";
import { CartItemsType, CartItemType } from "@repo/types";
import { getStripeProductPrice } from "../utils/stripeProduct";

const sessionRoute=new Hono();
sessionRoute.post('/create-checkout-session', shouldBeUser, async (c) => {
    try {
        const { cart } = await c.req.json();
        
        if (!cart || !Array.isArray(cart)) {
            return c.json({ error: "Invalid cart data" }, 400);
        }

        const line_items = cart.map((item: any) => ({
            price_data: {
                currency: 'usd',
                product_data: {
                    name: item.name,
                    images: item.image ? [item.image] : [],
                },
                unit_amount: Math.round(item.price * 100), 
            },
            quantity: item.quantity || 1,
        }));

        const session = await stripe.checkout.sessions.create({
            ui_mode: 'embedded_page' as any,
            client_reference_id: c.get("userId") as string,
            line_items,
            mode: 'payment',
            shipping_address_collection: {
                allowed_countries: ['US', 'CA', 'IN'], 
            },
            return_url: `${process.env.CLIENT_URL || 'http://localhost:3002'}/return?session_id={CHECKOUT_SESSION_ID}`,
        });

        return c.json({ clientSecret: session.client_secret });
    } catch (error: any) {
        console.error("Stripe Session Error:", error);
        return c.json({ error: error.message }, 500);
    }
});

sessionRoute.get("/:session_id",async(c)=>{
    const {session_id}=c.req.param();
    const session=await stripe.checkout.sessions.retrieve(session_id as string,{
        expand:["line_items"],
    })
    console.log(session);
    return c.json(
        {
            status:session.status,
            paymentStatus:session.payment_status
        }
    )
})
export default sessionRoute;