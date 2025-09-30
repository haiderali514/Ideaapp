import React, { useState } from 'react';
import { ChatData, ProjectFolder } from '../types';
import { SidebarHeader } from './components/SidebarHeader';
import { ProjectList } from './components/ProjectList';
import { UncategorizedChatList } from './components/UncategorizedChatList';

interface SidebarProps {
    isSidebarExpanded: boolean;
    setIsSidebarExpanded: (expanded: boolean) => void;
    chats: ChatData[];
    projectFolders: ProjectFolder[];
    activeChatId: string | null;
    activeProjectId: string | null;
    onNewChat: (projectId?: string | null) => void;
    onNewProject: () => void;
    onSelectProject: (projectId: string) => void;
    onSelectChat: (chatId: string) => void;
    onOpenRenameModal: (item: ChatData | ProjectFolder) => void;
    onOpenInstructionsModal: (project: ProjectFolder) => void;
    onDeleteProject: (project: ProjectFolder) => void;
}

export const Sidebar: React.FC<SidebarProps> = (props) => {
    const [expandedSections, setExpandedSections] = useState({ projects: true, chats: true });

    const toggleSection = (section: 'projects' | 'chats') => {
        setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
    };

    return (
        <aside className={`sidebar ${!props.isSidebarExpanded ? 'collapsed' : ''}`}>
            <div className="sidebar-content">
                <SidebarHeader 
                    isSidebarExpanded={props.isSidebarExpanded} 
                    setIsSidebarExpanded={props.setIsSidebarExpanded}
                />
                <div className="sidebar-section">
                     <button className="sidebar-item" onClick={() => props.onNewChat()}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path></svg>
                        {props.isSidebarExpanded && <span>New chat</span>}
                         <span className="tooltip">New chat</span>
                    </button>
                </div>
                
                <ProjectList 
                    isExpanded={expandedSections.projects}
                    isSidebarExpanded={props.isSidebarExpanded}
                    onToggle={() => toggleSection('projects')}
                    projectFolders={props.projectFolders}
                    chats={props.chats}
                    activeProjectId={props.activeProjectId}
                    activeChatId={props.activeChatId}
                    onSelectProject={props.onSelectProject}
                    onSelectChat={props.onSelectChat}
                    onNewChat={props.onNewChat}
                    onNewProject={props.onNewProject}
                    onOpenRenameModal={props.onOpenRenameModal}
                    onOpenInstructionsModal={props.onOpenInstructionsModal}
                    onDeleteProject={props.onDeleteProject}
                />

                <UncategorizedChatList
                    isExpanded={expandedSections.chats}
                    isSidebarExpanded={props.isSidebarExpanded}
                    onToggle={() => toggleSection('chats')}
                    chats={props.chats}
                    activeChatId={props.activeChatId}
                    onSelectChat={props.onSelectChat}
                />
            </div>
        </aside>
    );
};
