"use client"
import { useState } from "react";

export default function Chatbot() {
	const [messages, setMessages] = useState([]);
	const [input, setInput] = useState("");
	const [isLoading, setIsLoading] = useState(false);

	const sendMessage = async () => {
		if (input.trim() === "") return;

		const newMessage = { role: "user", content: input };
		setMessages([...messages, newMessage]);
		setInput("");
		setIsLoading(true);

		try {
			const response = await fetch("/api/chat", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ message: input }),
			});
			const data = await response.json();

			if (data.reply) {
				setMessages([
					...messages,
					newMessage,
					{ role: "assistant", content: data.reply },
				]);
			}
		} catch (error) {
			console.error("Error:", error);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="flex flex-col items-center p-6 space-y-4 bg-white shadow-lg rounded-lg max-w-md mx-auto my-10">
			<h2 className="text-xl font-bold text-indigo-600">AI Chatbot</h2>

			<div className="flex flex-col space-y-2 w-full bg-gray-100 p-4 rounded-lg overflow-y-auto h-64">
				{messages.map((msg, index) => (
					<div
						key={index}
						className={`text-left ${msg.role === "user" ? "text-right" : ""}`}
					>
						<div
							className={`${
								msg.role === "user"
									? "bg-indigo-500 text-white"
									: "bg-gray-300 text-gray-800"
							} p-2 rounded-lg inline-block`}
						>
							{msg.content}
						</div>
					</div>
				))}
			</div>

			<div className="flex space-x-4 w-full">
				<input
					type="text"
					className="flex-grow border p-2 rounded-lg"
					value={input}
					onChange={(e) => setInput(e.target.value)}
					placeholder="Type your message..."
				/>
				<button
					onClick={sendMessage}
					disabled={isLoading}
					className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-500 disabled:opacity-50"
				>
					{isLoading ? "..." : "Send"}
				</button>
			</div>
		</div>
	);
}
