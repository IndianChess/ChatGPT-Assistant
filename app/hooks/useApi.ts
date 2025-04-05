import { useState } from 'react';
import { Alert, Platform } from 'react-native';
import { Client } from "@gradio/client";

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
    // State to store all chat messages
    const [messages, setMessages] = useState<Message[]>([]);

    // Optional system message that could be configured in settings
    const systemMessage = "You are a compassionate and friendly therapist.";

    // Function to get a completion from Hugging Face
    const getCompletion = async (prompt: string) => {
        // Create a new user message with the prompt
        const userMessage: Message = {
            content: prompt,
            role: Role.User,
        };

        // Update messages state with the new user message
        const chatHistory = [...messages, userMessage];
        setMessages(chatHistory);

        try {
            console.log("Connecting to Hugging Face Space...");
            // Create Gradio client and connect to the Hugging Face Space
            const client = await Client.connect("Nymbo/Qwen2.5-Coder-32B-Instruct-Serverless");
            
            console.log("Connected successfully. Sending prompt:", prompt);
            
            // Make the prediction request
            const result = await client.predict("/chat", { 		
                message: prompt, 		
                system_message: systemMessage, 		
                max_tokens: 200, 		
                temperature: 0.7, 		
                top_p: 0.95,
            });

            console.log("Received response:", result);
            
            // Check what's in the result and handle accordingly
            let aiResponse: string;
            
            if (result && typeof result.data === 'string' && result.data.trim().length > 0) {
                aiResponse = result.data;
            } else if (result && result.data !== undefined) {
                // Try to convert the data to a string if it's another type
                aiResponse = String(result.data);
                if (aiResponse.trim().length === 0) {
                    aiResponse = "The model returned an empty response. Please try again with a different question.";
                }
            } else {
                aiResponse = "Could not get a response from the model. The API may be experiencing high traffic or the model may be offline.";
                console.error("API response had no data:", result);
            }

            // Create a new AI message with the AI's response
            const aiMessage: Message = {
                content: aiResponse,
                role: Role.Assistant,
            };

            // Update messages state with the new AI message
            setMessages((prevMessages) => [...prevMessages, aiMessage]);

        } catch (error) {
            // Handle any errors that occur during the request
            let errorMessage: string;
            
            if (error instanceof Error) {
                errorMessage = error.message;
                console.error('Detailed error:', error);
            } else {
                errorMessage = 'An unknown error occurred';
                console.error('Unknown error:', error);
            }

            // Create a more user-friendly error message
            const userFriendlyMessage = `I couldn't connect to the Hugging Face model. This might be due to:
- Network connectivity issues
- The Hugging Face Space might be offline or experiencing high traffic
- There might be an issue with the Gradio client

Technical details: ${errorMessage}`;

            // Create a new AI message with the error message
            const aiMessage: Message = {
                content: userFriendlyMessage,
                role: Role.Assistant,
            };

            // Update messages state with the new AI message
            setMessages((prevMessages) => [...prevMessages, aiMessage]);
        }
    };

    return {
        messages,
        getCompletion
    };
};