import { GoogleGenAI, Chat } from "@google/genai";
import { ChatData, ProjectFolder } from '../types';

const API_KEY = process.env.API_KEY;

export const callGeminiAPI = async (
    chatData: ChatData,
    projectFolders: ProjectFolder[],
    onStream: (chunk: string) => void,
    onStreamEnd: () => void,
    onError: (error: Error) => void
) => {
    try {
        if (!API_KEY) throw new Error("API_KEY is not configured.");
        const ai = new GoogleGenAI({ apiKey: API_KEY });
        
        const baseSystemInstruction = `You are an expert software project manager. Your goal is to help users break down their ideas into actionable plans. You should be concise, clear, and provide structured responses, often using markdown for formatting like lists, bolding, and code snippets where appropriate.`;
      
        const project = projectFolders.find(p => p.id === chatData.projectId);
        const projectInstructions = project?.instructions ? `\n\nCRITICAL: You must adhere to the following user-provided instructions for this project:\n<instructions>\n${project.instructions}\n</instructions>` : '';
        
        // Exclude the last (empty model) message for history
        const historyForApi = chatData.history.slice(0, -1); 

        const chat: Chat = ai.chats.create({
            model: 'gemini-2.5-flash',
            history: historyForApi,
            config: { systemInstruction: baseSystemInstruction + projectInstructions },
        });
        
        // The message to send is the second to last message in the history (the user's latest message)
        const messageToSend = chatData.history[chatData.history.length - 2].parts;

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
