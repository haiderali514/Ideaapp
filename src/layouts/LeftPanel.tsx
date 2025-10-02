import React from 'react';
import { useAppContext } from '../context/AppContext';
import { ChatLog } from '../features/chat/components/ChatLog';
import { MessageInput } from '../features/chat/components/MessageInput';
import { ProjectFolder } from '../types';

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
    } = useAppContext();

    return (
        <aside className="left-panel">
            <div className="left-panel-header">
                <h3>Lovable</h3>
                <button className="options-btn">
                     <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"><path fill="currentColor" d="M5 10c-1.1 0-2 .9-2 2s.9 2 2 2s2-.9 2-2s-.9-2-2-2m14 0c-1.1 0-2 .9-2 2s.9 2 2 2s2-.9 2-2s-.9-2-2-2m-7 0c-1.1 0-2 .9-2 2s.9 2 2 2s2-.9 2-2s-.9-2-2-2"/></svg>
                </button>
            </div>
            {activeChat ? (
                <>
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
                </>
            ) : (
                <div style={{padding: '1rem', color: 'var(--text-secondary)', textAlign: 'center', margin: 'auto' }}>
                    <p>Select a project from the dashboard to begin.</p>
                </div>
            )}
        </aside>
    );
};