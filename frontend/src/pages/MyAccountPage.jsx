import { useEffect, useState } from "react";
import { axiosInstance } from "../lib/axios.js";

const MyAccountPage = () => {
  const [user, setUser] = useState(null);
  const [message, setMessage] = useState("");
  const [showSellerForm, setShowSellerForm] = useState(false);
  const [showDeliveryForm, setShowDeliveryForm] = useState(false);

  // Form fields
  const [storeName, setStoreName] = useState("");
  const [sellerPhone, setSellerPhone] = useState("");
  const [idNumber, setIdNumber] = useState("");
  const [deliveryPhone, setDeliveryPhone] = useState("");

  useEffect(() => {
    // Fetch user details
    const fetchUser = async () => {
      try {
        const response = await axiosInstance.get("http://localhost:3000/api/auth/user/me");
        setUser(response.data);
      } catch (error) {
        setMessage(error.response?.data?.message || "Failed to load user data.");
      }
    };
    fetchUser();
  }, []);

  const handleBecomeSeller = async () => {
    try {
      const response = await axiosInstance.post("http://localhost:3000/api/auth/become-seller", {
        storeName,
        sellerPhone,
        idNumber,
      });
      setMessage(response.data.message || "You are now a seller!");
      setShowSellerForm(false);
    } catch (error) {
      setMessage(error.response?.data?.error || "Failed to become a seller.");
      setShowSellerForm(false);
    }
  };

  const handleBecomeDelivery = async () => {
    try {
      const response = await axiosInstance.post("http://localhost:3000/api/auth/become-delivery", {
        deliveryPhone,
      });
      setMessage(response.data.message || "You are now a delivery personnel!");
      setShowDeliveryForm(false);
    } catch (error) {
      setMessage(error.response?.data?.error || "Failed to become a delivery personnel.");
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h2 className="text-2xl font-semibold mb-4">My Account</h2>

      {message && <p className="text-green-600">{message}</p>}

      {user ? (
        <div className="bg-white shadow-md p-4 rounded-lg">
          <p className="text-gray-700"><strong>Username:</strong> {user.username}</p>
          <p className="text-gray-700"><strong>Email:</strong> {user.studentEmail}</p>
          <p className="text-gray-700"><strong>Residence:</strong> {user.residence}</p>

          <h3 className="text-xl font-semibold mt-4">My Roles</h3>
          <ul className="list-disc list-inside text-gray-700">
            {user.roles.length > 0 ? (
              user.roles.map((role, index) => <li key={index}>{role}</li>)
            ) : (
              <p>No roles assigned</p>
            )}
          </ul>

          <div className="mt-4 flex flex-wrap gap-4">
            {/* Become Seller Button */}
            <button 
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
              onClick={() => setShowSellerForm(true)}
            >
              Become a Seller
            </button>

            {/* Become Delivery Personnel Button */}
            <button 
              className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
              onClick={() => setShowDeliveryForm(true)}
            >
              Become Delivery Personnel
            </button>
          </div>
        </div>
      ) : (
        <p className="text-gray-600">Loading user data...</p>
      )}

      {/* Seller Form Modal */}
      {showSellerForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-sm">
            <h3 className="text-xl font-semibold mb-2">Become a Seller</h3>
            <input 
              type="text" placeholder="Store Name" value={storeName} onChange={(e) => setStoreName(e.target.value)}
              className="border p-2 w-full mb-2 rounded"
            />
            <input 
              type="text" placeholder="Seller Phone" value={sellerPhone} onChange={(e) => setSellerPhone(e.target.value)}
              className="border p-2 w-full mb-2 rounded"
            />
            <input 
              type="text" placeholder="ID Number" value={idNumber} onChange={(e) => setIdNumber(e.target.value)}
              className="border p-2 w-full mb-4 rounded"
            />
            <div className="flex justify-between">
              <button 
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                onClick={handleBecomeSeller}
              >
                Submit
              </button>
              <button 
                className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
                onClick={() => setShowSellerForm(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delivery Personnel Form Modal */}
      {showDeliveryForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-sm">
            <h3 className="text-xl font-semibold mb-2">Become Delivery Personnel</h3>
            <input 
              type="text" placeholder="Delivery Phone" value={deliveryPhone} onChange={(e) => setDeliveryPhone(e.target.value)}
              className="border p-2 w-full mb-4 rounded"
            />
            <div className="flex justify-between">
              <button 
                className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
                onClick={handleBecomeDelivery}
              >
                Submit
              </button>
              <button 
                className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
                onClick={() => setShowDeliveryForm(false)}
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

export default MyAccountPage;
