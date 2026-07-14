"use client"

import { useState } from "react";
import { PayPalButtons, PayPalScriptProvider } from "@paypal/react-paypal-js";

type InstantBuyButtonPaypalProps = {
    productId: string,
};

export default function PayPalInstantBuyButton({ productId }: InstantBuyButtonPaypalProps) {
    const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;
    // Empty base => relative, same-origin requests proxied by the Next server.
    const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? "";
    const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

    if (!clientId) {
        return <p className="text-red-600">PayPal ClientID fehlt.</p>
    }

    return (
        <div className="w-full max-w-sm">
            <PayPalScriptProvider
                options={{
                    clientId: clientId,
                    currency: "EUR",
                    intent: "capture",
                }}
            >
                <PayPalButtons
                    style={{
                        layout: "horizontal",
                        color: "gold",
                        shape: "rect",
                        label: "buynow",
                        height: 45,
                        // PayPal renders a fixed dark-coloured tagline under the
                        // button that is unreadable on our dark background and
                        // cannot be recoloured, so we disable it.
                        tagline: false,
                    }}
                    // The order is created server-side; the client only sends the
                    // product id. The price is resolved from the trusted product
                    // record in the backend, never from the browser.
                    createOrder={async () => {
                        const res = await fetch(`${apiUrl}/payments/orders`, {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ productId }),
                        });

                        if (!res.ok) {
                            setStatus("error");
                            throw new Error("Order could not be created");
                        }

                        const order = (await res.json()) as { id: string };
                        return order.id;
                    }}
                    // The capture is performed and verified server-side.
                    onApprove={async (data) => {
                        const res = await fetch(
                            `${apiUrl}/payments/orders/${data.orderID}/capture`,
                            {
                                method: "POST",
                                headers: { "Content-Type": "application/json" },
                            },
                        );

                        if (!res.ok) {
                            setStatus("error");
                            throw new Error("Payment could not be completed");
                        }

                        setStatus("success");
                    }}
                    onError={() => setStatus("error")}
                />
            </PayPalScriptProvider>

            <p className="text-white text-sm text-center mt-2">
                Überall schnell und sicher zahlen
            </p>

            {status === "success" && (
                <p className="text-green-600 mt-2">Zahlung erfolgreich!</p>
            )}
            {status === "error" && (
                <p className="text-red-600 mt-2">Zahlung fehlgeschlagen.</p>
            )}
        </div>
    )
}
