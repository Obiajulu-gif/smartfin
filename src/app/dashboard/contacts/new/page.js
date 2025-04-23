"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FaUser, FaBuilding, FaPhone, FaEnvelope, FaSave, FaArrowLeft } from "react-icons/fa";

export default function NewContactPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    type: "client", // Default type: client or supplier
    notes: ""
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Form submission handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccessMessage(null);
    
    try {
      // Get the user ID from localStorage
      const userId = localStorage.getItem("localId");
      if (!userId) {
        throw new Error("User not authenticated. Please log in to continue.");
      }
      
      // Validate required fields
      if (!formData.name || !formData.email || !formData.phone) {
        throw new Error("Name, email, and phone are required fields.");
      }
      
      // Prepare the contact data to send to the API
      const contactData = {
        ...formData,
        userId: userId,
        createdAt: new Date().toISOString()
      };
      
      // Log the data being sent
      console.log("Sending contact data:", contactData);
      
      // Send the data to the API
      const response = await fetch("/api/contacts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(contactData)
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || data.message || "Failed to create contact");
      }
      
      // Show success message
      setSuccessMessage("Contact created successfully!");
      
      // Reset the form
      setFormData({
        name: "",
        email: "",
        phone: "",
        company: "",
        type: "client",
        notes: ""
      });
      
      // Redirect to contacts list after a short delay
      setTimeout(() => {
        router.push("/dashboard/contacts");
      }, 1500);
      
    } catch (err) {
      console.error("Error creating contact:", err);
      setError(err.message || "An error occurred while creating the contact");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="mb-6">
        <Link
          href="/dashboard/contacts"
          className="flex items-center text-indigo-600 hover:text-indigo-800 transition duration-300"
        >
          <FaArrowLeft className="mr-2" /> Back to Contacts
        </Link>
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Add New Contact</h1>
        
        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6" role="alert">
            <p>{error}</p>
          </div>
        )}
        
        {successMessage && (
          <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-6" role="alert">
            <p>{successMessage}</p>
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Contact Type */}
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2">Contact Type</label>
            <div className="flex space-x-4">
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  name="type"
                  value="client"
                  checked={formData.type === "client"}
                  onChange={handleChange}
                  className="form-radio h-5 w-5 text-indigo-600"
                />
                <span className="ml-2 text-gray-700">Client</span>
              </label>
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  name="type"
                  value="supplier"
                  checked={formData.type === "supplier"}
                  onChange={handleChange}
                  className="form-radio h-5 w-5 text-indigo-600"
                />
                <span className="ml-2 text-gray-700">Supplier</span>
              </label>
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  name="type"
                  value="other"
                  checked={formData.type === "other"}
                  onChange={handleChange}
                  className="form-radio h-5 w-5 text-indigo-600"
                />
                <span className="ml-2 text-gray-700">Other</span>
              </label>
            </div>
          </div>
          
          {/* Full Name */}
          <div className="mb-6">
            <label htmlFor="name" className="block text-gray-700 text-sm font-bold mb-2 flex items-center">
              <FaUser className="mr-2 text-indigo-500" />
              Full Name*
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-indigo-500"
              placeholder="Enter contact name"
              required
            />
          </div>
          
          {/* Email */}
          <div className="mb-6">
            <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2 flex items-center">
              <FaEnvelope className="mr-2 text-indigo-500" />
              Email Address*
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-indigo-500"
              placeholder="Enter email address"
              required
            />
          </div>
          
          {/* Phone */}
          <div className="mb-6">
            <label htmlFor="phone" className="block text-gray-700 text-sm font-bold mb-2 flex items-center">
              <FaPhone className="mr-2 text-indigo-500" />
              Phone Number*
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-indigo-500"
              placeholder="Enter phone number"
              required
            />
          </div>
          
          {/* Company */}
          <div className="mb-6">
            <label htmlFor="company" className="block text-gray-700 text-sm font-bold mb-2 flex items-center">
              <FaBuilding className="mr-2 text-indigo-500" />
              Company/Organization
            </label>
            <input
              type="text"
              id="company"
              name="company"
              value={formData.company}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-indigo-500"
              placeholder="Enter company or organization name (optional)"
            />
          </div>
          
          {/* Notes */}
          <div className="mb-6">
            <label htmlFor="notes" className="block text-gray-700 text-sm font-bold mb-2">
              Notes
            </label>
            <textarea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows="4"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-indigo-500"
              placeholder="Add any additional notes about this contact (optional)"
            ></textarea>
          </div>
          
          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-6 rounded flex items-center transition duration-300"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <span className="mr-2 animate-spin">⟳</span>
                  Saving...
                </>
              ) : (
                <>
                  <FaSave className="mr-2" />
                  Save Contact
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 