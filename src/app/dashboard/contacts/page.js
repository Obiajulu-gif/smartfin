"use client";
import { useState } from "react";
import { FaPlus, FaTrashAlt, FaEdit } from "react-icons/fa";

export default function ContactsPage() {
	const [contacts, setContacts] = useState([]);
	const [form, setForm] = useState({
		name: "",
		email: "",
		phone: "",
		company: "",
	});
	const [editingIndex, setEditingIndex] = useState(null);

	// Handle form input change
	const handleChange = (e) => {
		setForm({ ...form, [e.target.name]: e.target.value });
	};

	// Add or edit a contact
	const handleSubmit = (e) => {
		e.preventDefault();
		if (editingIndex !== null) {
			// Editing an existing contact
			const updatedContacts = [...contacts];
			updatedContacts[editingIndex] = form;
			setContacts(updatedContacts);
			setEditingIndex(null);
		} else {
			// Adding a new contact
			setContacts([...contacts, form]);
		}
		setForm({ name: "", email: "", phone: "", company: "" });
	};

	// Handle contact deletion
	const handleDelete = (index) => {
		const updatedContacts = contacts.filter((_, i) => i !== index);
		setContacts(updatedContacts);
	};

	// Handle contact edit
	const handleEdit = (index) => {
		setForm(contacts[index]);
		setEditingIndex(index);
	};

	return (
		<div className="container mx-auto p-8">
			<h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
				Manage Contacts
			</h1>

			{/* Contact Form */}
			<div className="bg-white p-6 rounded-lg shadow-md max-w-xl mx-auto">
				<h2 className="text-2xl font-bold mb-4">
					{editingIndex !== null ? "Edit Contact" : "Add Contact"}
				</h2>
				<form onSubmit={handleSubmit} className="space-y-4">
					<input
						type="text"
						name="name"
						placeholder="Name"
						value={form.name}
						onChange={handleChange}
						className="w-full p-3 border border-gray-300 rounded-lg"
						required
					/>
					<input
						type="email"
						name="email"
						placeholder="Email"
						value={form.email}
						onChange={handleChange}
						className="w-full p-3 border border-gray-300 rounded-lg"
						required
					/>
					<input
						type="text"
						name="phone"
						placeholder="Phone Number"
						value={form.phone}
						onChange={handleChange}
						className="w-full p-3 border border-gray-300 rounded-lg"
						required
					/>
					<input
						type="text"
						name="company"
						placeholder="Company"
						value={form.company}
						onChange={handleChange}
						className="w-full p-3 border border-gray-300 rounded-lg"
						required
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
						{editingIndex !== null ? "Update Contact" : "Add Contact"}
					</button>
				</form>
			</div>

			{/* Contact List */}
			<div className="mt-8 max-w-4xl mx-auto">
				<h2 className="text-xl font-bold mb-4">Contact List</h2>
				{contacts.length === 0 ? (
					<p className="text-gray-500 text-center">No contacts added yet.</p>
				) : (
					<ul className="space-y-4">
						{contacts.map((contact, index) => (
							<li
								key={index}
								className="bg-white p-4 rounded-lg shadow-md flex justify-between items-center"
							>
								<div>
									<h3 className="text-lg font-bold">{contact.name}</h3>
									<p className="text-sm text-gray-600">{contact.company}</p>
									<p className="text-sm text-gray-600">{contact.email}</p>
									<p className="text-sm text-gray-600">{contact.phone}</p>
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
