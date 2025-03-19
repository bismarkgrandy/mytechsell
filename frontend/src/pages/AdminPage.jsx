

import { useEffect, useState } from "react";
import { axiosInstance } from "../lib/axios.js";

const AdminPage = () => {
  const [approvedDelivery, setApprovedDelivery] = useState([]);
  const [pendingDelivery, setPendingDelivery] = useState([]);
  const [pendingSellers, setPendingSellers] = useState([]);
  const [message, setMessage] = useState("");

  // Fetch Approved Delivery Personnel
  useEffect(() => {
    const fetchApprovedDelivery = async () => {
      try {
        const response = await axiosInstance.get("http://localhost:3000/api/admin/approved-delivery-personnel");
        setApprovedDelivery(response.data.deliveryPersonnel);
      } catch (error) {
        setMessage(error.response?.data?.message || "Failed to load approved delivery personnel.");
      }
    };
    fetchApprovedDelivery();
  }, []);

  // Fetch Pending Delivery Personnel
  useEffect(() => {
    const fetchPendingDelivery = async () => {
      try {
        const response = await axiosInstance.get("http://localhost:3000/api/admin/pending-delivery-personnel");
        setPendingDelivery(response.data.deliveryPersonnel);
      } catch (error) {
        setMessage(error.response?.data?.message || "Failed to load pending delivery personnel.");
      }
    };
    fetchPendingDelivery();
  }, []);

  // Fetch Pending Sellers
  useEffect(() => {
    const fetchPendingSellers = async () => {
      try {
        const response = await axiosInstance.get("http://localhost:3000/api/admin/pending-seller");
        setPendingSellers(response.data.sellers);
      } catch (error) {
        setMessage(error.response?.data?.message || "Failed to load pending sellers.");
      }
    };
    fetchPendingSellers();
  }, []);

  // Approve Delivery Personnel
  const handleApproveDelivery = async (id) => {
    try {
      const response = await axiosInstance.patch(
        `http://localhost:3000/api/admin/approve/delivery-personnel/${id}`,
        { status: "approved" }
      );
      setMessage(response.data.message || "Delivery personnel approved!");
      setPendingDelivery(pendingDelivery.filter((person) => person._id !== id));
    } catch (error) {
      setMessage(error.response?.data?.message || "Failed to approve delivery personnel.");
    }
  };

  // Approve Seller
  const handleApproveSeller = async (id) => {
    try {
      const response = await axiosInstance.patch(`http://localhost:3000/api/admin/approve-seller/${id}`,
        { status: "approved" }
      );
      setMessage(response.data.message || "Seller approved!");
      setPendingSellers(pendingSellers.filter((seller) => seller._id !== id));
    } catch (error) {
      setMessage(error.response?.data?.message || "Failed to approve seller.");
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-gray-100 min-h-screen">
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Admin Dashboard</h2>

      {message && (
        <p className="text-center text-green-600 font-semibold bg-green-100 p-2 rounded-md mb-4">{message}</p>
      )}

      {/* Approved Delivery Personnel */}
      <section className="mb-8 bg-white shadow-md p-6 rounded-lg">
        <h3 className="text-2xl font-semibold mb-4 text-gray-700">Approved Delivery Personnel</h3>
        {approvedDelivery.length > 0 ? (
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-200">
                <th className="border border-gray-300 px-4 py-2">Username</th>
                <th className="border border-gray-300 px-4 py-2">Phone</th>
              </tr>
            </thead>
            <tbody>
              {approvedDelivery.map((person) => (
                <tr key={person._id} className="border border-gray-300">
                  <td className="border border-gray-300 px-4 py-2">{person.username}</td>
                  <td className="border border-gray-300 px-4 py-2">{person.deliveryPhone}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-gray-500">No approved delivery personnel yet.</p>
        )}
      </section>

      {/* Approve Delivery Personnel */}
      <section className="mb-8 bg-white shadow-md p-6 rounded-lg">
        <h3 className="text-2xl font-semibold mb-4 text-gray-700">Pending Delivery Personnel</h3>
        {pendingDelivery.length > 0 ? (
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-200">
                <th className="border border-gray-300 px-4 py-2">Username</th>
                <th className="border border-gray-300 px-4 py-2">Phone</th>
                <th className="border border-gray-300 px-4 py-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {pendingDelivery.map((person) => (
                <tr key={person._id} className="border border-gray-300">
                  <td className="border border-gray-300 px-4 py-2">{person.username}</td>
                  <td className="border border-gray-300 px-4 py-2">{person.deliveryPhone}</td>
                  <td className="border border-gray-300 px-4 py-2">
                    <button
                      className="bg-green-600 text-white px-4 py-1 rounded-md hover:bg-green-700"
                      onClick={() => handleApproveDelivery(person._id)}
                    >
                      Approve
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-gray-500">No pending delivery personnel.</p>
        )}
      </section>

      {/* Approve Sellers */}
      <section className="mb-8 bg-white shadow-md p-6 rounded-lg">
        <h3 className="text-2xl font-semibold mb-4 text-gray-700">Pending Sellers</h3>
        {pendingSellers.length > 0 ? (
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-200">
                <th className="border border-gray-300 px-4 py-2">Username</th>
                <th className="border border-gray-300 px-4 py-2">Store Name</th>
                <th className="border border-gray-300 px-4 py-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {pendingSellers.map((seller) => (
                <tr key={seller._id} className="border border-gray-300">
                  <td className="border border-gray-300 px-4 py-2">{seller.username}</td>
                  <td className="border border-gray-300 px-4 py-2">{seller.storeName}</td>
                  <td className="border border-gray-300 px-4 py-2">
                    <button
                      className="bg-green-600 text-white px-4 py-1 rounded-md hover:bg-green-700"
                      onClick={() => handleApproveSeller(seller._id)}
                    >
                      Approve
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-gray-500">No pending sellers.</p>
        )}
      </section>
    </div>
  );
};

export default AdminPage;

