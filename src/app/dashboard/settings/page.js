"use client";
import { useState } from "react";
import { FaUser, FaBell, FaLock, FaTrash, FaSave } from "react-icons/fa";

const SettingsPage = () => {
	const [profile, setProfile] = useState({
		fullName: "John Doe",
		email: "john.doe@example.com",
		password: "",
	});
	const [notifications, setNotifications] = useState(true);
	const [accountDeletion, setAccountDeletion] = useState(false);
	const [passwordUpdated, setPasswordUpdated] = useState(false);

	const handleInputChange = (e) => {
		setProfile({
			...profile,
			[e.target.name]: e.target.value,
		});
	};

	const handleSaveProfile = (e) => {
		e.preventDefault();
		alert("Profile saved successfully!"); // Simulate save action
	};

	const handlePasswordUpdate = (e) => {
		e.preventDefault();
		setPasswordUpdated(true);
	};

	const handleAccountDeletion = () => {
		setAccountDeletion(true);
		alert("Account deletion request submitted."); // Simulate account deletion
	};

	return (
		<div className="container mx-auto p-8 min-h-screen">
			<h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
				Settings
			</h1>

			<div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
				{/* Profile Section */}
				<div className="bg-white p-6 rounded-lg shadow-lg">
					<h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
						<FaUser className="mr-2 text-indigo-600" /> Profile Settings
					</h2>

					<form onSubmit={handleSaveProfile} className="space-y-4">
						<div>
							<label className="block text-sm font-medium text-gray-600 mb-2">
								Full Name
							</label>
							<input
								type="text"
								name="fullName"
								value={profile.fullName}
								onChange={handleInputChange}
								className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-indigo-300 transition duration-300"
								required
							/>
						</div>
						<div>
							<label className="block text-sm font-medium text-gray-600 mb-2">
								Email
							</label>
							<input
								type="email"
								name="email"
								value={profile.email}
								onChange={handleInputChange}
								className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-indigo-300 transition duration-300"
								required
							/>
						</div>
						<button
							type="submit"
							className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition-transform transform hover:scale-105"
						>
							<FaSave className="flex items-center" /> Save Profile
						</button>
					</form>
				</div>

				{/* Notifications Section */}
				<div className="bg-white p-6 rounded-lg shadow-lg">
					<h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
						<FaBell className="mr-2 text-indigo-600" /> Notification Settings
					</h2>

					<div className="flex items-center mb-4">
						<input
							type="checkbox"
							checked={notifications}
							onChange={() => setNotifications(!notifications)}
							className="h-5 w-5 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
						/>
						<label className="ml-3 text-sm text-gray-600">
							Receive email notifications
						</label>
					</div>
				</div>

				{/* Password Section */}
				<div className="bg-white p-6 rounded-lg shadow-lg">
					<h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
						<FaLock className="mr-2 text-indigo-600" /> Update Password
					</h2>

					<form onSubmit={handlePasswordUpdate} className="space-y-4">
						<div>
							<label className="block text-sm font-medium text-gray-600 mb-2">
								New Password
							</label>
							<input
								type="password"
								name="password"
								value={profile.password}
								onChange={handleInputChange}
								className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-indigo-300 transition duration-300"
								required
							/>
						</div>
						<button
							type="submit"
							className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition-transform transform hover:scale-105"
						>
							{passwordUpdated ? "Password Updated" : "Update Password"}
						</button>
					</form>
				</div>

				{/* Account Deletion Section */}
				<div className="bg-white p-6 rounded-lg shadow-lg">
					<h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
						<FaTrash className="mr-2 text-indigo-600" /> Delete Account
					</h2>

					<p className="text-sm text-gray-600 mb-4">
						Warning: Once your account is deleted, it cannot be recovered.
						Please make sure you have downloaded any important data before
						proceeding.
					</p>
					<button
						onClick={handleAccountDeletion}
						className="w-full bg-red-600 text-white py-3 rounded-lg hover:bg-red-700 transition-transform transform hover:scale-105"
					>
						<FaTrash className="mr-2" />{" "}
						{accountDeletion ? "Request Sent" : "Delete Account"}
					</button>
				</div>
			</div>
		</div>
	);
};

export default SettingsPage;
