// useApi.ts
import { useState } from 'react';

// Enum for message roles
export enum Role {
  User = 'user',
  Assistant = 'assistant',
}

// Interface for messages
export interface Message {
  content: string;
  role: Role;
}

// Main hook for API interaction
export const useApi = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const systemMessage = "You are a compassionate and friendly therapist.";

  const getCompletion = async (prompt: string) => {
    // Create a new user message with the prompt
    const userMessage: Message = {
      content: prompt,
      role: Role.User,
    };

    // Append the user message to the chat history
    const chatHistory = [...messages, userMessage];
    setMessages(chatHistory);

    try {
      console.log("Calling proxy server...");
      // Replace with your proxy server's URL. For local testing, use localhost.
      const response = await fetch("http://localhost:3001/predict", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          endpoint: "/chat",
          payload: {
            message: prompt,
            system_message: systemMessage,
            max_tokens: 200,
            temperature: 0.7,
            top_p: 0.95,
          },
        }),
      });

      if (!response.ok) {
        throw new Error("Proxy server error: " + response.status);
      }

      const result = await response.json();
      console.log("Received response from proxy:", result);

      let aiResponse: string;
      if (result && typeof result.data === 'string' && result.data.trim().length > 0) {
        aiResponse = result.data;
      } else if (result && result.data !== undefined) {
        aiResponse = String(result.data);
        if (aiResponse.trim().length === 0) {
          aiResponse = "The model returned an empty response. Please try again.";
        }
      } else {
        aiResponse = "Could not get a response from the model. The API may be experiencing issues.";
        console.error("API response had no data:", result);
      }

      // Create a new AI message with the response
      const aiMessage: Message = {
        content: aiResponse,
        role: Role.Assistant,
      };

      setMessages((prevMessages) => [...prevMessages, aiMessage]);
    } catch (error) {
      let errorMessage: string;
      if (error instanceof Error) {
        errorMessage = error.message;
        console.error('Detailed error:', error);
      } else {
        errorMessage = 'An unknown error occurred';
        console.error('Unknown error:', error);
      }
      const userFriendlyMessage = `I couldn't connect to the model via the proxy.
Technical details: ${errorMessage}`;

      const aiMessage: Message = {
        content: userFriendlyMessage,
        role: Role.Assistant,
      };
      setMessages((prevMessages) => [...prevMessages, aiMessage]);
    }
  };

  return {
    messages,
    getCompletion
  };
};
