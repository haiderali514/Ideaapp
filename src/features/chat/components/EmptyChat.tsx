import React from 'react';

interface EmptyChatProps {
    chatName: string;
}

export const EmptyChat: React.FC<EmptyChatProps> = ({ chatName }) => (
    <div className="empty-chat-placeholder">
        <h2>{chatName}</h2>
        <p>Send a message or attach a file to start.</p>
    </div>
);
