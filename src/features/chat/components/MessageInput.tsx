import React from 'react';
import { FilePreviews } from './FilePreviews';

interface MessageInputProps {
    currentMessage: string;
    setCurrentMessage: (value: string) => void;
    filesToSend: File[];
    isLoading: boolean;
    onFormSubmit: (e: React.FormEvent) => void;
    onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onRemoveFile: (index: number) => void;
    fileInputRef: React.RefObject<HTMLInputElement>;
}

export const MessageInput: React.FC<MessageInputProps> = (props) => {
    const { 
        currentMessage, setCurrentMessage, filesToSend, isLoading, 
        onFormSubmit, onRemoveFile, fileInputRef
    } = props;

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            onFormSubmit(e as any);
        }
    };

    return (
        <div className="chat-form-container">
            <FilePreviews files={filesToSend} onRemoveFile={onRemoveFile} />
            <form className="chat-form" onSubmit={onFormSubmit}>
                <button type="button" className="attach-button" onClick={() => fileInputRef.current?.click()}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"></path></svg>
                </button>
                <textarea 
                    className="chat-textarea" 
                    value={currentMessage} 
                    onChange={(e) => setCurrentMessage(e.target.value)} 
                    onKeyDown={handleKeyDown} 
                    placeholder="Type a message..." 
                    rows={1} 
                />
                <button 
                    type="submit" 
                    className="send-button" 
                    disabled={(!currentMessage.trim() && filesToSend.length === 0) || isLoading}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
                </button>
            </form>
        </div>
    );
};
