import React, { useRef, useState, useEffect } from 'react';
import { FilePreviews } from './FilePreviews';
import { ExtraMenu } from './ExtraMenu';

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
    const [isExtraMenuOpen, setIsExtraMenuOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);


    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            onFormSubmit(e as any);
        }
    };
    
    // Auto-resize textarea
    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
        }
    }, [currentMessage]);
    
    // Close menu on outside click
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsExtraMenuOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="message-input-container">
             <FilePreviews files={filesToSend} onRemoveFile={onRemoveFile} />
            <form onSubmit={onFormSubmit} className="message-input-form">
                <div className="chat-form-wrapper">
                     <textarea 
                        ref={textareaRef}
                        className="chat-textarea" 
                        value={currentMessage} 
                        onChange={(e) => setCurrentMessage(e.target.value)} 
                        onKeyDown={handleKeyDown} 
                        placeholder="Ask Lovable..." 
                        rows={1} 
                    />
                    <div className="journal-controls-row">
                        <div className="journal-controls-left">
                            <div ref={menuRef} className="journal-input-menu-container">
                                <button type="button" className="journal-action-btn menu-btn" onClick={() => setIsExtraMenuOpen(prev => !prev)}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                                </button>
                                {isExtraMenuOpen && <ExtraMenu onAttachClick={() => {
                                    fileInputRef.current?.click();
                                    setIsExtraMenuOpen(false);
                                }} />}
                            </div>
                            <button type="button" className="journal-action-btn-mode">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/></svg>
                                <span>Edit</span>
                            </button>
                        </div>

                        <div className="journal-controls-right">
                            <button type="button" className="journal-action-btn-mode">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15.09 14.37a5 5 0 0 1-6.18 0M12 2a5 5 0 0 1 5 5c0 1.94-1.19 3.13-2.5 4.5h-5C8.19 10.13 7 8.94 7 7a5 5 0 0 1 5-5z"></path><path d="M9 16.05V22h6v-5.95"></path></svg>
                                <span>Chat</span>
                            </button>
                            <button type="button" className="journal-voice-btn">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path></svg>
                            </button>
                            <button 
                                type="submit" 
                                className="send-button-journal" 
                                disabled={(!currentMessage.trim() && filesToSend.length === 0) || isLoading}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="19" x2="12" y2="5"></line><polyline points="5 12 12 5 19 12"></polyline></svg>
                            </button>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
};