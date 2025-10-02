import React, { useRef, useEffect } from 'react';
import { ChatData } from '../../../types';
import { ChatMessage } from './ChatMessage';
import { ActionableMessage } from './ActionableMessage';

interface ChatLogProps {
    chat: ChatData;
    isLoading: boolean;
    error: string;
}

export const ChatLog: React.FC<ChatLogProps> = ({ chat, isLoading, error }) => {
    const chatLogRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (chatLogRef.current) {
            chatLogRef.current.scrollTop = chatLogRef.current.scrollHeight;
        }
    }, [chat.history, isLoading]);

    return (
        <div className="chat-log" ref={chatLogRef}>
            {chat.history.map((item, index) => {
                const part = item.parts[0];
                if (part.type === 'action' && part.actionDetails) {
                    return <ActionableMessage key={index} details={part.actionDetails} />
                }
                return <ChatMessage key={index} role={item.role} parts={item.parts} />
            })}

            {isLoading && (
                 <div className="chat-message model">
                    <div className="message-content thought-bubble">
                       Thinking...
                    </div>
                </div>
            )}
            
            {error && <div className="error-message">{error}</div>}
        </div>
    );
};