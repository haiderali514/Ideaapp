import { GoogleGenAI, Chat, Type } from "@google/genai";
import { ChatData, ProjectFolder } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
    throw new Error("API_KEY is not configured.");
}
const ai = new GoogleGenAI({ apiKey: API_KEY });

export const generateFeaturesFromProblem = async (problemStatement: string): Promise<string[]> => {
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `Based on the following problem statement, brainstorm a list of 5-7 core features for a new application. The features should be concise and user-centric. Problem: "${problemStatement}"`,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        features: {
                            type: Type.ARRAY,
                            items: { type: Type.STRING },
                            description: "A list of core features for the application."
                        }
                    }
                },
            },
        });

        const jsonText = response.text.trim();
        const parsed = JSON.parse(jsonText);
        return parsed.features || [];

    } catch (err) {
        console.error("Error generating features:", err);
        return [];
    }
}

export const generateComponentCode = async (prompt: string): Promise<{ html: string; css: string }> => {
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `Generate the HTML and CSS for a single, self-contained UI component based on the following description. The CSS should be modern and clean, using variables for colors and fonts where appropriate. Do not use any external libraries or images. Use placeholder text and data. The entire component should be wrapped in a single container div. Description: "${prompt}"`,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        html: { type: Type.STRING, description: "The HTML code for the component." },
                        css: { type: Type.STRING, description: "The CSS code for the component." }
                    },
                    required: ["html", "css"],
                },
            },
        });

        const jsonText = response.text.trim();
        const parsed = JSON.parse(jsonText);
        return { html: parsed.html || '', css: parsed.css || '' };

    } catch (err) {
        console.error("Error generating component code:", err);
        return { html: `<p>Error generating component. Please try again.</p>`, css: 'p { color: red; }' };
    }
}


export const callGeminiAPI = async (
    currentChat: ChatData,
    allChats: ChatData[],
    allProjects: ProjectFolder[],
    onStream: (chunk: string) => void,
    onStreamEnd: () => void,
    onError: (error: Error) => void
) => {
    try {
        const project = allProjects.find(p => p.id === currentChat.projectId);

        let systemInstruction = `You are "IdeaSpark AI", a helpful and creative AI assistant.`;

        if (project) {
            // Get chats from this project, EXCLUDING the current one, to build a background summary.
            const otherProjectChats = allChats.filter(
                c => c.projectId === project.id && c.id !== currentChat.id
            );

            // Create a concise summary of the history from other chats.
            const historySummary = otherProjectChats
                .flatMap(c => c.history)
                .slice(-10) // Take last 10 turns from other chats to keep it brief.
                .map(h => {
                    const role = h.role === 'user' ? 'User' : 'AI';
                    const content = h.parts.map(p => {
                        if (p.text) {
                            // Truncate long messages to keep the summary concise.
                            return p.text.length > 250 ? p.text.substring(0, 250) + '...' : p.text;
                        }
                        return '[file attachment]';
                    }).join(' ');
                    return `${role}: ${content}`;
                })
                .join('\n');
            
            // Construct the comprehensive system instruction with the Project Memory.
            systemInstruction = `You are "IdeaSpark AI", an expert creative and technical partner. Your goal is to help the user build, design, and code their application from idea to deployment.

The application has three main stages reflected in the project tabs: Plan, Design, and Code. Guide the user through these stages.
- **PLANNING STAGE (Plan Tab):** Help the user define their problem, brainstorm features, and choose a technology stack.
- **DESIGN STAGE (Design Tab):** Assist with UI/UX design. Provide inspiration from existing apps, suggest user flows, create wireframe descriptions, and help build a design system.
- **CODING STAGE (Code Tab):** Act as a pair programmer. Generate code snippets, write entire components, explain complex algorithms, help debug, and suggest best practices.

You have access to the project's memory. Use this context to provide consistent and intelligent responses.

--- PROJECT MEMORY ---
Problem Statement: ${project.problemStatement || 'Not yet defined.'}

Core Features:
${project.features?.map(f => `- ${f}`).join('\n') || 'Not yet defined.'}

User Instructions: ${project.instructions || 'None.'}

Recent Conversation History from other chats in this project:
${historySummary || 'No other chats in this project yet.'}
--- END PROJECT MEMORY ---

Currently, you are in a chat titled "${currentChat.name}". Respond to the user's latest message based on the project memory and the current chat's full history, which will be provided separately.`;
        }
      
        // The history for the API should not include the latest user message or the empty model response shell.
        const historyForApi = currentChat.history.slice(0, -2); 

        const chat: Chat = ai.chats.create({
            model: 'gemini-2.5-flash',
            history: historyForApi,
            config: { systemInstruction },
        });
        
        // The message to send is the latest one from the user.
        const messageToSend = currentChat.history[currentChat.history.length - 2].parts;
        const stream = await chat.sendMessageStream({ message: messageToSend });

        for await (const chunk of stream) {
            onStream(chunk.text);
        }
        onStreamEnd();
    } catch (err) {
        console.error(err);
        onError(err as Error);
    } 
};