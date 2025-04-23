"use client";
import { useState, useEffect, useRef } from "react";
import { FaPlusCircle, FaReceipt, FaCartArrowDown, FaPrint, FaDownload, FaEnvelope } from "react-icons/fa";
import { v4 as uuidv4 } from 'uuid';

export default function PointOfSalePage() {
	const [selectedProducts, setSelectedProducts] = useState([]);
	const [totalAmount, setTotalAmount] = useState(0);
	const [products, setProducts] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [showReceipt, setShowReceipt] = useState(false);
	const [showSimpleReceipt, setShowSimpleReceipt] = useState(false);
	const [receiptData, setReceiptData] = useState(null);
	const [userId, setUserId] = useState('');
	const [transactionId, setTransactionId] = useState('');
	const receiptRef = useRef(null);

	// Fetch products from MongoDB when component mounts
	useEffect(() => {
		const fetchProducts = async () => {
			try {
				// Get localId from localStorage (correct key as per firebaseAuth.js)
				const userId = localStorage.getItem('localId');
				setUserId(userId);
				
				if (!userId) {
					setError("User not authenticated");
					setLoading(false);
					return;
				}

				const response = await fetch(`/api/mongodb-products?userId=${userId}`);
				
				if (!response.ok) {
					throw new Error(`Error fetching products: ${response.statusText}`);
				}
				
				const data = await response.json();
				setProducts(data);
				setLoading(false);
			} catch (err) {
				console.error("Failed to fetch products:", err);
				setError("Failed to load products. Please try again later.");
				setLoading(false);
			}
		};

		fetchProducts();
		
		// Set up interval for real-time updates every 30 seconds
		const intervalId = setInterval(() => {
			fetchProducts();
		}, 30000);
		
		// Clean up interval on component unmount
		return () => clearInterval(intervalId);
	}, []);

	const handleAddProduct = (product) => {
		// Add selected product to the list
		setSelectedProducts([...selectedProducts, product]);
		setTotalAmount(totalAmount + parseInt(product.price));
	};

	const handleRemoveProduct = (index) => {
		const updatedProducts = [...selectedProducts];
		const removedProduct = updatedProducts.splice(index, 1)[0];
		setSelectedProducts(updatedProducts);
		setTotalAmount(totalAmount - parseInt(removedProduct.price));
	};

	const generateReceiptData = () => {
		const date = new Date();
		const formattedDate = date.toLocaleDateString();
		const formattedTime = date.toLocaleTimeString();
		const txnId = uuidv4().slice(0, 8).toUpperCase();
		
		setTransactionId(txnId);
		
		return {
			id: txnId,
			date: formattedDate,
			time: formattedTime,
			items: selectedProducts,
			total: totalAmount,
			businessName: "SmartFin Business", // You can customize this or fetch from user profile
			paymentMethod: "Cash", // This could be enhanced with payment method selection
		};
	};
	
	const saveTransaction = async (data) => {
		try {
			const response = await fetch('/api/addTransaction', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					userId: userId,
					transactionId: data.id,
					date: data.date,
					time: data.time,
					items: data.items,
					total: data.total,
					paymentMethod: data.paymentMethod
				}),
			});
			
			if (!response.ok) {
				throw new Error("Failed to save transaction");
			}
			
			return await response.json();
		} catch (error) {
			console.error("Error saving transaction:", error);
		}
	};

	const handleCheckout = async () => {
		if (selectedProducts.length === 0) {
			alert("Please add products to the cart before checkout.");
			return;
		}
		
		const data = generateReceiptData();
		setReceiptData(data);
		
		// Save transaction to database
		await saveTransaction(data);
		
		// Show receipt modal
		setShowReceipt(true);
	};
	
	const handlePrintReceipt = () => {
		const content = receiptRef.current;
		const originalContents = document.body.innerHTML;
		
		document.body.innerHTML = content.innerHTML;
		window.print();
		document.body.innerHTML = originalContents;
		window.location.reload(); // Reload the page after printing
	};
	
	const handleDownloadReceipt = () => {
		const receipt = receiptRef.current.innerHTML;
		const blob = new Blob([`
			<html>
				<head>
					<title>Receipt - ${receiptData.id}</title>
					<style>
						body { font-family: Arial, sans-serif; }
						.receipt { max-width: 300px; margin: 0 auto; }
						.receipt-header { text-align: center; margin-bottom: 10px; }
						.receipt-item { display: flex; justify-content: space-between; margin: 5px 0; }
						.receipt-total { border-top: 1px solid #000; margin-top: 10px; padding-top: 5px; font-weight: bold; display: flex; justify-content: space-between; }
					</style>
				</head>
				<body>
					${receipt}
				</body>
			</html>
		`], { type: 'text/html' });
		
		const url = URL.createObjectURL(blob);
		const a = document.createElement('a');
		a.href = url;
		a.download = `receipt-${receiptData.id}.html`;
		document.body.appendChild(a);
		a.click();
		document.body.removeChild(a);
	};
	
	const handleEmailReceipt = () => {
		// This is a placeholder for email functionality
		alert("Email functionality would send receipt to customer's email. For now, please download or print the receipt.");
	};
	
	const toggleSimpleReceipt = () => {
		setShowSimpleReceipt(!showSimpleReceipt);
	};
	
	const handleNewTransaction = () => {
		// Reset the cart and close the receipt modal
		setSelectedProducts([]);
		setTotalAmount(0);
		setShowReceipt(false);
		setReceiptData(null);
		setShowSimpleReceipt(false);
	};
	
	const getSimpleReceipt = () => {
		if (!receiptData) return "";
		
		let receiptText = `
=== RECEIPT ===
${receiptData.businessName}
${receiptData.date} at ${receiptData.time}
Receipt #${receiptData.id}
---------------
ITEMS:
`;

		receiptData.items.forEach(item => {
			receiptText += `${item.name}: $${item.price}\n`;
		});
		
		receiptText += `
---------------
TOTAL: $${receiptData.total}
Payment: ${receiptData.paymentMethod}

Thank you for your business!
===============
`;
		
		return receiptText;
	};
	
	const previewSimpleReceipt = () => {
		const receiptText = getSimpleReceipt();
		alert(receiptText);
	};

	// Display loading state
	if (loading) {
		return <div className="container mx-auto p-8 text-center">Loading products...</div>;
	}

	// Display error state
	if (error) {
		return (
			<div className="container mx-auto p-8">
				<div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4" role="alert">
					<p>{error}</p>
				</div>
			</div>
		);
	}

	return (
		<div className="container mx-auto p-8">
			<h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
				Point of Sale (POS)
			</h1>

			{/* Product Selection */}
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
				{products.length === 0 ? (
					<p className="col-span-3 text-center text-gray-500">No products found. Add products in the Products page.</p>
				) : (
					products.map((product) => (
						<div
							key={product._id}
							className="border border-gray-200 rounded-lg shadow-lg p-6 hover:shadow-xl transition-transform transform hover:scale-105 cursor-pointer"
							onClick={() => handleAddProduct(product)}
						>
							<h2 className="text-lg font-semibold text-gray-800">
								{product.name}
							</h2>
							<p className="text-gray-600">Price: ${product.price}</p>
							{product.category && <p className="text-gray-600">Category: {product.category}</p>}
							{product.description && <p className="text-gray-500 text-sm mt-2">{product.description}</p>}
							<button className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg flex items-center justify-center w-full hover:bg-indigo-800 transition-colors">
								<FaPlusCircle className="mr-2" /> Add to Cart
							</button>
						</div>
					))
				)}
			</div>

			{/* Cart and Checkout Section */}
			<div className="bg-white p-6 rounded-lg shadow-lg">
				<h2 className="text-2xl font-bold text-gray-800 mb-4">Cart</h2>

				{selectedProducts.length === 0 ? (
					<p className="text-gray-500">No products added to the cart.</p>
				) : (
					<div>
						<ul className="mb-6">
							{selectedProducts.map((product, index) => (
								<li
									key={index}
									className="flex justify-between items-center mb-4 border-b pb-2 border-gray-200"
								>
									<span>{product.name}</span>
									<div className="flex items-center space-x-4">
										<span>${product.price}</span>
										<button
											onClick={() => handleRemoveProduct(index)}
											className="px-2 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600"
										>
											Remove
										</button>
									</div>
								</li>
							))}
						</ul>

						{/* Total Amount */}
						<div className="flex justify-between items-center mb-4">
							<h3 className="text-lg font-bold text-gray-800">Total:</h3>
							<h3 className="text-lg font-bold text-gray-800">
								${totalAmount}
							</h3>
						</div>

						{/* Checkout Button */}
						<button
							onClick={handleCheckout}
							className="w-full px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center justify-center transition-transform transform hover:scale-105"
						>
							<FaReceipt className="mr-2" />
							Complete Checkout
						</button>
					</div>
				)}
			</div>

			{/* Receipt Modal */}
			{showReceipt && receiptData && (
				<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
					<div className="bg-white rounded-lg shadow-2xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
						<div className="flex justify-between items-center mb-4">
							<h2 className="text-2xl font-bold">Receipt</h2>
							<button 
								onClick={() => setShowReceipt(false)}
								className="text-gray-500 hover:text-gray-700 focus:outline-none"
							>
								×
							</button>
						</div>
						
						{/* Receipt Content */}
						<div 
							ref={receiptRef}
							className="receipt bg-white p-4 border border-gray-200 rounded mb-4"
						>
							<div className="receipt-header text-center mb-4">
								<h3 className="text-xl font-bold">{receiptData.businessName}</h3>
								<p className="text-sm text-gray-600">Receipt #{receiptData.id}</p>
								<p className="text-sm text-gray-600">{receiptData.date} at {receiptData.time}</p>
							</div>
							
							<div className="receipt-body">
								<div className="mb-2 pb-2 border-b border-gray-300">
									<div className="flex justify-between font-semibold">
										<span>Item</span>
										<span>Price</span>
									</div>
								</div>
								
								{receiptData.items.map((item, index) => (
									<div key={index} className="flex justify-between py-1">
										<span>{item.name}</span>
										<span>${item.price}</span>
									</div>
								))}
								
								<div className="mt-4 pt-2 border-t border-gray-300">
									<div className="flex justify-between font-bold">
										<span>Total</span>
										<span>${receiptData.total}</span>
									</div>
									<div className="flex justify-between text-sm text-gray-600 mt-2">
										<span>Payment Method</span>
										<span>{receiptData.paymentMethod}</span>
									</div>
								</div>
								
								<div className="mt-6 text-center text-sm text-gray-500">
									<p>Thank you for your business!</p>
								</div>
							</div>
						</div>
						
						{/* Action Buttons */}
						<div className="grid grid-cols-4 gap-2 mb-4">
							<button 
								onClick={handlePrintReceipt}
								className="flex items-center justify-center px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
							>
								<FaPrint className="mr-1" /> Print
							</button>
							<button 
								onClick={handleDownloadReceipt}
								className="flex items-center justify-center px-3 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
							>
								<FaDownload className="mr-1" /> Save
							</button>
							<button 
								onClick={handleEmailReceipt}
								className="flex items-center justify-center px-3 py-2 bg-green-600 text-white rounded hover:bg-green-700"
							>
								<FaEnvelope className="mr-1" /> Email
							</button>
							<button 
								onClick={previewSimpleReceipt}
								className="flex items-center justify-center px-3 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700"
							>
								<FaReceipt className="mr-1" /> Preview
							</button>
						</div>
						
						<button 
							onClick={handleNewTransaction}
							className="w-full px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
						>
							New Transaction
						</button>
					</div>
				</div>
			)}
		</div>
	);
}
