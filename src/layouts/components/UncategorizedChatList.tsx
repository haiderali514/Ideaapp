import React from 'react';
import { ChatData } from '../../types';

interface UncategorizedChatListProps {
    isExpanded: boolean;
    isSidebarExpanded: boolean;
    onToggle: () => void;
    chats: ChatData[];
    activeChatId: string | null;
    onSelectChat: (chatId: string) => void;
}

export const UncategorizedChatList: React.FC<UncategorizedChatListProps> = (props) => {
    const { isExpanded, onToggle, chats, activeChatId, onSelectChat, isSidebarExpanded } = props;
    const uncategorizedChats = chats.filter(c => !c.projectId);

    if (uncategorizedChats.length === 0) return null;

    return (
        <>
            <div className={`sidebar-section-header ${!isExpanded ? 'collapsed' : ''}`} onClick={onToggle}>
                <span>Chats</span>
                <svg className="chevron" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
            </div>
            <ul className={`chat-list ${!isExpanded ? 'collapsed' : ''}`}>
                {uncategorizedChats.map(chat => (
                <li key={chat.id} className={`chat-list-item ${chat.id === activeChatId ? 'active' : ''}`} onClick={() => onSelectChat(chat.id)}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
                    {isSidebarExpanded && <span>{chat.name}</span>}
                    <span className="tooltip">{chat.name}</span>
                </li>
                ))}
            </ul>
        </>
    );
};
