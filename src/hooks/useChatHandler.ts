import React, { useState, useRef } from 'react';
import { ChatData, ProjectFolder, ChatPart, ChatHistoryItem } from '../types';
import { callGeminiAPI } from '../services/geminiService';
import { fileToBase64 } from '../utils/fileUtils';

interface useChatHandlerProps {
    chats: ChatData[];
    setChats: React.Dispatch<React.SetStateAction<ChatData[]>>;
    projectFolders: ProjectFolder[];
    activeChatId: string | null;
    setActiveChatId: React.Dispatch<React.SetStateAction<string | null>>;
    handleNewChat: (projectId?: string | null) => string; // Returns new chat ID
    handleDeleteChat: (chatId: string) => void;
    handleDeleteProject: (projectId: string) => void;
    openDeleteModal: (item: ChatData | ProjectFolder) => void;
    closeAllModals: () => void;
    itemToDelete: ChatData | ProjectFolder | null;
}


export const useChatHandler = ({ chats, setChats, projectFolders, activeChatId, setActiveChatId, handleNewChat, handleDeleteChat, handleDeleteProject, closeAllModals, itemToDelete }: useChatHandlerProps) => {
    const [currentMessage, setCurrentMessage] = useState('');
    const [filesToSend, setFilesToSend] = useState<File[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const fileInputRef = useRef<HTMLInputElement>(null);

    const callApiAndStream = async (chatData: ChatData) => {
        setIsLoading(true);
        setError('');

        await callGeminiAPI(
          chatData,
          chats,
          projectFolders,
          (chunk) => {
            setChats(prev =>
              prev.map(c => {
                if (c.id === chatData.id) {
                  const newHistory = [...c.history];
                  const lastMessage = newHistory[newHistory.length - 1];
                  lastMessage.parts = [{ text: (lastMessage.parts[0]?.text || '') + chunk }];
                  return { ...c, history: newHistory };
                }
                return c;
              })
            );
          },
          () => setIsLoading(false),
          (err) => {
            setError('An error occurred. Please check your connection and API key.');
            // Revert state on error
            setChats(prev => prev.map(c => (c.id === chatData.id ? { ...c, history: c.history.slice(0, -2) } : c)));
            setIsLoading(false);
          }
        );
    };

    const handleSendMessage = async (message: string, chatId: string) => {
        if (!message.trim() && filesToSend.length === 0) return;

        const chatData = chats.find(c => c.id === chatId);
        if (!chatData) return;

        const fileParts = await Promise.all(
          filesToSend.map(async file => ({
            inlineData: { mimeType: file.type, data: await fileToBase64(file) }
          }))
        );

        const userMessageParts: ChatPart[] = [];
        if (message.trim()) userMessageParts.push({ text: message });
        userMessageParts.push(...fileParts);

        const userMessage: ChatHistoryItem = { role: 'user', parts: userMessageParts };
        const updatedChatData: ChatData = { ...chatData, history: [...chatData.history, userMessage, { role: 'model', parts: [{ text: '' }] }] };
        
        setChats(prev => prev.map(c => c.id === chatId ? updatedChatData : c));
        setCurrentMessage('');
        setFilesToSend([]);
        
        await callApiAndStream(updatedChatData);
    };
  
    const handleNewMessageInProject = async (message: string, projectId: string) => {
        const newChatId = handleNewChat(projectId);
        await handleSendMessage(message, newChatId);
    };

    const handleFormSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (activeChatId) {
            handleSendMessage(currentMessage, activeChatId);
        } else {
            // No active chat, so create a new one (uncategorized)
            const newChatId = handleNewChat();
            handleSendMessage(currentMessage, newChatId);
        }
    };
    
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
          setFilesToSend(prev => [...prev, ...Array.from(e.target.files)]);
        }
        if(e.target) e.target.value = '';
    };

    const removeFile = (indexToRemove: number) => {
        setFilesToSend(prev => prev.filter((_, index) => index !== indexToRemove));
    };

    const handleConfirmDelete = () => {
        if (!itemToDelete) return;

        if ('history' in itemToDelete) {
            handleDeleteChat(itemToDelete.id);
        } else {
            handleDeleteProject(itemToDelete.id);
        }
        closeAllModals();
    };


    return {
        currentMessage,
        setCurrentMessage,
        filesToSend,
        isLoading,
        error,
        fileInputRef,
        handleSendMessage,
        handleNewMessageInProject,
        handleFormSubmit,
        handleFileChange,
        removeFile,
        handleConfirmDelete,
    };
};