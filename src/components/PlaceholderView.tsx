import React from 'react';
import { MessageInput } from '../features/chat/components/MessageInput';
import { ChatData } from '../types';

interface PlaceholderViewProps {
    currentMessage: string;
    setCurrentMessage: (value: string) => void;
    filesToSend: File[];
    isLoading: boolean;
    onFormSubmit: (e: React.FormEvent) => void;
    onRemoveFile: (index: number) => void;
    fileInputRef: React.RefObject<HTMLInputElement>;
}

export const PlaceholderView: React.FC<PlaceholderViewProps> = (props) => {

    const handleNewChatSubmit = (e: React.FormEvent) => {
        // In placeholder view, submitting the form will create a new chat.
        // The logic for this is handled in the AppContext/useChatHandler,
        // we just need to trigger the standard form submission.
        props.onFormSubmit(e);
    };

    return (
        <div className="placeholder">
            <div className="placeholder-content">
                <h1>What can I help with?</h1>
            </div>
            <MessageInput 
                {...props}
                onFormSubmit={handleNewChatSubmit}
            />
        </div>
    );
};
