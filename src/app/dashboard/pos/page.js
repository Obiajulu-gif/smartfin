"use client";
import { useState } from "react";
import { FaPlusCircle, FaReceipt, FaCartArrowDown } from "react-icons/fa";

export default function PointOfSalePage() {
	const [selectedProducts, setSelectedProducts] = useState([]);
	const [totalAmount, setTotalAmount] = useState(0);

	const handleAddProduct = (product) => {
		// Add selected product to the list
		setSelectedProducts([...selectedProducts, product]);
		setTotalAmount(totalAmount + product.price);
	};

	const handleRemoveProduct = (index) => {
		const updatedProducts = [...selectedProducts];
		const removedProduct = updatedProducts.splice(index, 1)[0];
		setSelectedProducts(updatedProducts);
		setTotalAmount(totalAmount - removedProduct.price);
	};

	const handleCheckout = () => {
		alert("Checkout complete! Receipt generated.");
		// Here you can integrate backend or payment API logic for handling the checkout process
	};

	const products = [
		{ name: "Product 1", price: 100 },
		{ name: "Product 2", price: 150 },
		{ name: "Product 3", price: 200 },
	];

	return (
		<div className="container mx-auto p-8">
			<h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
				Point of Sale (POS)
			</h1>

			{/* Product Selection */}
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
				{products.map((product, index) => (
					<div
						key={index}
						className="border border-gray-200 rounded-lg shadow-lg p-6 hover:shadow-xl transition-transform transform hover:scale-105 cursor-pointer"
						onClick={() => handleAddProduct(product)}
					>
						<h2 className="text-lg font-semibold text-gray-800">
							{product.name}
						</h2>
						<p className="text-gray-600">Price: ${product.price}</p>
						<button className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg flex items-center justify-center w-full hover:bg-indigo-800 transition-colors">
							<FaPlusCircle className="mr-2" /> Add to Cart
						</button>
					</div>
				))}
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
		</div>
	);
}
