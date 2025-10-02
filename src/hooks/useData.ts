import { useState } from 'react';
import { useLocalStorage } from './useLocalStorage';
import { ChatData, ProjectFolder } from '../types';

// --- NEW: Sample data to demonstrate the Lovable UI ---
const sampleProject: ProjectFolder = {
    id: '1',
    name: 'spark-quest-stride'
};

const sampleChat: ChatData = {
    id: 'chat-1',
    name: 'Main Chat',
    projectId: '1',
    history: [
        { role: 'model', parts: [{ type: 'thought', text: 'Thought for 15 seconds' }] },
        { role: 'model', parts: [{ type: 'text', text: "I'll create a Pomodoro timer screen with navigation and routing." }] },
        { role: 'model', parts: [{ type: 'text', text: "3 edits made\nAdded Pomodoro timer screen with navigation in sidebar." }] },
        { role: 'model', parts: [{ type: 'action', actionDetails: { title: 'Add Pomodoro screen', description: 'Preview Latest' } }] }
    ]
};

export const useData = () => {
    const [chats, setChats] = useLocalStorage<ChatData[]>('chats', [sampleChat]);
    const [projectFolders, setProjectFolders] = useLocalStorage<ProjectFolder[]>('projectFolders', [sampleProject]);
  
    const [activeChatId, setActiveChatId] = useState<string | null>(sampleChat.id);
    const [activeProjectId, setActiveProjectId] = useState<string | null>(sampleProject.id);

    const handleNewChat = (projectId: string | null = null): string => {
        const newChat: ChatData = {
            id: Date.now().toString(),
            name: "New Chat",
            history: [],
            projectId: projectId,
        };
        setChats(prev => [newChat, ...prev]);
        setActiveChatId(newChat.id);
        setActiveProjectId(projectId);
        return newChat.id;
    };

    const handleDeleteChat = (chatId: string) => {
        setChats(prev => prev.filter(c => c.id !== chatId));
        if (activeChatId === chatId) {
            setActiveChatId(null);
        }
    };

    const handleDeleteProject = (projectId: string) => {
        const chatIdsInProject = chats.filter(c => c.projectId === projectId).map(c => c.id);
        setChats(prev => prev.filter(c => c.projectId !== projectId));
        setProjectFolders(prev => prev.filter(p => p.id !== projectId));
    
        if (activeProjectId === projectId) {
            setActiveProjectId(null);
            setActiveChatId(null);
        } else if (activeChatId && chatIdsInProject.includes(activeChatId)) {
            setActiveChatId(null);
        }
    };
    
    const updateProject = (projectId: string, data: Partial<ProjectFolder>) => {
        setProjectFolders(prev => prev.map(p => p.id === projectId ? { ...p, ...data } : p));
    };

    return {
        chats,
        setChats,
        projectFolders,
        setProjectFolders,
        activeChatId,
        setActiveChatId,
        activeProjectId,
        setActiveProjectId,
        handleNewChat,
        handleDeleteChat,
        handleDeleteProject,
        updateProject,
    };
};