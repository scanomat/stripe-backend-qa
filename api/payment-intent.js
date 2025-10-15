// api/payment-intent.js
import Stripe from "stripe";

export default async function handler(req, res) {
    if (req.method !== "POST") {
        res.setHeader("Allow", "POST");
        return res.status(405).json({ error: "Method Not Allowed" });
    }

    try {
        const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
            apiVersion: "2024-06-20",
        });

        const { amount, currency = 'usd', order_id } = req.body;

        // Validate required fields
        if (!amount) {
            return res.status(400).json({ error: "Amount is required" });
        }

        const paymentIntent = await stripe.paymentIntents.create({
            amount,
            currency,
            metadata: { order_id },
            capture_method: 'automatic',
            payment_method_types: ['card_present']
        });

        res.status(200).json({
            id: paymentIntent.id,
            client_secret: paymentIntent.client_secret,
            status: paymentIntent.status,
        });
    } catch (error) {
        console.error(error);
        res.status(400).json({ error: error.message });
    }
}