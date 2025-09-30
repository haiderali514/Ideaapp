import React, { useRef } from 'react';
import { FilePreviews } from './FilePreviews';

interface MessageInputProps {
    currentMessage: string;
    setCurrentMessage: (value: string) => void;
    filesToSend: File[];
    isLoading: boolean;
    onFormSubmit: (e: React.FormEvent) => void;
    onRemoveFile: (index: number) => void;
    fileInputRef: React.RefObject<HTMLInputElement>;
}

export const MessageInput: React.FC<MessageInputProps> = (props) => {
    const { 
        currentMessage, setCurrentMessage, filesToSend, isLoading, 
        onFormSubmit, onRemoveFile, fileInputRef
    } = props;
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setCurrentMessage(e.target.value);
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            const scrollHeight = textareaRef.current.scrollHeight;
            textareaRef.current.style.height = `${scrollHeight}px`;
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            onFormSubmit(e as any);
        }
    };

    return (
        <div className="chat-form-container">
            <div className="chat-form-wrapper">
                <FilePreviews files={filesToSend} onRemoveFile={onRemoveFile} />
                 <form className="chat-form" onSubmit={onFormSubmit}>
                    <textarea 
                        ref={textareaRef}
                        className="chat-textarea" 
                        value={currentMessage} 
                        onChange={handleTextChange} 
                        onKeyDown={handleKeyDown} 
                        placeholder="Ask anything..." 
                        rows={1} 
                    />
                     <button type="button" className="attach-button" onClick={() => fileInputRef.current?.click()}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                    </button>
                    <button type="button" className="mic-button" disabled>
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path><path d="M19 10v2a7 7 0 0 1-14 0v-2"></path><line x1="12" y1="19" x2="12" y2="23"></line><line x1="8" y1="23" x2="16" y2="23"></line></svg>
                    </button>
                    <button 
                        type="submit" 
                        className="send-button" 
                        disabled={(!currentMessage.trim() && filesToSend.length === 0) || isLoading}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
                    </button>
                </form>
            </div>
        </div>
    );
};
