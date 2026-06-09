'use client'

import Link from 'next/link';
import React, { useEffect, useState } from 'react'
import useCartStore from '@/stores/cartStore';
import { useSearchParams } from 'next/navigation';

const ReturnPage = () => {
    const searchParams = useSearchParams();
    const session_id = searchParams.get('session_id');
    const { clearCart } = useCartStore();
    const [data, setData] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!session_id) {
            setError('No session id found');
            setLoading(false);
            return;
        }

        const fetchPaymentSession = async () => {
            let lastError: Error | null = null;
            const maxRetries = 3;
            const retryDelay = 1000;

            for (let attempt = 1; attempt <= maxRetries; attempt++) {
                try {
                    const res = await fetch(
                        `${process.env.NEXT_PUBLIC_PAYMENT_SERVICE_URL}/sessions/${session_id}`,
                        { cache: 'no-store' }
                    );

                    if (!res.ok) {
                        throw new Error(`Failed to fetch session: ${res.status} ${res.statusText}`);
                    }

                    const paymentData = await res.json();
                    setData(paymentData);
                    
                    // Clear cart only on successful payment
                    if (paymentData.status === 'complete' || paymentData.paymentStatus === 'paid') {
                        clearCart();
                    }
                    
                    setLoading(false);
                    break;
                } catch (err) {
                    lastError = err instanceof Error ? err : new Error(String(err));
                    console.error(`Error fetching payment session (attempt ${attempt}/${maxRetries}):`, err);

                    if (attempt < maxRetries) {
                        await new Promise(resolve => setTimeout(resolve, retryDelay));
                        continue;
                    }
                }
            }

            if (!data && lastError) {
                setError(lastError.message);
                setLoading(false);
            }
        };

        fetchPaymentSession();
    }, [session_id, clearCart]);

    if (loading) {
        return <div className="p-4">Loading payment status...</div>;
    }

    if (error || !data) {
        return (
            <div className="p-4">
                <h1 className="text-red-600">Error loading payment status</h1>
                <p>{error || 'Unknown error occurred'}</p>
                <Link href="/orders" className="text-blue-600 underline">See your orders</Link>
            </div>
        );
    }

    return (
        <div>
            <h1>Payment {data.status}</h1>
            <p>Payment status: {data.paymentStatus}</p>
            <Link href="/orders">See your orders</Link>
        </div>
    )
}

export default ReturnPage