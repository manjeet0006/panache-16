import { useCallback } from 'react';
import API from '../api';

const useRazorpay = () => {
    
    // 1. Load the Script
    const loadScript = (src) => {
        return new Promise((resolve) => {
            const script = document.createElement("script");
            script.src = src;
            script.onload = () => resolve(true);
            script.onerror = () => resolve(false);
            document.body.appendChild(script);
        });
    };

    const displayRazorpay = useCallback(async ({ amount, details, onSuccess, onError }) => {
        const res = await loadScript("https://checkout.razorpay.com/v1/checkout.js");

        if (!res) {
            alert("Razorpay SDK failed to load. Check your internet.");
            return;
        }

        // 2. Create Order on Backend
        try {

            const razorpayKey = import.meta.env.VITE_RAZORPAY_KEY_ID;
            if (!razorpayKey) return toast.error("Configuration Error: Key Missing.");

            const result = await API.post("/concert/create-order", {
                amount,
                concertId: details.concertId,
                tier: details.tier,
            });
            const { id: order_id, currency } = result.data;

            // 3. Open Payment Window
            const options = {
                key: razorpayKey, // Replace or use import.meta.env.VITE_RAZORPAY_KEY
                amount: amount.toString(),
                currency: currency,
                name: "Panache 2026",
                description: "Ticket for Panache",
                order_id: order_id,
                handler: async function (response) {
                    // Payment Successful!
                    if (onSuccess) onSuccess(response);
                },
                prefill: {
                    name: details.name,
                    email: details.email,
                    contact: details.phone,
                },
                theme: {
                    color: "#ec4899", // Pink Theme
                },
            };

            const paymentObject = new window.Razorpay(options);
            paymentObject.open();
            
        } catch (error) {
            console.error(error);
            if (onError) {
                onError(error);
            }
            if (error.response && error.response.status === 422) {
                toast.error(error.response.data.error);
            } else {
                alert("Server error. Could not start payment.");
            }
        }
    }, []);

    return { displayRazorpay };
};

export default useRazorpay;