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
    onDeleteChat: (chat: ChatData) => void;
    onOpenMoveModal: (chat: ChatData) => void;
}

export const Sidebar: React.FC<SidebarProps> = (props) => {
    const [projectsExpanded, setProjectsExpanded] = useState(true);
    const [chatsExpanded, setChatsExpanded] = useState(true);

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
                    {/* Placeholder items from screenshots */}
                    <button className="sidebar-item">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                        {props.isSidebarExpanded && <span>Search chats</span>}
                        <span className="tooltip">Search chats</span>
                    </button>
                    <button className="sidebar-item">
                         <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v15H6.5A2.5 2.5 0 0 1 4 14.5V4.5A2.5 2.5 0 0 1 6.5 2z"></path></svg>
                        {props.isSidebarExpanded && <span>Library</span>}
                         <span className="tooltip">Library</span>
                    </button>
                </div>
                
                <ProjectList 
                    isSidebarExpanded={props.isSidebarExpanded}
                    isExpanded={projectsExpanded}
                    onToggle={() => setProjectsExpanded(prev => !prev)}
                    projectFolders={props.projectFolders}
                    activeProjectId={props.activeProjectId}
                    activeChatId={props.activeChatId}
                    onSelectProject={props.onSelectProject}
                    onNewProject={props.onNewProject}
                    onOpenRenameModal={props.onOpenRenameModal}
                    onDeleteProject={props.onDeleteProject}
                />

                <UncategorizedChatList
                    isExpanded={chatsExpanded}
                    isSidebarExpanded={props.isSidebarExpanded}
                    onToggle={() => setChatsExpanded(prev => !prev)}
                    chats={props.chats}
                    activeChatId={props.activeChatId}
                    onSelectChat={props.onSelectChat}
                    onOpenRenameModal={props.onOpenRenameModal}
                    onDeleteChat={props.onDeleteChat}
                    onOpenMoveModal={props.onOpenMoveModal}
                />
            </div>
            <div className="sidebar-footer">
                <div className="user-profile">
                    <div className="user-avatar">GH</div>
                    {props.isSidebarExpanded && (
                        <>
                            <div className="user-info">
                                <div className="name">Gulzar Hussain</div>
                                <div className="plan">Free</div>
                            </div>
                            <button className="upgrade-btn">Upgrade</button>
                        </>
                    )}
                </div>
            </div>
        </aside>
    );
};