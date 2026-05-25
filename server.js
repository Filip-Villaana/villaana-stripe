const express = require("express");
const Stripe = require("stripe");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

app.post("/create-checkout-session", async (req, res) => {

    try {

        const { totalPrice } = req.body;

        const session = await stripe.checkout.sessions.create({

            payment_method_types: ["card"],

            line_items: [
                {
                    price_data: {
                        currency: "eur",

                        product_data: {
                            name: "Villa Ana Reservation"
                        },

                        unit_amount: totalPrice * 100
                    },

                    quantity: 1
                }
            ],

            mode: "payment",

            success_url: "https://villaana-rab.com/success.html?success=true",

            cancel_url: "https://villaana-rab.com/cancel.html?cancelled=true",        });

        res.json({
            url: session.url
        });

    } catch (err) {

        console.error(err);

        res.status(500).json({
            error: err.message
        });

    }

});

app.listen(3000, () => {
    console.log("Server läuft auf Port 3000");
});
