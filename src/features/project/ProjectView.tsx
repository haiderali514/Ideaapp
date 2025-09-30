import React from 'react';
import { ProjectFolder, ChatData } from '../../types';
import { ProjectHeader } from './components/ProjectHeader';
import { NewChatInput } from './components/NewChatInput';
import { ProjectChatList } from './components/ProjectChatList';

interface ProjectViewProps {
    project: ProjectFolder;
    chatsInProject: ChatData[];
    filesToSend: File[];
    isLoading: boolean;
    onNewMessageInProject: (message: string, projectId: string) => void;
    onRemoveFile: (index: number) => void;
    onSelectChat: (chatId: string) => void;
    fileInputRef: React.RefObject<HTMLInputElement>;
    onOpenRenameModal: () => void;
    onOpenInstructionsModal: () => void;
    onDeleteProject: () => void;
}

export const ProjectView: React.FC<ProjectViewProps> = (props) => {
    return (
        <div className="project-landing-view">
            <ProjectHeader 
                project={props.project}
                fileInputRef={props.fileInputRef}
                onOpenRenameModal={props.onOpenRenameModal}
                onOpenInstructionsModal={props.onOpenInstructionsModal}
                onDeleteProject={props.onDeleteProject}
            />
            <NewChatInput
                project={props.project}
                filesToSend={props.filesToSend}
                isLoading={props.isLoading}
                onNewMessageInProject={props.onNewMessageInProject}
                onRemoveFile={props.onRemoveFile}
            />
            <ProjectChatList
                chatsInProject={props.chatsInProject}
                onSelectChat={props.onSelectChat}
            />
        </div>
    );
};
