import { Hono } from "hono";
import stripe from "../utils/stripe";
import { shouldBeUser } from "../middleware/authMiddleware";

const sessionRoute=new Hono();
sessionRoute.post('/create-checkout-session',shouldBeUser,async(c)=>{
    const session = await stripe.checkout.sessions.create({
        line_items:[
            {
                price_data:{
                    currency:'usd',
                    product_data:{
                        name:'T-shirt',
                    },
                    unit_amount:2000,
                },
                quantity:1,
            },
        ],
        mode: 'payment',
        ui_mode: 'embedded_page',
        return_url: 'http://localhost:3002/return?session_id={CHECKOUT_SESSION_ID}',
        
    });
    return c.json({ clientSecret: session.client_secret })
})
export default sessionRoute;