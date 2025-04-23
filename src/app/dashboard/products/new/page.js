"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FaSave, FaTimes, FaArrowLeft } from "react-icons/fa";

const NewProductPage = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    sku: ""
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Common product categories
  const categories = [
    "Electronics",
    "Clothing",
    "Food & Beverages",
    "Home & Garden",
    "Health & Beauty",
    "Toys & Games",
    "Books & Stationery",
    "Sports & Outdoors",
    "Automotive",
    "Other"
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccess("");

    try {
      // Get userId from localStorage
      const userId = localStorage.getItem("localId");
      if (!userId) {
        setError("User not authenticated. Please log in.");
        setIsLoading(false);
        return;
      }

      // Validate form data
      if (!formData.name) {
        setError("Product name is required");
        setIsLoading(false);
        return;
      }

      if (!formData.price || isNaN(parseFloat(formData.price))) {
        setError("Please enter a valid price");
        setIsLoading(false);
        return;
      }

      // Prepare data for API
      const productData = {
        ...formData,
        userId,
        price: parseFloat(formData.price)
      };

      console.log("Submitting product data:", productData);

      // Send to API
      const response = await fetch("/api/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(productData)
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || result.message || "Failed to add product");
      }

      setSuccess("Product added successfully!");
      
      // Reset form
      setFormData({
        name: "",
        description: "",
        price: "",
        category: "",
        sku: ""
      });
      
      // Redirect to products page after a short delay
      setTimeout(() => {
        router.push("/dashboard/products");
      }, 1500);
    } catch (err) {
      console.error("Error adding product:", err);
      setError(err.message || "An error occurred while adding the product");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex items-center mb-6">
        <Link href="/dashboard/products" className="flex items-center text-indigo-600 hover:text-indigo-800 transition-colors">
          <FaArrowLeft className="mr-2" />
          Back to Products
        </Link>
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-6 max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Add New Product</h1>
        
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded">
            <div className="flex">
              <div className="flex-shrink-0">
                <FaTimes className="text-red-500" />
              </div>
              <div className="ml-3">
                <p className="text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}
        
        {success && (
          <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-6 rounded">
            <div className="flex">
              <div className="ml-3">
                <p className="text-green-700">{success}</p>
              </div>
            </div>
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Product Name *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Enter product name"
                required
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="sku" className="block text-sm font-medium text-gray-700">
                SKU / Product Code
              </label>
              <input
                type="text"
                id="sku"
                name="sku"
                value={formData.sku}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Optional product code"
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                Category
              </label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="">Select a category</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="price" className="block text-sm font-medium text-gray-700">
                Price *
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">₦</span>
                <input
                  type="number"
                  id="price"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  className="w-full p-3 pl-8 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="0.00"
                  step="0.01"
                  min="0"
                  required
                />
              </div>
            </div>
          </div>
          
          <div className="space-y-2">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="4"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Enter product description"
            ></textarea>
          </div>
          
          <div className="flex justify-end space-x-4">
            <Link href="/dashboard/products">
              <button 
                type="button" 
                className="flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
              >
                <FaTimes className="mr-2 -ml-1" />
                Cancel
              </button>
            </Link>
            
            <button
              type="submit"
              disabled={isLoading}
              className={`flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none ${
                isLoading ? "opacity-70 cursor-not-allowed" : ""
              }`}
            >
              <FaSave className="mr-2 -ml-1" />
              {isLoading ? "Saving..." : "Save Product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Add display name to help Next.js recognize this as a valid component
NewProductPage.displayName = "NewProductPage";

export default NewProductPage; 