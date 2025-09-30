import React, { useState, useRef, useEffect } from 'react';
import { ChatData, ChatPart } from '../types';

interface ChatViewProps {
    chat: ChatData;
    isLoading: boolean;
    error: string;
    filesToSend: File[];
    currentMessage: string;
    setCurrentMessage: (value: string) => void;
    onFormSubmit: (e: React.FormEvent) => void;
    onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onRemoveFile: (index: number) => void;
    onOpenRenameModal: (item: ChatData) => void;
    onOpenMoveModal: () => void;
    onDeleteChat: (chat: ChatData) => void;
    fileInputRef: React.RefObject<HTMLInputElement>;
}

export const ChatView: React.FC<ChatViewProps> = ({
    chat,
    isLoading,
    error,
    filesToSend,
    currentMessage,
    setCurrentMessage,
    onFormSubmit,
    onFileChange,
    onRemoveFile,
    onOpenRenameModal,
    onOpenMoveModal,
    onDeleteChat,
    fileInputRef,
}) => {
    const [isProjectOptionsOpen, setIsProjectOptionsOpen] = useState(false);
    const optionsMenuRef = useRef<HTMLDivElement>(null);
    const chatLogRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (chatLogRef.current) {
            chatLogRef.current.scrollTop = chatLogRef.current.scrollHeight;
        }
    }, [chat.history, isLoading]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (optionsMenuRef.current && !optionsMenuRef.current.contains(event.target as Node)) {
                setIsProjectOptionsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const renderMessagePart = (part: ChatPart, index: number) => {
        if (part.text) { return <div key={index} className="message-bubble" dangerouslySetInnerHTML={{ __html: (window as any).marked.parse(part.text) }}></div> }
        if (part.inlineData) {
            const src = `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
            if (part.inlineData.mimeType.startsWith('image/')) { return <img key={index} src={src} alt="Uploaded content" className="chat-image-attachment" /> }
            return <div key={index} className="file-attachment">File: {part.inlineData.mimeType}</div>
        }
        return null;
    };
    
    return (
        <div className="chat-view">
            <header className="project-header">
                <span>{chat.name}</span>
                <div className="project-options-container" ref={optionsMenuRef}>
                    <button className="options-btn" onClick={() => setIsProjectOptionsOpen(prev => !prev)}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="1"></circle><circle cx="12" cy="5" r="1"></circle><circle cx="12" cy="19" r="1"></circle></svg>
                    </button>
                    {isProjectOptionsOpen && (
                        <div className="options-dropdown">
                            <button className="dropdown-item" onClick={() => { onOpenMoveModal(); setIsProjectOptionsOpen(false); }}>Move to Project</button>
                            <button className="dropdown-item" onClick={() => { onOpenRenameModal(chat); setIsProjectOptionsOpen(false); }}>Rename</button>
                            <button className="dropdown-item delete" onClick={() => { onDeleteChat(chat); setIsProjectOptionsOpen(false); }}>Delete Chat</button>
                        </div>
                    )}
                </div>
            </header>
            <div className="chat-log" ref={chatLogRef}>
                {chat.history.length === 0 && !isLoading && (
                    <div className="empty-chat-placeholder"><h2>{chat.name}</h2><p>Send a message or attach a file to start.</p></div>
                )}
                {chat.history.map((item, index) => (
                    <div key={index} className={`chat-message ${item.role}`}>
                        <div className={`avatar ${item.role}`}>{item.role === 'user' ? 'U' : 'AI'}</div>
                        <div className="message-content">
                            {item.parts.map(renderMessagePart)}
                        </div>
                    </div>
                ))}
                {isLoading && (
                    <div className="chat-message model">
                        <div className="avatar model">AI</div>
                        <div className="message-content">
                            {/* Check if the last message is an empty model response, if so show loading dots, otherwise show the streaming text */}
                            {chat.history[chat.history.length - 1]?.parts[0]?.text === '' ? (
                                <div className="loading-dots"><span></span><span></span><span></span></div>
                            ) : (
                                <div className="message-bubble" dangerouslySetInnerHTML={{ __html: (window as any).marked.parse(chat.history[chat.history.length - 1]?.parts[0]?.text || '' + '█') }}></div>
                            )}
                        </div>
                    </div>
                )}
                {error && <div className="error-message">{error}</div>}
            </div>
            <div className="chat-form-container">
                <div className="file-previews">
                    {filesToSend.map((file, index) => (
                        <div key={index} className="file-preview-chip">
                            {file.type.startsWith('image/') ? <img src={URL.createObjectURL(file)} alt={file.name} /> : <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9l-7-7z"></path><polyline points="13 2 13 9 20 9"></polyline></svg>}
                            <span>{file.name}</span>
                            <button onClick={() => onRemoveFile(index)}>×</button>
                        </div>
                    ))}
                </div>
                <form className="chat-form" onSubmit={onFormSubmit}>
                    <button type="button" className="attach-button" onClick={() => fileInputRef.current?.click()}>
                        {/* FIX: Corrected the malformed viewBox attribute in the SVG element. */}
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"></path></svg>
                    </button>
                    <textarea className="chat-textarea" value={currentMessage} onChange={(e) => setCurrentMessage(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); onFormSubmit(e as any); } }} placeholder="Type a message..." rows={1} />
                    <button type="submit" className="send-button" disabled={(!currentMessage.trim() && filesToSend.length === 0) || isLoading}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
                    </button>
                </form>
            </div>
        </div>
    );
};