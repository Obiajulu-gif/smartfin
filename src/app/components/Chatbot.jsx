"use client";
import { useState, useEffect } from "react";
import { AiOutlineSend } from "react-icons/ai";

export default function Chatbot() {
	const [messages, setMessages] = useState([]);
	const [input, setInput] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [typingMessage, setTypingMessage] = useState("");
	const [userId, setUserId] = useState("");
	const [chatHistory, setChatHistory] = useState([]);

	useEffect(() => {
		// Get the user ID from localStorage or generate a default one
		const storedUserId =
			localStorage.getItem("userId") || "QOJkQvNN3PdiHtuXTSR1l2fWwxj2"; // Default user ID
		setUserId(storedUserId);

		// Load chat history if available
		const storedMessages = localStorage.getItem("chatMessages");
		if (storedMessages) {
			setMessages(JSON.parse(storedMessages));
		}
	}, []);

	// Save messages to localStorage whenever they change
	useEffect(() => {
		if (messages.length > 0) {
			localStorage.setItem("chatMessages", JSON.stringify(messages));
		}
	}, [messages]);

	const sendMessage = async () => {
		if (input.trim() === "") return;

		const newMessage = { role: "user", content: input };
		setMessages((prev) => [...prev, newMessage]);
		setInput("");
		setIsLoading(true);

		const userMessage = input.trim();

		try {
			// First attempt with Smartfin AI API
			const response = await fetch(
				`https://smartfin-ai-api.onrender.com/api/v1/conversation/${userId}`,
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({ message: userMessage }),
				}
			);

			const data = await response.json();

			// If Smartfin AI API successfully processed the request
			if (data.success && data.response) {
				// Initialize the typewriter effect for AI's response
				typewriterEffect(data.response);
				// Update chat history
				setChatHistory(data.messages || []);
			} else {
				// Fallback to Nebula API if Smartfin API fails
				try {
					const fallbackResponse = await fetch(
						`https://nebula-agent.onrender.com/api/conversation/${userId}`,
						{
							method: "POST",
							headers: {
								"Content-Type": "application/json",
							},
							body: JSON.stringify({ message: userMessage }),
						}
					);

					const fallbackData = await fallbackResponse.json();

					if (fallbackData.success && fallbackData.response) {
						typewriterEffect(fallbackData.response);
					} else {
						// If both APIs fail, use a default message
						typewriterEffect(
							"I'm sorry, I couldn't process your request at the moment. Please try again later."
						);
					}
				} catch (fallbackError) {
					console.error("Fallback API Error:", fallbackError);
					typewriterEffect(
						"I'm sorry, I couldn't process your request at the moment. Please try again later."
					);
				}
			}
		} catch (error) {
			console.error("Primary API Error:", error);

			// Attempt with Nebula API as fallback
			try {
				const fallbackResponse = await fetch(
					`https://nebula-agent.onrender.com/api/conversation/${userId}`,
					{
						method: "POST",
						headers: {
							"Content-Type": "application/json",
						},
						body: JSON.stringify({ message: userMessage }),
					}
				);

				const fallbackData = await fallbackResponse.json();

				if (fallbackData.success && fallbackData.response) {
					typewriterEffect(fallbackData.response);
				} else {
					typewriterEffect(
						"I'm sorry, I couldn't process your request at the moment. Please try again later."
					);
				}
			} catch (fallbackError) {
				console.error("Fallback API Error:", fallbackError);
				typewriterEffect(
					"I'm sorry, I couldn't process your request at the moment. Please try again later."
				);
			}
		} finally {
			setIsLoading(false);
		}
	};

	// Typewriter effect for AI's response
	const typewriterEffect = (text) => {
		let index = 0;
		setTypingMessage("");
		const interval = setInterval(() => {
			setTypingMessage((prev) => prev + text.charAt(index));
			index++;
			if (index === text.length) {
				clearInterval(interval);
				setMessages((prev) => [...prev, { role: "assistant", content: text }]);
				setTypingMessage(""); // Clear the typing message once completed
			}
		}, 30); // Adjust speed for typewriter effect
	};
	const clearConversation = async () => {
		// Clear local messages
		setMessages([]);
		localStorage.removeItem("chatMessages");

		// Attempt to clear conversation on both APIs
		try {
			// Clear Smartfin API conversation
			await fetch(
				`https://smartfin-ai-api.onrender.com/api/v1/conversation/${userId}`,
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({ operation: "clear" }),
				}
			);

			// Clear Nebula API conversation
			await fetch(
				`https://nebula-agent.onrender.com/api/conversation/${userId}`,
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({ operation: "clear" }),
				}
			);
		} catch (error) {
			console.error("Error clearing conversation history:", error);
		}
	};

	return (
		<div className="flex flex-col items-center p-2 space-y-2 bg-white shadow-lg rounded-lg max-w-md w-full mx-auto my-2 sm:my-2">
			<div className="flex items-center justify-between w-full px-2">
				<h2 className="text-2xl font-bold text-indigo-600">AI Chatbot</h2>
				<button
					onClick={clearConversation}
					className="text-sm bg-gray-200 hover:bg-gray-300 text-gray-700 px-2 py-1 rounded"
				>
					Clear Chat
				</button>
			</div>

			<div className="flex flex-col space-y-2 w-full bg-gray-100 p-4 rounded-lg overflow-y-auto h-80 sm:h-96">
				{messages.map((msg, index) => (
					<div
						key={index}
						className={`flex ${
							msg.role === "user" ? "justify-end" : "justify-start"
						}`}
					>
						<div
							className={`max-w-xs sm:max-w-sm lg:max-w-md break-words p-3 rounded-lg ${
								msg.role === "user"
									? "bg-indigo-500 text-white"
									: "bg-gray-300 text-gray-800"
							}`}
						>
							{msg.content}
						</div>
					</div>
				))}
				{typingMessage && (
					<div className="flex justify-start">
						<div className="bg-gray-300 text-gray-800 p-3 rounded-lg inline-block">
							{typingMessage}
						</div>
					</div>
				)}
				{isLoading && !typingMessage && (
					<div className="flex justify-start">
						<div className="bg-gray-300 text-gray-800 p-3 rounded-lg inline-block animate-pulse">
							Typing...
						</div>
					</div>
				)}
			</div>

			<div className="flex space-x-2 w-full">
				<input
					type="text"
					className="flex-grow border p-2 rounded-lg focus:outline-none focus:ring focus:border-indigo-300"
					value={input}
					onChange={(e) => setInput(e.target.value)}
					placeholder="Type your message..."
					onKeyDown={(e) => e.key === "Enter" && sendMessage()}
				/>
				<button
					onClick={sendMessage}
					disabled={isLoading}
					className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-500 disabled:opacity-50"
				>
					{isLoading ? (
						<div className="animate-spin">...</div>
					) : (
						<AiOutlineSend className="text-2xl" />
					)}{" "}
				</button>
			</div>
		</div>
	);
}
