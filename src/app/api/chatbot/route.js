import { NextResponse } from "next/server";
import dotenv from "dotenv";
import { getUserFullContext } from "../../../lib/userDataService";
import { sendToSmartFin } from "../../../lib/aiClient";
import { saveMessage, getRecentConversation } from "../../../lib/conversationService";

// Configure dotenv to load environment variables
dotenv.config();

export async function POST(req) {
	try {
		// Extract message and user_id from request
		const { message, user_id } = await req.json();

		// Validate required parameters
		if (!message) {
			return NextResponse.json(
				{ error: "Message is required" },
				{ status: 400 }
			);
		}
		
		if (!user_id) {
			return NextResponse.json(
				{ error: "User ID is required" },
				{ status: 400 }
			);
		}
		
		// Save the user's message to conversation history
		await saveMessage(user_id, 'user', message);
		
		// 1. Gather user data from MongoDB
		const userContext = await getUserFullContext(user_id);
		
		// 2. Send data to SmartFin-AI and get response
		const aiResponse = await sendToSmartFin(user_id, message, userContext);
		
		// 3. Save the AI's response to conversation history
		await saveMessage(user_id, 'assistant', aiResponse);
		
		// 4. Return the AI response
		return NextResponse.json({ reply: aiResponse });
	} catch (error) {
		console.error("Error processing chatbot request:", error);
		return NextResponse.json(
			{ error: "Failed to generate response" },
			{ status: 500 }
		);
	}
}

// Add a GET method to retrieve conversation history
export async function GET(req) {
	try {
		// Get user_id from the URL search parameters
		const url = new URL(req.url);
		const user_id = url.searchParams.get('user_id');
		
		// Validate required parameters
		if (!user_id) {
			return NextResponse.json(
				{ error: "User ID is required" },
				{ status: 400 }
			);
		}
		
		// Get the most recent conversation
		const conversation = await getRecentConversation(user_id);
		
		if (!conversation) {
			return NextResponse.json({ messages: [] });
		}
		
		// Return the conversation messages
		return NextResponse.json({ 
			messages: conversation.messages,
			conversation_id: conversation._id
		});
	} catch (error) {
		console.error("Error retrieving conversation history:", error);
		return NextResponse.json(
			{ error: "Failed to retrieve conversation history" },
			{ status: 500 }
		);
	}
}
