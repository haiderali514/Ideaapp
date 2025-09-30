import React, { useState } from 'react';
import { ProjectFolder } from '../../../types';
import { FilePreviews } from '../../chat/components/FilePreviews';

interface NewChatInputProps {
    project: ProjectFolder;
    filesToSend: File[];
    isLoading: boolean;
    onNewMessageInProject: (message: string, projectId: string) => void;
    onRemoveFile: (index: number) => void;
}

export const NewChatInput: React.FC<NewChatInputProps> = ({ project, filesToSend, isLoading, onNewMessageInProject, onRemoveFile }) => {
    const [newMessage, setNewMessage] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (newMessage.trim() || filesToSend.length > 0) {
            onNewMessageInProject(newMessage, project.id);
            setNewMessage('');
        }
    };

    return (
        <div className="project-new-chat-wrapper">
            <div className="file-previews-center">
                <FilePreviews files={filesToSend} onRemoveFile={onRemoveFile} />
            </div>
            <form className="project-new-chat-form" onSubmit={handleSubmit}>
                <input type="text" value={newMessage} onChange={e => setNewMessage(e.target.value)} placeholder={`New chat in ${project.name}`} />
                <button type="button" className="add-button">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                </button>
                 <button type="button" className="mic-button" disabled>
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path><path d="M19 10v2a7 7 0 0 1-14 0v-2"></path><line x1="12" y1="19" x2="12" y2="23"></line><line x1="8" y1="23" x2="16" y2="23"></line></svg>
                </button>
                <button type="submit" className="send-button-project" disabled={(!newMessage.trim() && filesToSend.length === 0) || isLoading}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
                </button>
            </form>
        </div>
    );
};
