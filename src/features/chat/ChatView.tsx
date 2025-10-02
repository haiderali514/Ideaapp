import React from 'react';
import { ChatData } from '../../types';
import { ChatHeader } from './components/ChatHeader';
import { ChatLog } from './components/ChatLog';
import { MessageInput } from './components/MessageInput';

interface ChatViewProps {
    chat: ChatData;
    isLoading: boolean;
    error: string;
    filesToSend: File[];
    currentMessage: string;
    setCurrentMessage: (value: string) => void;
    onFormSubmit: (e: React.FormEvent) => void;
    onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onRemoveFile: (index: number) => void;
    onOpenRenameModal: () => void;
    onOpenMoveModal: () => void;
    onDeleteChat: () => void;
    fileInputRef: React.RefObject<HTMLInputElement>;
}

export const ChatView: React.FC<ChatViewProps> = (props) => {
    return (
        <div className="chat-view">
            <ChatHeader 
                chatName={props.chat.name}
                onOpenMoveModal={props.onOpenMoveModal}
                onOpenRenameModal={props.onOpenRenameModal}
                onDeleteChat={props.onDeleteChat}
            />
            <ChatLog
                chat={props.chat}
                isLoading={props.isLoading}
                error={props.error}
            />
            <MessageInput
                currentMessage={props.currentMessage}
                setCurrentMessage={props.setCurrentMessage}
                filesToSend={props.filesToSend}
                isLoading={props.isLoading}
                onFormSubmit={props.onFormSubmit}
                onRemoveFile={props.onRemoveFile}
                fileInputRef={props.fileInputRef}
            />
        </div>
    );
};