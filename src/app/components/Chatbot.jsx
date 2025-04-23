"use client";
import { useState, useEffect, useCallback, useRef } from "react";
import { AiOutlineSend, AiOutlineLoading3Quarters } from "react-icons/ai";
import { FaTrash, FaRobot, FaUser, FaCopy, FaInfoCircle } from "react-icons/fa";
import { MdRefresh, MdContentCopy, MdCheck } from "react-icons/md";
import { LuBrain } from "react-icons/lu";

export default function Chatbot() {
	const [messages, setMessages] = useState([]);
	const [input, setInput] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [typingMessage, setTypingMessage] = useState("");
	const [isLoadingHistory, setIsLoadingHistory] = useState(false);
	const [userId, setUserId] = useState(null);
	const [isAuthenticated, setIsAuthenticated] = useState(false);
	const [showSuggestions, setShowSuggestions] = useState(true);
	const [copiedIndex, setCopiedIndex] = useState(null);
	const messagesEndRef = useRef(null);
	const inputRef = useRef(null);
	
	// Default suggestions to help users get started
	const defaultSuggestions = [
		"How much did I spend last month?",
		"What are my top spending categories?",
		"Give me a savings plan for the next 3 months",
		"How can I reduce my monthly expenses?",
	];
	
	// Scroll to bottom when messages change
	const scrollToBottom = () => {
		messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
	};
	
	useEffect(() => {
		scrollToBottom();
	}, [messages, typingMessage]);
	
	// Check authentication status and get userId from localStorage
	useEffect(() => {
		const checkAuth = () => {
			// Log available localStorage items for debugging
			console.log("localStorage keys:", Object.keys(localStorage));
			
			const userSession = localStorage.getItem("userSession");
			const localId = localStorage.getItem("localId");
			const idToken = localStorage.getItem("idToken");
			
			console.log("Auth check - userSession:", !!userSession);
			console.log("Auth check - localId:", localId);
			console.log("Auth check - idToken:", !!idToken);
			
			if (userSession && localId) {
				setIsAuthenticated(true);
				setUserId(localId);
				console.log("User authenticated with ID:", localId);
			} else {
				// Try to get Firebase Auth UID as a fallback
				if (idToken && !localId) {
					// If we have an idToken but no localId, let's try to use idToken
					console.log("Using idToken as fallback authentication");
					setIsAuthenticated(true);
					// Try to extract user ID from Firebase token if possible
					try {
						// This is a simplistic approach - in production you'd verify the token
						const base64Url = idToken.split('.')[1];
						const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
						const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
							return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
						}).join(''));
						
						const payload = JSON.parse(jsonPayload);
						if (payload.user_id || payload.sub) {
							const firebaseUserId = payload.user_id || payload.sub;
							console.log("Extracted user ID from token:", firebaseUserId);
							setUserId(firebaseUserId);
						}
					} catch (e) {
						console.error("Failed to extract user ID from token:", e);
						setIsAuthenticated(false);
					}
				} else {
					setIsAuthenticated(false);
					setUserId(null);
					console.log("User not authenticated");
				}
			}
		};
		
		checkAuth();
		
		// Set up event listener for storage changes
		window.addEventListener("storage", checkAuth);
		
		return () => {
			window.removeEventListener("storage", checkAuth);
		};
	}, []);
	
	// Load conversation history when component mounts and user is authenticated
	useEffect(() => {
		if (isAuthenticated && userId) {
			console.log("Loading conversation history for user:", userId);
			loadConversationHistory();
		}
	}, [isAuthenticated, userId]);
	
	// Function to load conversation history
	const loadConversationHistory = async () => {
		if (!userId) return;
		
		setIsLoadingHistory(true);
		try {
			console.log("Fetching conversation history from API for user:", userId);
			const response = await fetch(`/api/conversation/${userId}`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ 
					operation: "history"
				}),
			});
			
			const data = await response.json();
			console.log("Conversation history response:", data);
			
			if (data.messages && Array.isArray(data.messages)) {
				// Process any markdown in the messages
				const processedMessages = data.messages.map(msg => ({
					...msg,
					content: msg.role === 'assistant' ? convertMarkdownToPlainText(msg.content) : msg.content
				}));
				setMessages(processedMessages);
				setShowSuggestions(processedMessages.length === 0);
			} else {
				// If no messages were returned or invalid format, set empty messages
				setMessages([]);
				setShowSuggestions(true);
			}
		} catch (error) {
			console.error("Error loading conversation history:", error);
			// On error, ensure we don't block the UI
			setMessages([]);
			setShowSuggestions(true);
		} finally {
			setIsLoadingHistory(false);
		}
	};
	
	// Function to clear conversation history
	const clearConversationHistory = async () => {
		if (!userId || !window.confirm("Are you sure you want to clear your conversation history?")) return;
		
		try {
			console.log("Clearing conversation history for user:", userId);
			const response = await fetch(`/api/conversation/${userId}`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ 
					operation: "clear"
				}),
			});
			
			const data = await response.json();
			if (response.ok && data.success) {
				setMessages([]);
				setShowSuggestions(true);
				console.log("Conversation history cleared successfully");
			} else {
				console.error("Failed to clear conversation history:", data.error);
			}
		} catch (error) {
			console.error("Error clearing conversation history:", error);
		}
	};

	const sendMessage = async (messageText = input.trim()) => {
		if (messageText === "" || !userId) return;
		
		const newMessage = { role: "user", content: messageText, timestamp: new Date() };
		setMessages((prev) => [...prev, newMessage]);
		setInput("");
		setIsLoading(true);
		setShowSuggestions(false);

		try {
			console.log("Sending message to API for user:", userId);
			const response = await fetch(`/api/conversation/${userId}`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ 
					message: messageText,
					operation: "message"
				}),
			});
			const data = await response.json();
			console.log("API response:", data);

			// According to API documentation, only use the 'response' field
			if (data.response) {
				// Convert any markdown in the response to plain text
				const plainTextResponse = convertMarkdownToPlainText(data.response);
				// Initialize the fast streaming effect for AI's response
				await fastStreamText(plainTextResponse);
			} else if (data.error) {
				console.error("API returned error:", data.error);
				await fastStreamText(`Error: ${data.error}`);
			}
		} catch (error) {
			console.error("Error sending message:", error);
			await fastStreamText("Sorry, there was an error connecting to the financial assistant.");
		} finally {
			setIsLoading(false);
			// Focus the input field after sending a message
			inputRef.current?.focus();
		}
	};

	// Function to handle suggestion click
	const handleSuggestionClick = (suggestion) => {
		sendMessage(suggestion);
	};

	// Function to copy message to clipboard
	const copyToClipboard = (text, index) => {
		navigator.clipboard.writeText(text).then(() => {
			setCopiedIndex(index);
			setTimeout(() => setCopiedIndex(null), 2000);
		});
	};

	// Function to convert markdown to plain text
	const convertMarkdownToPlainText = (markdown) => {
		if (!markdown) return '';
		
		// Replace markdown headings (# Heading) with plain text
		let text = markdown.replace(/#{1,6}\s+([^\n]+)/g, '$1\n');
		
		// Replace markdown bold (**text** or __text__) with plain text
		text = text.replace(/(\*\*|__)(.*?)\1/g, '$2');
		
		// Replace markdown italic (*text* or _text_) with plain text
		text = text.replace(/(\*|_)(.*?)\1/g, '$2');
		
		// Replace markdown links [text](url) with just the text
		text = text.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1');
		
		// Replace markdown code blocks (```...```) with plain text
		text = text.replace(/```[^`]*```/g, (match) => {
			return match.replace(/```([\s\S]*?)```/g, '$1').trim();
		});
		
		// Replace markdown inline code (`code`) with plain text
		text = text.replace(/`([^`]+)`/g, '$1');
		
		// Replace markdown lists (- item or * item or 1. item) with plain text
		text = text.replace(/^(\s*)([-*+]|\d+\.)\s+/gm, '$1');
		
		// Replace markdown blockquotes (> text) with plain text
		text = text.replace(/^\s*>\s+/gm, '');
		
		// Remove extra line breaks
		text = text.replace(/\n\n+/g, '\n\n');
		
		return text.trim();
	};

	// Fast streaming effect that runs asynchronously
	const fastStreamText = useCallback(async (text) => {
		// Clear any existing typing message
		setTypingMessage("");
		
		// Define chunk size - increase for faster streaming
		const chunkSize = 5; // Process 5 characters at a time
		
		return new Promise((resolve) => {
			let position = 0;
			
			// Use requestAnimationFrame for smoother UI updates
			const nextChunk = () => {
				if (position < text.length) {
					const end = Math.min(position + chunkSize, text.length);
					const chunk = text.substring(position, end);
					
					// Update the typing message with the next chunk
					setTypingMessage(prev => prev + chunk);
					position = end;
					
					// Schedule the next chunk using requestAnimationFrame
					requestAnimationFrame(nextChunk);
				} else {
					// We've finished displaying the text, add it to messages
					setMessages(prev => [...prev, { role: "assistant", content: text, timestamp: new Date() }]);
					setTypingMessage(""); // Clear the typing message
					resolve(); // Resolve the promise
				}
			};
			
			// Start the streaming process
			nextChunk();
		});
	}, []);
	
	// Format timestamp for display
	const formatTimestamp = (timestamp) => {
		if (!timestamp) return '';
		const date = new Date(timestamp);
		return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
	};

	// Function to handle newlines in messages for display
	const formatMessageText = (text) => {
		return text.split('\n').map((line, i) => (
			<span key={i}>
				{line}
				{i < text.split('\n').length - 1 && <br />}
			</span>
		));
	};

	return (
		<div className="flex flex-col rounded-xl bg-white shadow-xl border border-gray-200 max-w-md w-full mx-auto overflow-hidden">
			{/* Header */}
			<div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-4 flex justify-between items-center">
				<div className="flex items-center space-x-2">
					<LuBrain className="text-white text-xl" />
					<h2 className="text-lg font-bold text-white">Financial Assistant</h2>
				</div>
				
				<div className="flex space-x-2">
					{messages.length > 0 && (
					<button
						onClick={clearConversationHistory}
							className="text-white opacity-80 hover:opacity-100 transition-opacity p-1 rounded hover:bg-indigo-700/30"
						title="Clear conversation history"
					>
						<FaTrash />
					</button>
				)}
					<button
						onClick={loadConversationHistory}
						className="text-white opacity-80 hover:opacity-100 transition-opacity p-1 rounded hover:bg-indigo-700/30"
						title="Refresh conversation"
						disabled={isLoadingHistory}
					>
						<MdRefresh className={isLoadingHistory ? "animate-spin" : ""} />
					</button>
				</div>
			</div>
			
			{/* Authentication status */}
			{!isAuthenticated && (
				<div className="w-full p-3 bg-amber-50 text-amber-800 border-b border-amber-200 flex items-center space-x-2">
					<FaInfoCircle className="text-amber-500 flex-shrink-0" />
					<span className="text-sm">Please log in to use the financial assistant</span>
				</div>
			)}
			
			{/* Loading history message */}
			{isLoadingHistory && (
				<div className="w-full p-2 bg-blue-50 text-blue-600 border-b border-blue-100 flex justify-center items-center">
					<AiOutlineLoading3Quarters className="animate-spin mr-2" />
					<span className="text-sm">Loading your conversation history...</span>
				</div>
			)}

			{/* Messages container */}
			<div className="flex flex-col p-4 space-y-4 bg-gray-50 overflow-y-auto h-96 sm:h-[450px]">
				{messages.length === 0 && !isLoadingHistory && (
					<div className="flex flex-col items-center justify-center h-full space-y-6 py-6">
						<div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center">
							<FaRobot className="text-indigo-600 text-2xl" />
						</div>
						<div className="text-center space-y-2">
							<h3 className="text-lg font-semibold text-gray-800">SmartFin AI Assistant</h3>
							<p className="text-gray-500 text-sm max-w-xs">
								Your personal financial advisor. Ask me anything about your finances, budgeting, or financial goals.
							</p>
						</div>
					</div>
				)}
				
				{/* Message bubbles */}
				{messages.map((msg, index) => (
					<div
						key={`${index}-${msg.timestamp}`}
						className={`flex ${
							msg.role === "user" ? "justify-end" : "justify-start"
						} group fade-in`}
					>
						<div className="flex items-start max-w-[85%]">
							{msg.role !== "user" && (
								<div className="w-8 h-8 rounded-full bg-indigo-100 flex-shrink-0 flex items-center justify-center mr-2 mt-1">
									<FaRobot className="text-indigo-600 text-sm" />
								</div>
							)}
							
							<div>
								<div
									className={`p-3 rounded-2xl break-words ${
								msg.role === "user"
											? "bg-indigo-600 text-white rounded-tr-none shadow-sm"
											: "bg-white text-gray-800 rounded-tl-none border border-gray-200 shadow-sm"
							}`}
						>
									{formatMessageText(msg.content)}
								</div>
								
								<div className="flex items-center mt-1 space-x-2">
							{msg.timestamp && (
										<div className={`text-xs ${msg.role === "user" ? "text-gray-500 text-right ml-auto" : "text-gray-500"}`}>
									{formatTimestamp(msg.timestamp)}
										</div>
									)}
									
									{/* Copy button - only for assistant messages */}
									{msg.role === "assistant" && (
										<button 
											onClick={() => copyToClipboard(msg.content, index)} 
											className="opacity-0 group-hover:opacity-100 transition-opacity text-gray-400 hover:text-gray-600"
											title="Copy to clipboard"
										>
											{copiedIndex === index ? <MdCheck className="text-green-500" /> : <MdContentCopy size={14} />}
										</button>
									)}
								</div>
							</div>
							
							{msg.role === "user" && (
								<div className="w-8 h-8 rounded-full bg-indigo-100 flex-shrink-0 flex items-center justify-center ml-2 mt-1">
									<FaUser className="text-indigo-600 text-sm" />
								</div>
							)}
						</div>
					</div>
				))}
				
				{/* Typing indicator */}
				{typingMessage && (
					<div className="flex justify-start items-start fade-in">
						<div className="w-8 h-8 rounded-full bg-indigo-100 flex-shrink-0 flex items-center justify-center mr-2 mt-1">
							<FaRobot className="text-indigo-600 text-sm" />
						</div>
						<div>
							<div className="bg-white text-gray-800 p-3 rounded-2xl rounded-tl-none break-words border border-gray-200 shadow-sm max-w-[300px]">
								{formatMessageText(typingMessage)}
							</div>
							<div className="text-xs text-gray-500 mt-1">
								Typing...
							</div>
						</div>
					</div>
				)}
				
				{/* Traditional loading indicator */}
				{isLoading && !typingMessage && (
					<div className="flex justify-start fade-in">
						<div className="w-8 h-8 rounded-full bg-indigo-100 flex-shrink-0 flex items-center justify-center mr-2 mt-1">
							<FaRobot className="text-indigo-600 text-sm" />
						</div>
						<div className="bg-white p-3 rounded-2xl rounded-tl-none inline-block">
							<div className="flex space-x-2">
								<div className="w-2 h-2 rounded-full bg-indigo-400 animate-bounce" style={{ animationDelay: "0ms" }}></div>
								<div className="w-2 h-2 rounded-full bg-indigo-400 animate-bounce" style={{ animationDelay: "150ms" }}></div>
								<div className="w-2 h-2 rounded-full bg-indigo-400 animate-bounce" style={{ animationDelay: "300ms" }}></div>
							</div>
						</div>
					</div>
				)}
				
				{/* Quick suggestions */}
				{showSuggestions && isAuthenticated && !isLoading && messages.length === 0 && (
					<div className="mt-auto fade-in-delay">
						<div className="text-sm text-gray-600 mb-2">Try asking about:</div>
						<div className="grid grid-cols-1 gap-2">
							{defaultSuggestions.map((suggestion, index) => (
								<button
									key={index}
									className="bg-white text-left px-4 py-3 rounded-lg border border-gray-200 hover:bg-indigo-50 hover:border-indigo-200 transition-colors text-gray-700 text-sm shadow-sm hover:shadow"
									onClick={() => handleSuggestionClick(suggestion)}
								>
									{suggestion}
								</button>
							))}
						</div>
					</div>
				)}
				
				{/* Invisible element to scroll to */}
				<div ref={messagesEndRef} />
			</div>

			{/* Input area */}
			<div className="p-4 border-t border-gray-200 bg-white">
				<div className="relative flex items-center">
				<input
						ref={inputRef}
					type="text"
						className="flex-grow border border-gray-300 p-3 pr-12 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-300 bg-gray-50 placeholder-gray-400"
					value={input}
					onChange={(e) => setInput(e.target.value)}
						placeholder={isAuthenticated ? "Ask about your finances..." : "Please log in to chat..."}
						onKeyDown={(e) => e.key === "Enter" && !isLoading && sendMessage()}
						disabled={isLoading || !isAuthenticated}
				/>
				<button
						onClick={() => sendMessage()}
						disabled={isLoading || !input.trim() || !isAuthenticated}
						className="absolute right-2 bg-indigo-600 text-white p-2 rounded-full hover:bg-indigo-700 disabled:opacity-50 disabled:hover:bg-indigo-600 transition-colors"
						aria-label="Send message"
				>
					{isLoading ? (
							<AiOutlineLoading3Quarters className="animate-spin text-lg" />
					) : (
							<AiOutlineSend className="text-lg" />
						)}
				</button>
				</div>
				<div className="text-xs text-center text-gray-500 mt-2">
					Your financial data is being used to provide personalized advice
				</div>
			</div>
			
			{/* Add CSS animations instead of framer-motion */}
			<style jsx global>{`
				@keyframes fadeIn {
					from { opacity: 0; transform: translateY(20px); }
					to { opacity: 1; transform: translateY(0); }
				}
				
				@keyframes fadeInDelay {
					0% { opacity: 0; transform: translateY(20px); }
					50% { opacity: 0; transform: translateY(20px); }
					100% { opacity: 1; transform: translateY(0); }
				}
				
				.fade-in {
					animation: fadeIn 0.3s ease-out forwards;
				}
				
				.fade-in-delay {
					animation: fadeInDelay 0.6s ease-out forwards;
				}
			`}</style>
		</div>
	);
}
