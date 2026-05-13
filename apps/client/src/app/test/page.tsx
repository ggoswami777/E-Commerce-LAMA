import { auth } from '@clerk/nextjs/server';
import React from 'react'

const TestPage = async () => {
    const { getToken } = await auth();
    const token = await getToken();

    let dataProduct = { message: "Not fetched" };
    let dataOrder = { message: "Not fetched" };
    let datapayment = { message: "Not fetched" };

    try {
        const resProduct = await fetch("http://localhost:8000/test", {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        });
        if (resProduct.ok) dataProduct = await resProduct.json();
    } catch (e) {
        dataProduct = { message: "Fetch failed" };
    }

    return (
        <div style={{ padding: '20px', fontFamily: 'monospace', backgroundColor: '#000', color: '#0f0', minHeight: '100vh' }}>
            <h1>Debug Dashboard</h1>
            
            <section style={{ marginBottom: '20px' }}>
                <h3>JWT Token</h3>
                <textarea 
                    readOnly 
                    value={token || "No token"} 
                    style={{ width: '100%', height: '150px', backgroundColor: '#111', color: '#0f0', border: '1px solid #333' }}
                />
            </section>

            <section>
                <h3>Product Service Response</h3>
                <pre style={{ backgroundColor: '#111', padding: '10px' }}>
                    {JSON.stringify(dataProduct, null, 2)}
                </pre>
            </section>
        </div>
    )
}

export default TestPage