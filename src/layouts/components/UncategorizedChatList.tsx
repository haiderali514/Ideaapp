import React, { useState, useRef, useEffect } from 'react';
import { ChatData } from '../../types';

interface UncategorizedChatListProps {
    isExpanded: boolean;
    isSidebarExpanded: boolean;
    onToggle: () => void;
    chats: ChatData[];
    activeChatId: string | null;
    onSelectChat: (chatId: string) => void;
    onDeleteChat: (chat: ChatData) => void;
    onOpenRenameModal: (item: ChatData) => void;
}

export const UncategorizedChatList: React.FC<UncategorizedChatListProps> = (props) => {
    const { isExpanded, onToggle, chats, activeChatId, onSelectChat, isSidebarExpanded, onDeleteChat, onOpenRenameModal } = props;
    const uncategorizedChats = chats.filter(c => !c.projectId);

    const [activeChatMenu, setActiveChatMenu] = useState<string | null>(null);
    const activeMenuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (activeMenuRef.current && !activeMenuRef.current.contains(event.target as Node)) {
                setActiveChatMenu(null);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleAction = (action: () => void) => {
        action();
        setActiveChatMenu(null);
    }

    if (uncategorizedChats.length === 0) return null;
    
    if (isSidebarExpanded && !isExpanded) {
        return (
             <div className="sidebar-section-header collapsible" onClick={onToggle}>
                <span>Chats &gt;</span>
            </div>
        )
    }

    return (
        <>
            <div className={`sidebar-section-header collapsible ${!isExpanded ? 'collapsed' : ''}`} onClick={onToggle}>
                <span>Chats</span>
            </div>
            <ul className={`chat-list ${!isExpanded || !isSidebarExpanded ? 'collapsed' : ''}`}>
                {uncategorizedChats.map(chat => (
                <li key={chat.id} className={`chat-list-item ${chat.id === activeChatId ? 'active' : ''}`} onClick={() => onSelectChat(chat.id)}>
                    <div className="chat-item-content">
                        {isSidebarExpanded && <span>{chat.name}</span>}
                    </div>
                    <span className="tooltip">{chat.name}</span>
                     {isSidebarExpanded && (
                            <div className="project-folder-actions" ref={activeChatMenu === chat.id ? activeMenuRef : null}>
                                <button className="item-options-btn" onClick={(e) => { e.stopPropagation(); setActiveChatMenu(chat.id === activeChatMenu ? null : chat.id)}}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"><path fill="currentColor" d="M5 10c-1.1 0-2 .9-2 2s.9 2 2 2s2-.9 2-2s-.9-2-2-2m14 0c-1.1 0-2 .9-2 2s.9 2 2 2s2-.9 2-2s-.9-2-2-2m-7 0c-1.1 0-2 .9-2 2s.9 2 2 2s2-.9 2-2s-.9-2-2-2"/></svg>
                                </button>
                                {activeChatMenu === chat.id && (
                                    <div className="options-dropdown">
                                        <button className="dropdown-item" onClick={() => handleAction(() => onOpenRenameModal(chat))}>Rename</button>
                                        <button className="dropdown-item delete" onClick={() => handleAction(() => onDeleteChat(chat))}>Delete chat</button>
                                    </div>
                                )}
                            </div>
                        )}
                </li>
                ))}
            </ul>
        </>
    );
};
