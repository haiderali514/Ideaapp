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
    handleNewChat: (projectId?: string | null) => void;
    handleDeleteChat: (chatId: string) => void;
    handleDeleteProject: (projectId: string) => void;
    openDeleteModal: (item: ChatData | ProjectFolder) => void;
}


export const useChatHandler = ({ chats, setChats, projectFolders, activeChatId, setActiveChatId, handleDeleteChat, handleDeleteProject, openDeleteModal }: useChatHandlerProps) => {
    const [currentMessage, setCurrentMessage] = useState('');
    const [filesToSend, setFilesToSend] = useState<File[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const fileInputRef = useRef<HTMLInputElement>(null);

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
        
        setIsLoading(true);
        setError('');

        await callGeminiAPI(
          updatedChatData,
          projectFolders,
          (chunk) => {
            setChats(prev =>
              prev.map(c => {
                if (c.id === updatedChatData.id) {
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
            setChats(prev => prev.map(c => (c.id === updatedChatData.id ? chatData : c)));
            setIsLoading(false);
          }
        );
    };
  
    const handleNewMessageInProject = async (message: string, projectId: string) => {
        const newChatId = Date.now().toString();
        const chatName = message.length > 40 ? message.substring(0, 40) + '...' : (message || "New Chat");
        
        const fileParts = await Promise.all(
          filesToSend.map(async file => ({
            inlineData: { mimeType: file.type, data: await fileToBase64(file) }
          }))
        );
        const userMessageParts: ChatPart[] = [];
         if (message.trim()) userMessageParts.push({ text: message });
        userMessageParts.push(...fileParts);

        const userMessage: ChatHistoryItem = { role: 'user', parts: userMessageParts };

        const newChat: ChatData = {
            id: newChatId,
            name: chatName,
            history: [userMessage, { role: 'model', parts: [{ text: '' }] }],
            projectId: projectId,
        };

        setChats(prev => [newChat, ...prev]);
        setActiveChatId(newChatId);
        setFilesToSend([]);

        setIsLoading(true);
        setError('');

        await callGeminiAPI(
          newChat,
          projectFolders,
           (chunk) => {
            setChats(prev =>
              prev.map(c => {
                if (c.id === newChatId) {
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
            setChats(prev => prev.filter(c => c.id !== newChatId));
            setActiveChatId(null);
            setIsLoading(false);
          }
        );
    };

    const handleFormSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (activeChatId) handleSendMessage(currentMessage, activeChatId);
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
        const itemToDelete = (window as any).itemToDelete; // A bit of a hack to get around prop drilling
        if (!itemToDelete) return;

        if ('history' in itemToDelete) {
            handleDeleteChat(itemToDelete.id);
        } else {
            handleDeleteProject(itemToDelete.id);
        }
        (window as any).closeAllModals(); // Another hack
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
        handleConfirmDelete, // We might need a better way to handle this
    };
};