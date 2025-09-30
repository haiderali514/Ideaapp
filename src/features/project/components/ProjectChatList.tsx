import React from 'react';
import { ChatData } from '../../../types';

interface ProjectChatListProps {
    chatsInProject: ChatData[];
    onSelectChat: (chatId: string) => void;
}

export const ProjectChatList: React.FC<ProjectChatListProps> = ({ chatsInProject, onSelectChat }) => {
    if(chatsInProject.length === 0) return null;
    
    return (
        <ul className="project-chat-list-main">
            {chatsInProject.map(chat => (
                <li key={chat.id} className="project-chat-list-item-main" onClick={() => onSelectChat(chat.id)}>
                    <h3>{chat.name}</h3>
                    <p>{chat.history[0]?.parts.find(p => p.text)?.text?.substring(0, 100) || '...'}</p>
                </li>
            ))}
        </ul>
    );
};
