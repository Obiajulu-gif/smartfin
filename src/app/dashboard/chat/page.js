"use client";
import { useState } from "react";
import Chatbot from "../../components/Chatbot";

export default function Chat() {
	const [showInfo, setShowInfo] = useState(false);

	return (
		<div className="min-h-screen bg-gray-50 flex flex-col items-center">
			<div className="w-full max-w-4xl px-4">
				<h1 className="text-3xl font-bold text-indigo-600 mt-6 text-center">
					SmartFin AI Assistant{" "}
				</h1>

				<div className="mt-4 bg-white p-4 rounded-lg shadow mb-6">
					<button
						onClick={() => setShowInfo(!showInfo)}
						className="text-indigo-600 font-medium flex items-center"
					>
						{showInfo ? "Hide Info" : "What can this AI do?"}{" "}
						<svg
							className={`w-5 h-5 ml-1 transform transition-transform ${
								showInfo ? "rotate-180" : ""
							}`}
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth="2"
								d="M19 9l-7 7-7-7"
							/>
						</svg>{" "}
					</button>
					{showInfo && (
						<div className="mt-4 text-sm text-gray-700 space-y-2">
							<p> Our SmartFin AI assistant can help you with: </p>{" "}
							<ul className="list-disc pl-5 space-y-1">
								<li> Analyzing your financial data and transactions </li>{" "}
								<li> Managing contacts and customer information </li>{" "}
								<li> Understanding your expense patterns </li>{" "}
								<li> Providing insights on your business operations </li>{" "}
								<li>
									{" "}
									Answering questions about blockchain and web3 technologies{" "}
								</li>{" "}
								<li> Helping with financial planning and budgeting </li>{" "}
							</ul>{" "}
							<p className="mt-2">
								{" "}
								Simply type your question or request, and our AI will assist
								you!{" "}
							</p>{" "}
						</div>
					)}{" "}
				</div>

				<Chatbot />
			</div>{" "}
		</div>
	);
}
