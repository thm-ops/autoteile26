"use client"

import { PayPalButtons, PayPalScriptProvider } from "@paypal/react-paypal-js";

type InstantBuyButtonPaypalProps = {
    productId:string,
};

export default function PayPalInstantBuyButton({ productId }: InstantBuyButtonPaypalProps) {
    const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;

    if (!clientId) {
        return <p className="text-red-600">PayPal ClientID fehlt.</p>
    }

    return (
        <div className="w-full max-w-sm">
            <PayPalScriptProvider
                options={{
                    clientId: clientId,
                    currency: "EUR",
                    intent : "capture",
                }}
            >
                <PayPalButtons
                    style={{
                        layout: "horizontal",
                        color: "gold",
                        shape: "rect",
                        label: "buynow",
                        height: 45,
                    }}
                    ></PayPalButtons>
            </PayPalScriptProvider>
        </div>
    )
}
