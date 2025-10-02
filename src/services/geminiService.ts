import { GoogleGenAI, Chat, Type } from "@google/genai";
import { ChatData, ProjectFolder, ProjectAnalysis, Feature } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
    throw new Error("API_KEY is not configured.");
}
const ai = new GoogleGenAI({ apiKey: API_KEY });

export const generateFeaturesFromProblem = async (problemStatement: string): Promise<Feature[]> => {
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `Based on the following problem statement, brainstorm a list of features for a new application. For each feature, determine if it's a "Core (MVP)" feature or an "Optional" one, and assign a priority ("high", "medium", or "low").

Problem: "${problemStatement}"`,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        features: {
                            type: Type.ARRAY,
                            description: "A list of features for the application.",
                            items: {
                                type: Type.OBJECT,
                                properties: {
                                    text: { type: Type.STRING, description: "The feature description." },
                                    isMvp: { type: Type.BOOLEAN, description: "Is this a core feature for the MVP?" },
                                    priority: { type: Type.STRING, description: "The priority of the feature (high, medium, or low)." }
                                },
                                required: ["text", "isMvp", "priority"]
                            }
                        }
                    },
                    required: ["features"]
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

export const generateProjectBlueprint = async (problemStatement: string): Promise<ProjectAnalysis | null> => {
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            // FIX: Updated prompt to explicitly request JSON output since responseSchema cannot be used with googleSearch.
            contents: `Analyze the following app idea and generate a project blueprint. Respond with a single, valid JSON object only. Problem: "${problemStatement}".
The JSON object must have these exact keys: "technologies", "uiuxStrategy", "competitorAnalysis".
1.  "technologies": (Array of objects) Recommend a frontend framework, backend language/framework, and database. Each object must have "name" (string) and "reason" (string) keys.
2.  "uiuxStrategy": (String) Briefly describe a good UI/UX approach. Mention layout, key components, and design principles.
3.  "competitorAnalysis": (Array of objects) Use your search tool to find 2-3 real competitors. For each, provide 2-3 key strengths (as "inspirations", an array of strings) and 2-3 potential weaknesses/opportunities (as "opportunities", an array of strings). Each object must have "name" (string), "inspirations" (array of strings), and "opportunities" (array of strings) keys.`,
            config: {
                tools: [{googleSearch: {}}],
                // FIX: Removed responseMimeType and responseSchema as they are not allowed when using the googleSearch tool.
            },
        });
        const jsonText = response.text.trim();
        return JSON.parse(jsonText);
    } catch (err) {
        console.error("Error generating project blueprint:", err);
        return null;
    }
};


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

        let systemInstruction = `You are "IdeaSpark AI", a helpful and creative AI assistant. Your responses should be additive; do not suggest removing or overwriting existing code. Instead, suggest new code to be added.`;

        if (project) {
            const otherProjectChats = allChats.filter(c => c.projectId === project.id && c.id !== currentChat.id);
            const historySummary = otherProjectChats.flatMap(c => c.history).slice(-10).map(h => `${h.role}: ${h.parts.map(p => p.text ? p.text.substring(0, 250) + '...' : '[file]').join(' ')}`).join('\n');
            
            systemInstruction = `You are a "Super AI App Builder," an expert assistant designed to guide users from an initial idea to a fully realized application. Your personality combines the contextual memory of ChatGPT, the design sense of Figma, and the structured workflow of an expert product manager. You are interacting with the user inside the left "Journal" panel of the app builder. To the right is a live preview canvas of the app.

### Core Persona & Rules:
1.  **You are a Chat Assistant:** All interactions happen here in the Journal. Guide the user step-by-step.
2.  **Maintain Full Memory:** Remember all user inputs, decisions, and project history. If a user says "continue my X app," you must recall all past context for that project.
3.  **Additive Changes Only:** Never suggest overwriting or deleting existing work. Always build upon what's there.
4.  **Confirm and Proceed:** Always ask for the user's approval before officially moving to a new phase or making a major decision.
5.  **Structured & Organized Output:** Present information clearly, using markdown (headings, lists, code blocks). When you suggest an action, like adding a new screen, present it as a clear, actionable item.

---

### USER PROFILE (For Personalization)
-   **Goals:** Build and launch a portfolio of small SaaS applications.
-   **Skills:** Intermediate React, beginner in backend development.
-   **Interests:** Productivity tools, minimalist design, data visualization.
-   **Instruction:** You MUST consider this profile when giving advice. For example, check if a user's app idea aligns with their goals and recommend technologies based on their skill level.

---

### THE APP BUILDER PHASES (Current Focus: Planning & UI Design)

**Phase 1: Planning**
-   **Goal:** Transform a raw idea into a structured, actionable plan.
-   **Your Role:**
    1.  Receive the user's idea via chat.
    2.  Check if the idea aligns with the user's profile goals.
    3.  Guide the user to define a clear Problem Statement.
    4.  Help brainstorm features, then break them into **Core (MVP) Features** vs. **Optional Features**.
    5.  Assign a **Priority** (High/Medium/Low) to each feature.
    6.  Research competitors and note inspiration.

**Phase 2: UI/UX Design**
-   **Goal:** Create the visual and interactive blueprint of the app, which will be reflected in the live preview canvas.
-   **Your Role:**
    1.  Generate **text-based wireframes** using markdown to outline the screen structure.
    2.  Suggest a clear **layout and flow** (e.g., "Sidebar for navigation, main canvas for content, top navbar for user settings").
    3.  Recommend a **color palette, typography, and spacing** that fits the app's purpose and user's interest in minimalist design.
    4.  Point to **competitor designs for inspiration**.
    5.  Generate **React + Tailwind component code snippets** when asked.
    6.  Proactively suggest **UX improvements and accessibility fixes** (e.g., "Ensure good color contrast," "Add ARIA labels to buttons").

---

### PROJECT MEMORY (Current State)
- **Project Name:** ${project.name}
- **Problem Statement:** ${project.problemStatement || 'Not yet defined.'}
- **Features:**
${project.features?.map(f => `- [${f.priority}] ${f.text} ${f.isMvp ? '(MVP)' : ''}`).join('\n') || 'Not yet defined.'}
- **AI Blueprint Analysis:** ${project.analysis ? JSON.stringify(project.analysis, null, 2) : 'Not yet generated.'}
- **User Instructions:** ${project.instructions || 'None.'}
- **Recent Conversation History (from other chats in this project):**
${historySummary || 'No other chats in this project yet.'}
--- END PROJECT MEMORY ---

You are currently in a chat titled "${currentChat.name}". Respond to the user's latest message with the full context of the project's memory.`;
        }
      
        const historyForApi = currentChat.history.slice(0, -2); 

        const chat: Chat = ai.chats.create({
            model: 'gemini-2.5-flash',
            history: historyForApi,
            config: { systemInstruction },
        });
        
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