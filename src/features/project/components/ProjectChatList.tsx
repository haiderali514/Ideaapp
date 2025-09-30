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
                    <div className="content">
                        <h3>{chat.name}</h3>
                        <p>{chat.history[0]?.parts.find(p => p.text)?.text || 'No messages yet...'}</p>
                    </div>
                    <div className="date">Sep 30</div>
                </li>
            ))}
        </ul>
    );
};
