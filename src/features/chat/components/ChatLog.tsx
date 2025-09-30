import React, { useRef, useEffect } from 'react';
import { ChatData } from '../../../types';
import { ChatMessage } from './ChatMessage';
import { EmptyChat } from './EmptyChat';

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
            {chat.history.length === 0 && !isLoading && <EmptyChat chatName={chat.name} />}
            
            {chat.history.map((item, index) => (
                <ChatMessage key={index} role={item.role} parts={item.parts} />
            ))}

            {isLoading && (
                <div className="chat-message model">
                    <div className="avatar model">AI</div>
                    <div className="message-content">
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
    );
};
