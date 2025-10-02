import React, { useState, useRef, useEffect } from 'react';

interface ChatHeaderProps {
    chatName: string;
    onOpenRenameModal: () => void;
    onOpenMoveModal: () => void;
    onDeleteChat: () => void;
}

export const ChatHeader: React.FC<ChatHeaderProps> = ({ chatName, onOpenMoveModal, onOpenRenameModal, onDeleteChat }) => {
    const [isOptionsOpen, setIsOptionsOpen] = useState(false);
    const optionsMenuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (optionsMenuRef.current && !optionsMenuRef.current.contains(event.target as Node)) {
                setIsOptionsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleAction = (action: () => void) => {
        action();
        setIsOptionsOpen(false);
    }

    return (
        <header className="left-panel-header">
            <h3>{chatName}</h3>
            <div className="project-header-actions">
                <div className="chat-options-container" ref={optionsMenuRef}>
                    <button className="options-btn" onClick={() => setIsOptionsOpen(prev => !prev)}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"><path fill="currentColor" d="M5 10c-1.1 0-2 .9-2 2s.9 2 2 2s2-.9 2-2s-.9-2-2-2m14 0c-1.1 0-2 .9-2 2s.9 2 2 2s2-.9 2-2s-.9-2-2-2m-7 0c-1.1 0-2 .9-2 2s.9 2 2 2s2-.9 2-2s-.9-2-2-2"/></svg>
                    </button>
                    {isOptionsOpen && (
                        <div className="options-dropdown">
                            <button className="dropdown-item" onClick={() => handleAction(onOpenMoveModal)}>Move to project...</button>
                            <button className="dropdown-item" onClick={() => handleAction(onOpenRenameModal)}>Rename</button>
                            <div className="dropdown-divider"></div>
                            <button className="dropdown-item delete" onClick={() => handleAction(onDeleteChat)}>Delete Chat</button>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};