"use client";
import { useState } from "react";
import { FaPaperPlane, FaReply } from "react-icons/fa";

const MessagesPage = () => {
	const [messages, setMessages] = useState([
		{
			id: 1,
			sender: "John Doe",
			message: "Hey, I have a question about the pricing for your services.",
			timestamp: "2023-10-18 12:45 PM",
		},
		{
			id: 2,
			sender: "Jane Smith",
			message: "Can you help me with tracking my expenses using SmartFin?",
			timestamp: "2023-10-18 1:15 PM",
		},
	]);

	const [reply, setReply] = useState("");
	const [selectedMessage, setSelectedMessage] = useState(null);

	const handleReply = (e) => {
		e.preventDefault();
		if (selectedMessage) {
			// Simulate sending reply (can be integrated with backend logic)
			alert(`Reply sent to ${selectedMessage.sender}: ${reply}`);
			setReply("");
			setSelectedMessage(null); // Reset after reply
		}
	};

	const selectMessage = (message) => {
		setSelectedMessage(message);
		setReply(""); // Clear reply input
	};

	return (
		<div className="container mx-auto p-8 min-h-screen">
			<h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
				Messages
			</h1>

			<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
				{/* Messages List */}
				<div className="bg-white p-6 rounded-lg shadow-lg">
					<h2 className="text-xl font-semibold text-gray-800 mb-4">Inbox</h2>
					<ul className="space-y-4">
						{messages.map((message) => (
							<li
								key={message.id}
								className={`p-4 border rounded-lg cursor-pointer transition-transform transform hover:scale-105 ${
									selectedMessage?.id === message.id
										? "border-indigo-600 bg-indigo-50"
										: "border-gray-300"
								}`}
								onClick={() => selectMessage(message)}
							>
								<h3 className="text-lg font-bold text-gray-700">
									{message.sender}
								</h3>
								<p className="text-gray-600">{message.message}</p>
								<span className="text-xs text-gray-500">
									{message.timestamp}
								</span>
							</li>
						))}
					</ul>
				</div>

				{/* Reply Section */}
				<div className="bg-white p-6 rounded-lg shadow-lg">
					<h2 className="text-xl font-semibold text-gray-800 mb-4">
						{selectedMessage
							? `Reply to ${selectedMessage.sender}`
							: "Select a message to reply"}
					</h2>

					{selectedMessage ? (
						<form onSubmit={handleReply}>
							<textarea
								className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-indigo-300 transition duration-300 ease-in-out mb-4"
								placeholder="Write your reply..."
								value={reply}
								onChange={(e) => setReply(e.target.value)}
								rows="4"
								required
							></textarea>
							<button
								type="submit"
								className="w-full py-3 bg-indigo-600 text-white rounded-lg flex justify-center items-center hover:bg-indigo-700 transition-transform transform hover:scale-105"
							>
								<FaReply className="mr-2" /> Send Reply
							</button>
						</form>
					) : (
						<p className="text-gray-500">Select a message from the inbox to reply.</p>
					)}
				</div>
			</div>
		</div>
	);
};

export default MessagesPage;
