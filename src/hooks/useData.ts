import { useState } from 'react';
import { useLocalStorage } from './useLocalStorage';
import { ChatData, ProjectFolder } from '../types';

export const useData = () => {
    const [chats, setChats] = useLocalStorage<ChatData[]>('chats', []);
    const [projectFolders, setProjectFolders] = useLocalStorage<ProjectFolder[]>('projectFolders', []);
  
    const [activeChatId, setActiveChatId] = useState<string | null>(null);
    const [activeProjectId, setActiveProjectId] = useState<string | null>(null);

    const handleNewChat = (projectId: string | null = null): string => {
        const newChat: ChatData = {
            id: Date.now().toString(),
            name: "New Chat",
            history: [],
            projectId: projectId,
        };
        setChats(prev => [newChat, ...prev]);
        setActiveChatId(newChat.id);
        if (projectId) {
            setActiveProjectId(projectId);
        }
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