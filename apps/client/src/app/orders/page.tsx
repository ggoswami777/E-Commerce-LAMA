import { auth } from "@clerk/nextjs/server"
import { OrderType } from "@repo/types"

const fetchOrders=async()=>{
  const {getToken}= await auth();
  const token=await getToken();
  
  if (!token) {
    throw new Error('No authentication token found. Please log in.');
  }
  
  const res=await fetch(`${process.env.NEXT_PUBLIC_ORDER_SERVICE_URL}/user-orders`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  
  if (!res.ok) {
    const error = await res.json();
    throw new Error(`Failed to fetch orders: ${error.message || res.statusText}`);
  }
  
  const data:OrderType[]=await res.json();
  return data;
}
const ordersPage = async() => {
  const orders:OrderType[]=await fetchOrders();
  if(!orders || orders.length===0){
    return <div className="text-center mt-20">
      <h2 className="text-2xl font-medium">No orders found</h2>
    </div>
  }
  console.log(orders);
  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">My Orders</h1>
      <div className="space-y-4">
        {orders.map((order) => (
          <div key={order._id} className="border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-sm text-gray-600">Order ID</p>
                <p className="font-semibold text-sm">{String(order._id).slice(-8)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Status</p>
                <p className={`font-semibold text-sm capitalize ${
                  order.status === 'success' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {order.status}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Total</p>
                <p className="font-semibold text-sm">${(order.amount/100)?.toFixed(2) || '0.00'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Date</p>
                <p className="font-semibold text-sm">{new Date(order.createdAt).toLocaleDateString()}</p>
              </div>
            </div>
            <div className="mt-3 pt-3 border-t">
              <p className="text-sm text-gray-600 mb-2">Items ({order.product?.length || 0})</p>
              <div className="flex flex-wrap gap-2">
                {order.product?.map((item, idx) => (
                  <span key={idx} className="bg-gray-100 px-2 py-1 rounded text-xs">
                    {item.name} x {item.quantity}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ordersPage