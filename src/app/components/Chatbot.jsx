"use client"
// components/Chatbot.js

// Import necessary React hooks for managing state and side effects
import React, { useState } from 'react';


const Chatbot = () => {
  // State to store the user input message
  const [input, setInput] = useState('');
  
  // State to store chat messages (both from the user and the AI)
  const [messages, setMessages] = useState([]);

  // Function to handle sending the user's message to the backend API
  const sendMessage = async () => {
    // Create a new message object for the user's input and add it to the messages array
    const userMessage = { role: 'user', content: input };
    setMessages((prevMessages) => [...prevMessages, userMessage]);

    try {
      // Send the message to the chatbot API and get the AI's response
      const response = await fetch('/api/chatbot', {
        method: 'POST',  // Use POST to send data to the API
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: input }),  // Send the user input to the backend
      });

      const data = await response.json();  // Parse the API response

      // Create a new message object for the AI's reply and add it to the messages array
      const aiMessage = { role: 'ai', content: data.reply };
      setMessages((prevMessages) => [...prevMessages, aiMessage]);

      // Clear the input field after sending the message
      setInput('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  // Return the JSX for the chatbot UI
  return (
    <div className="chatbot-container">
      <div className="chat-window">
        {/* Display the messages */}
        {messages.map((msg, index) => (
          <div
            key={index}
            className={msg.role === 'user' ? 'user-message' : 'ai-message'}
          >
            {msg.content}
          </div>
        ))}
      </div>

      {/* Input field for user to type a message */}
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}  // Update input state on change
        placeholder="Ask something..."  // Placeholder text in the input field
      />

      {/* Button to send the message */}
      <button onClick={sendMessage}>Send</button>
    </div>
  );
};

export default Chatbot;
