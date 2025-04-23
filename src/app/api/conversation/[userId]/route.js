import { NextResponse } from "next/server";

// Base URL for the SmartFin AI API
const SMARTFIN_BASE = process.env.NEXT_PUBLIC_API_URL || 'https://smartfin-ai-api.onrender.com';

// Default user ID to use for guest users
const DEFAULT_USER_ID = "guest-user";

/**
 * API endpoint to handle conversation with the financial assistant
 * POST /api/conversation/[userId]
 */
export async function POST(req, { params }) {
  try {
    const { userId } = params;
    const body = await req.json();
    const { operation, message } = body;

    // Check if it's a valid operation
    if (operation === 'history') {
      // Handle history operation - no message required
      try {
        // For testing purposes, return sample conversation data
        // In production, this would fetch from a database
        const sampleMessages = [
          {
            role: "assistant",
            content: "Hello! I'm your SmartFin AI financial assistant. How can I help you today?",
            timestamp: new Date(Date.now() - 86400000).toISOString() // 1 day ago
          },
          {
            role: "user",
            content: "What's my current balance?",
            timestamp: new Date(Date.now() - 86300000).toISOString() 
          },
          {
            role: "assistant",
            content: "Based on your transaction data, your current balance is ₦120,500. Your income this month is ₦150,000 and you've spent ₦29,500.",
            timestamp: new Date(Date.now() - 86200000).toISOString()
          }
        ];
        
        return NextResponse.json({ 
          messages: sampleMessages
        });
      } catch (error) {
        console.error("Error fetching conversation history:", error);
        return NextResponse.json({ error: "Failed to fetch conversation history" }, { status: 500 });
      }
    } 
    else if (operation === 'clear') {
      // Handle clear operation - no message required
      try {
        // Code to clear conversation history
        // This would normally clear from your database
        return NextResponse.json({ success: true });
      } catch (error) {
        console.error("Error clearing conversation history:", error);
        return NextResponse.json({ error: "Failed to clear conversation history" }, { status: 500 });
      }
    }
    else if (operation === 'message') {
      // For regular messages, require the message field
      if (!message) {
        return NextResponse.json(
          { error: "Message is required for the 'message' operation" },
          { status: 400 }
        );
      }

      // Handle normal message operation by sending to SmartFin API
      // Your existing code for sending to SmartFin API...
      const smartfinResponse = await fetch(`${SMARTFIN_BASE}/api/v1/conversation/${userId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: userId,
          message: message,
          context: {} // Add any context data here
        }),
      });

      if (!smartfinResponse.ok) {
        const errorText = await smartfinResponse.text();
        throw new Error(`SmartFin API error: ${smartfinResponse.status} ${errorText}`);
      }

      const data = await smartfinResponse.json();
      return NextResponse.json(data);
    }
    else {
      // Invalid operation
      return NextResponse.json(
        { error: "Invalid operation specified" },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("Error handling conversation request:", error);
    return NextResponse.json(
      { error: error.message || "Failed to process conversation request" },
      { status: 500 }
    );
  }
} 