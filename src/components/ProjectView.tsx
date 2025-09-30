import React, { useState } from 'react';
import { ProjectFolder, ChatData } from '../types';

interface ProjectViewProps {
    project: ProjectFolder;
    chatsInProject: ChatData[];
    filesToSend: File[];
    isLoading: boolean;
    onNewMessageInProject: (message: string, projectId: string) => void;
    onRemoveFile: (index: number) => void;
    onSelectChat: (chatId: string) => void;
    fileInputRef: React.RefObject<HTMLInputElement>;
}

export const ProjectView: React.FC<ProjectViewProps> = ({
    project,
    chatsInProject,
    filesToSend,
    isLoading,
    onNewMessageInProject,
    onRemoveFile,
    onSelectChat,
    fileInputRef,
}) => {
    const [newMessage, setNewMessage] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (newMessage.trim() || filesToSend.length > 0) {
            onNewMessageInProject(newMessage, project.id);
            setNewMessage('');
        }
    };

    return (
        <div className="project-landing-view">
            <header className="project-landing-header">
                <h1 className="project-landing-title">
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path></svg>
                    {project.name}
                </h1>
                <button className="add-files-btn" onClick={() => fileInputRef.current?.click()}>Add files</button>
            </header>

            <div className="project-new-chat-wrapper">
                <div className="file-previews-center">
                    {filesToSend.map((file, index) => (
                        <div key={index} className="file-preview-chip">
                            {file.type.startsWith('image/') ? <img src={URL.createObjectURL(file)} alt={file.name} /> : <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9l-7-7z"></path><polyline points="13 2 13 9 20 9"></polyline></svg>}
                            <span>{file.name}</span>
                            <button onClick={() => onRemoveFile(index)}>×</button>
                        </div>
                    ))}
                </div>
                <form className="project-new-chat-form" onSubmit={handleSubmit}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                    <input type="text" value={newMessage} onChange={e => setNewMessage(e.target.value)} placeholder={`New chat in ${project.name}`} />
                    <button type="submit" className="send-button-project" disabled={(!newMessage.trim() && filesToSend.length === 0) || isLoading}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
                    </button>
                </form>
            </div>

            <ul className="project-chat-list-main">
                {chatsInProject.map(chat => (
                    <li key={chat.id} className="project-chat-list-item-main" onClick={() => onSelectChat(chat.id)}>
                        <h3>{chat.name}</h3>
                        <p>{chat.history[0]?.parts.find(p => p.text)?.text?.substring(0, 100) || '...'}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
};
