import React from 'react';
import { useAppContext } from '../context/AppContext';
import { ChatLog } from '../features/chat/components/ChatLog';
import { MessageInput } from '../features/chat/components/MessageInput';
import { ChatHeader } from '../features/chat/components/ChatHeader';
import { ChatPlaceholder } from '../features/chat/components/ChatPlaceholder';
import { ProjectFolder, ChatData } from '../types';

interface LeftPanelProps {
    chats: ChatData[];
    activeProject: ProjectFolder;
    handleNewChat: (projectId: string) => void;
    setActiveChatId: (chatId: string) => void;
    onOpenSettingsModal: () => void; // This seems unused here now but let's keep it for now.
}

export const LeftPanel: React.FC<LeftPanelProps> = ({ chats, activeProject, handleNewChat, setActiveChatId }) => {
    const { 
        activeChat, 
        isLoading, 
        error, 
        currentMessage, 
        setCurrentMessage, 
        handleFormSubmit, 
        fileInputRef,
        filesToSend,
        handleFileChange,
        removeFile,
        openRenameModal,
        openMoveModal,
        openDeleteModal,
    } = useAppContext();
    
    const chatsInProject = chats.filter(c => c.projectId === activeProject.id);

    if (activeChat) {
         return (
            <aside className="left-panel">
                <ChatHeader 
                    chatName={activeChat.name}
                    onOpenRenameModal={() => openRenameModal(activeChat)}
                    onOpenMoveModal={() => openMoveModal(activeChat)}
                    onDeleteChat={() => openDeleteModal(activeChat)}
                />
                <ChatLog
                    chat={activeChat}
                    isLoading={isLoading}
                    error={error}
                />
                <MessageInput
                    currentMessage={currentMessage}
                    setCurrentMessage={setCurrentMessage}
                    filesToSend={filesToSend}
                    isLoading={isLoading}
                    onFormSubmit={handleFormSubmit}
                    onRemoveFile={removeFile}
                    fileInputRef={fileInputRef}
                />
            </aside>
        );
    }
    
    // View when a project is selected but no chat is active
    return (
        <aside className="left-panel">
            <header className="left-panel-header">
                <h3>{activeProject.name}</h3>
            </header>
            <div className="project-journal-body">
                <div className="project-journal-actions">
                    <button className="new-chat-in-project-btn" onClick={() => handleNewChat(activeProject.id)}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path></svg>
                        <span>New Chat</span>
                    </button>
                </div>
                
                {chatsInProject.length > 0 ? (
                    <ul className="project-chat-list">
                        {chatsInProject.map(chat => (
                            <li key={chat.id} className="project-chat-list-item" onClick={() => setActiveChatId(chat.id)}>
                                <span className="chat-item-name">{chat.name}</span>
                                <span className="chat-item-preview">
                                    {chat.history.slice(-1)[0]?.parts[0]?.text?.substring(0, 50) || 'No messages yet...'}
                                </span>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <ChatPlaceholder />
                )}
            </div>
        </aside>
    );
};