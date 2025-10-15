// api/connection-token.js
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
        const token = await stripe.terminal.connectionTokens.create();
        res.status(200).json({ secret: token.secret });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to create connection token" });
    }
}