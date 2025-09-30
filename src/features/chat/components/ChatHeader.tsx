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
        <header className="project-header">
            <span>{chatName}</span>
            <div className="project-options-container" ref={optionsMenuRef}>
                <button className="options-btn" onClick={() => setIsOptionsOpen(prev => !prev)}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="1"></circle><circle cx="12" cy="5" r="1"></circle><circle cx="12" cy="19" r="1"></circle></svg>
                </button>
                {isOptionsOpen && (
                    <div className="options-dropdown">
                        <button className="dropdown-item" onClick={() => handleAction(onOpenMoveModal)}>Move to Project</button>
                        <button className="dropdown-item" onClick={() => handleAction(onOpenRenameModal)}>Rename</button>
                        <button className="dropdown-item delete" onClick={() => handleAction(onDeleteChat)}>Delete Chat</button>
                    </div>
                )}
            </div>
        </header>
    );
};
