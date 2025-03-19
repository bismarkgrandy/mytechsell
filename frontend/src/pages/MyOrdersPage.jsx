import { useEffect, useState } from "react";
import { useOrderStore } from "../store/useOrderStore.js"; // Zustand store
import { axiosInstance } from "../lib/axios.js";

const MyOrdersPage = () => {
  const { orders, fetchOrders, updateOrderStatus } = useOrderStore();
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const handleConfirmDelivery = async () => {
    if (!selectedOrder) return;

    try {
      const response = await axiosInstance.patch("http://localhost:3000/api/order/confirm-delivery", {
        orderId: selectedOrder._id,
        deliveryPersonnelId: selectedOrder.deliveryPersonnel, // Replace with actual ID
      });

      setMessage(response.data.message || "Order marked as delivered!");
      updateOrderStatus(selectedOrder._id);

      // Auto-close modal after success
      setTimeout(() => {
        setSelectedOrder(null);
        setMessage("");
      }, 2000);
    } catch (error) {
      setMessage(error.response?.data?.message || "Failed to confirm delivery.");
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h2 className="text-2xl font-semibold mb-4">My Orders</h2>
      
      {orders.length === 0 ? (
        <p className="text-gray-600">No orders found.</p>
      ) : (
        orders.map((order) => (
          <div key={order._id} className="bg-white shadow-md p-4 mb-4 rounded-lg flex justify-between items-center">
            <div>
              <p className="text-gray-700"><strong>Status:</strong> {order.status}</p>
              <p className="text-gray-700"><strong>Payment:</strong> {order.paymentStatus}</p>
            </div>
            <p 
              className="text-blue-600 cursor-pointer underline"
              onClick={() => setSelectedOrder(order)}
            >
              {order.items.length} Items
            </p>
          </div>
        ))
      )}

      {/* Modal for Order Details */}
{/* Modal for Order Details */}
{selectedOrder && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
    <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-sm sm:w-96 max-h-[90vh] overflow-y-auto">
      <h3 className="text-xl font-semibold mb-2">Order Details</h3>
      <ul className="text-gray-700 mb-4">
        {selectedOrder.items.map((item) => (
          <li key={item.product._id}>🛒 {item.product.name} - {item.quantity}</li>
        ))}
      </ul>

      {/* Show message if payment is pending */}
      {selectedOrder.paymentStatus !== "paid" && (
        <p className="text-red-600 mb-2">You have not paid for this order</p>
      )}

      {message && (
        <p className={`mb-2 ${message.includes("Failed") ? "text-red-600" : "text-green-600"}`}>
          {message}
        </p>
      )}

      <div className="flex justify-between">
        {/* Disable Confirm Delivery if not paid */}
        <button 
          className={`px-4 py-2 rounded-md ${selectedOrder.paymentStatus !== "paid" ? "bg-gray-400 cursor-not-allowed" : "bg-green-600 hover:bg-green-700 text-white"}`}
          onClick={handleConfirmDelivery}
          disabled={selectedOrder.paymentStatus !== "paid"}
        >
          Confirm Delivery
        </button>

        <button 
          className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
          onClick={() => { setSelectedOrder(null); setMessage(""); }}
        >
          Close
        </button>
      </div>
    </div>
  </div>
)}


    </div>
  );
};

export default MyOrdersPage;

