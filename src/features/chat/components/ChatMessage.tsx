import React from 'react';
import { ChatPart, ChatHistoryItem } from '../../../types';

const ModelAvatar = () => (
    <div className="avatar-icon-wrapper">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2Z" fill="#A78BFA"/>
            <path d="M12 6C9.23858 6 7 8.23858 7 11C7 13.7614 9.23858 16 12 16C14.7614 16 17 13.7614 17 11C17 8.23858 14.7614 6 12 6Z" fill="white"/>
            <circle cx="10" cy="10.5" r="1.5" fill="#A78BFA"/>
        </svg>
    </div>
);


const renderMessagePart = (part: ChatPart, index: number) => {
    if (part.type === 'thought') {
        return <div key={index} className="message-content thought-bubble">{part.text}</div>;
    }
    if (part.text) { 
        // Using a simple regex to split "3 edits made" from the rest of the text
        const match = part.text.match(/(\d+ edits made)\s*(.*)/s);
        if (match) {
            return (
                <div key={index} className="message-content">
                    <div className="edits-summary">
                        <span>{match[1]}</span>
                        <button>Show all</button>
                    </div>
                    <p>{match[2]}</p>
                </div>
            )
        }
        return <div key={index} className="message-content"><p>{part.text}</p></div> 
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
    if (parts[0]?.type === 'thought') {
        return <div className="chat-message model">{renderMessagePart(parts[0], 0)}</div>
    }
    
    return (
        <div className={`chat-message ${role}`}>
            <div className={`avatar ${role}`}>{role === 'user' ? null : <ModelAvatar />}</div>
            {parts.map(renderMessagePart)}
        </div>
    );
};