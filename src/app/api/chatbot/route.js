import { NextResponse } from "next/server";
import { cookies } from "next/headers";

const DEFAULT_USER_ID = "QOJkQvNN3PdiHtuXTSR1l2fWwxj2";

// API endpoints
const SMARTFIN_API = "https://smartfin-ai-api.onrender.com/api/v1/conversation";
const NEBULA_API = "https://nebula-agent.onrender.com/api/conversation";

export async function POST(req) {
	const { message, operation } = await req.json();
	
	// Get user ID from cookies or use default
	const cookieStore = cookies();
	const userId = cookieStore.get("userId")?.value || DEFAULT_USER_ID;
	
	try {
		// Try the primary Smartfin API first
		const response = await fetch(`${SMARTFIN_API}/${userId}`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ message, operation }),
		});
		
		const data = await response.json();
		
		if (data.success && data.response) {
			return NextResponse.json({ 
				reply: data.response,
				messages: data.messages || [],
				source: "smartfin"
			});
		}
		
		// If Smartfin API fails, try the Nebula API as fallback
		const fallbackResponse = await fetch(`${NEBULA_API}/${userId}`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ message, operation }),
		});
		
		const fallbackData = await fallbackResponse.json();
		
		if (fallbackData.success && fallbackData.response) {
			return NextResponse.json({ 
				reply: fallbackData.response,
				messages: fallbackData.messages || [],
				source: "nebula"
			});
		}
		
		// If both APIs fail, return error
		return NextResponse.json(
			{ error: "Failed to generate response from both APIs" },
			{ status: 500 }
		);
			} catch (error) {
		console.error("Error with AI APIs:", error);
		return NextResponse.json(
			{ error: "Failed to generate response" },
			{ status: 500 }
		);
	}
}
	}
}
