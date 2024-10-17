import Chatbot from "../components/Chatbot";

export default function Chat() {
	return (
		<div className="min-h-screen bg-gray-50 flex flex-col items-center">
			<h1 className="text-3xl font-bold text-indigo-600 mt-6 mx-auto">
				Welcome to SmartFin Chatbot
			</h1>
			<Chatbot />
		</div>
	);
}
