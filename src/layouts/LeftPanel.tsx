import React from 'react';
import { useAppContext } from '../context/AppContext';
import { ChatLog } from '../features/chat/components/ChatLog';
import { MessageInput } from '../features/chat/components/MessageInput';
import { ProjectFolder } from '../types';
import { ChatHeader } from '../features/chat/components/ChatHeader';

interface LeftPanelProps {
    projects: ProjectFolder[];
    onSelectProject: (projectId: string) => void;
    onNewProject: () => void;
    onOpenSettingsModal: () => void;
}

export const LeftPanel: React.FC<LeftPanelProps> = ({ projects, onSelectProject, onNewProject, onOpenSettingsModal }) => {
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

    // This component only renders when there is an active project, which implies an active chat.
    // So we can safely assume activeChat is not null.
    if (!activeChat) {
         return (
            <aside className="left-panel">
                <div style={{padding: '1rem', color: 'var(--text-secondary)', textAlign: 'center', margin: 'auto' }}>
                    <p>Select or create a chat to begin.</p>
                </div>
            </aside>
        );
    }

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
};