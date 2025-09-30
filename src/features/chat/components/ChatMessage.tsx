import React from 'react';
import { ChatPart, ChatHistoryItem } from '../../../types';

const ModelAvatar = () => (
    <svg width="24" height="24" viewBox="0 0 41 41" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M35.2184 21.2852C35.2184 22.6281 34.6683 23.8999 33.7211 24.8471L29.5391 29.0291C28.5919 29.9763 27.3201 30.5264 25.9772 30.5264H15.0225C13.6796 30.5264 12.4078 29.9763 11.4606 29.0291L7.27864 24.8471C6.33146 23.8999 5.78125 22.6281 5.78125 21.2852V15.0225C5.78125 13.6796 6.33146 12.4078 7.27864 11.4606L11.4606 7.27864C12.4078 6.33146 13.6796 5.78125 15.0225 5.78125H25.9772C27.3201 5.78125 28.5919 6.33146 29.5391 7.27864L33.7211 11.4606C34.6683 12.4078 35.2184 13.6796 35.2184 15.0225V21.2852Z" fill="currentColor"></path>
    </svg>
);

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
            <div className={`avatar ${role}`}>{role === 'user' ? 'U' : <ModelAvatar />}</div>
            <div className="message-content">
                {parts.map(renderMessagePart)}
            </div>
        </div>
    );
};
