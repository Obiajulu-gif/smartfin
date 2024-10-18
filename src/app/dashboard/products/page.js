"use client";
import { useState } from "react";
import { FaPlus, FaTrashAlt, FaEdit } from "react-icons/fa";

export default function ProductsPage() {
	const [products, setProducts] = useState([]);
	const [form, setForm] = useState({
		name: "",
		price: "",
		category: "",
		description: "",
	});
	const [editingIndex, setEditingIndex] = useState(null);

	// Handle form input change
	const handleChange = (e) => {
		setForm({ ...form, [e.target.name]: e.target.value });
	};

	// Add or edit a product
	const handleSubmit = (e) => {
		e.preventDefault();
		if (editingIndex !== null) {
			// Editing an existing product
			const updatedProducts = [...products];
			updatedProducts[editingIndex] = form;
			setProducts(updatedProducts);
			setEditingIndex(null);
		} else {
			// Adding a new product
			setProducts([...products, form]);
		}
		setForm({ name: "", price: "", category: "", description: "" });
	};

	// Handle product deletion
	const handleDelete = (index) => {
		const updatedProducts = products.filter((_, i) => i !== index);
		setProducts(updatedProducts);
	};

	// Handle product edit
	const handleEdit = (index) => {
		setForm(products[index]);
		setEditingIndex(index);
	};

	return (
		<div className="container mx-auto p-8">
			<h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
				Manage Products & Services
			</h1>

			{/* Product Form */}
			<div className="bg-white p-6 rounded-lg shadow-md max-w-xl mx-auto">
				<h2 className="text-2xl font-bold mb-4">
					{editingIndex !== null ? "Edit Product" : "Add Product"}
				</h2>
				<form onSubmit={handleSubmit} className="space-y-4">
					<input
						type="text"
						name="name"
						placeholder="Product Name"
						value={form.name}
						onChange={handleChange}
						className="w-full p-3 border border-gray-300 rounded-lg"
						required
					/>
					<input
						type="text"
						name="price"
						placeholder="Price"
						value={form.price}
						onChange={handleChange}
						className="w-full p-3 border border-gray-300 rounded-lg"
						required
					/>
					<input
						type="text"
						name="category"
						placeholder="Category"
						value={form.category}
						onChange={handleChange}
						className="w-full p-3 border border-gray-300 rounded-lg"
						required
					/>
					<textarea
						name="description"
						placeholder="Description"
						value={form.description}
						onChange={handleChange}
						className="w-full p-3 border border-gray-300 rounded-lg"
					/>
					<button
						type="submit"
						className="w-full bg-indigo-500 text-white py-3 rounded-lg flex items-center justify-center hover:bg-indigo-600 transition-colors"
					>
						{editingIndex !== null ? (
							<FaEdit className="mr-2" />
						) : (
							<FaPlus className="mr-2" />
						)}
						{editingIndex !== null ? "Update Product" : "Add Product"}
					</button>
				</form>
			</div>

			{/* Product List */}
			<div className="mt-8 max-w-4xl mx-auto">
				<h2 className="text-xl font-bold mb-4">Products & Services List</h2>
				{products.length === 0 ? (
					<p className="text-gray-500 text-center">
						No products or services added yet.
					</p>
				) : (
					<ul className="space-y-4">
						{products.map((product, index) => (
							<li
								key={index}
								className="bg-white p-4 rounded-lg shadow-md flex justify-between items-center"
							>
								<div>
									<h3 className="text-lg font-bold">{product.name}</h3>
									<p className="text-sm text-gray-600">{product.category}</p>
									<p className="text-sm text-gray-600">${product.price}</p>
									<p className="text-sm text-gray-600">{product.description}</p>
								</div>
								<div className="flex space-x-4">
									<button
										onClick={() => handleEdit(index)}
										className="bg-yellow-400 text-white p-2 rounded-lg hover:bg-yellow-500"
									>
										<FaEdit />
									</button>
									<button
										onClick={() => handleDelete(index)}
										className="bg-red-500 text-white p-2 rounded-lg hover:bg-red-600"
									>
										<FaTrashAlt />
									</button>
								</div>
							</li>
						))}
					</ul>
				)}
			</div>
		</div>
	);
}
