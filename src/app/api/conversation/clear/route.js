import { NextResponse } from "next/server";
import { clearConversationHistory } from "../../../../lib/conversationService";

/**
 * API endpoint to clear a user's conversation history
 * DELETE /api/conversation/clear?user_id={user_id}
 */
export async function DELETE(req) {
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
    
    // Clear the user's conversation history
    const deletedCount = await clearConversationHistory(user_id);
    
    return NextResponse.json({ 
      success: true,
      message: `Cleared ${deletedCount} conversations` 
    });
  } catch (error) {
    console.error("Error clearing conversation history:", error);
    return NextResponse.json(
      { error: "Failed to clear conversation history" },
      { status: 500 }
    );
  }
} 