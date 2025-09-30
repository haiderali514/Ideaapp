import React from 'react';
import { ChatPart, ChatHistoryItem } from '../../../types';

const renderMessagePart = (part: ChatPart, index: number) => {
    if (part.text) { 
        return <div key={index} className="message-bubble" dangerouslySetInnerHTML={{ __html: (window as any).marked.parse(part.text) }}></div> 
    }
    if (part.inlineData) {
        const src = `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
        if (part.inlineData.mimeType.startsWith('image/')) { 
            return <img key={index} src={src} alt="Uploaded content" className="chat-image-attachment" /> 
        }
        return <div key={index} className="file-attachment">File: {part.inlineData.mimeType}</div>
    }
    return null;
};

export const ChatMessage: React.FC<ChatHistoryItem> = ({ role, parts }) => {
    return (
        <div className={`chat-message ${role}`}>
            <div className={`avatar ${role}`}>{role === 'user' ? 'U' : 'AI'}</div>
            <div className="message-content">
                {parts.map(renderMessagePart)}
            </div>
        </div>
    );
};
