"use client";
import { useEffect, useState } from "react";
import { FaBell, FaRobot, FaTimesCircle } from "react-icons/fa";

const NotificationPage = () => {
	const [notifications, setNotifications] = useState([]);
	const [loading, setLoading] = useState(true);

	// Example function to simulate fetching AI notifications
	const fetchNotifications = async () => {
		// Simulate an API call delay
		setLoading(true);
		setTimeout(() => {
			const aiNotifications = [
				{
					id: 1,
					message: "Your monthly expense report is ready.",
					type: "info",
				},
				{
					id: 2,
					message: "Reminder: Quarterly tax payment due in 3 days.",
					type: "alert",
				},
				{
					id: 3,
					message: "AI suggests increasing savings by 10% this month.",
					type: "insight",
				},
			];
			setNotifications(aiNotifications);
			setLoading(false);
		}, 1500);
	};

	const handleDelete = (id) => {
		const updatedNotifications = notifications.filter(
			(notification) => notification.id !== id
		);
		setNotifications(updatedNotifications);
	};

	useEffect(() => {
		// Fetch AI notifications when the component mounts
		fetchNotifications();
	}, []);

	return (
		<div className="container mx-auto p-8 min-h-screen">
			<h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
				AI Notifications
			</h1>
			<div className="bg-white p-6 rounded-lg shadow-lg">
				{/* Notification List */}
				{loading ? (
					<div className="flex justify-center items-center">
						<FaRobot className="animate-spin text-indigo-500 text-4xl" />
						<span className="ml-4 text-indigo-600 text-xl">
							Fetching AI notifications...
						</span>
					</div>
				) : notifications.length > 0 ? (
					<ul className="space-y-4">
						{notifications.map((notification) => (
							<li
								key={notification.id}
								className={`p-4 border rounded-lg flex items-center justify-between ${
									notification.type === "alert" ? "bg-red-50" : "bg-gray-50"
								}`}
							>
								<div className="flex items-center">
									<FaBell
										className={`mr-3 ${
											notification.type === "alert"
												? "text-red-500"
												: "text-indigo-500"
										}`}
									/>
									<span className="text-gray-800">{notification.message}</span>
								</div>
								<button
									onClick={() => handleDelete(notification.id)}
									className="text-red-500 hover:text-red-700 transition-colors"
								>
									<FaTimesCircle />
								</button>
							</li>
						))}
					</ul>
				) : (
					<p className="text-center text-gray-500">
						No notifications at the moment.
					</p>
				)}
			</div>
		</div>
	);
};

export default NotificationPage;
