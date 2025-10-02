import React, { useState, useEffect, useRef } from 'react';
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
    onOpenSettingsModal: () => void;
}

export const Sidebar: React.FC<SidebarProps> = (props) => {
    const [projectsExpanded, setProjectsExpanded] = useState(true);
    const [chatsExpanded, setChatsExpanded] = useState(true);
    const [isProfileSettingsOpen, setIsProfileSettingsOpen] = useState(false);
    const profileMenuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
                setIsProfileSettingsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleProfileMenuAction = (action: () => void) => {
        action();
        setIsProfileSettingsOpen(false);
    }

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
                    <button className="sidebar-item">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                        {props.isSidebarExpanded && <span>Search chats</span>}
                        <span className="tooltip">Search chats</span>
                    </button>
                    <button className="sidebar-item">
                         <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v15H6.5A2.5 2.5 0 0 1 4 14.5V4.5A2.5 2.5 0 0 1 6.5 2z"></path></svg>
                        {props.isSidebarExpanded && <span>Journal</span>}
                         <span className="tooltip">Journal</span>
                    </button>
                </div>
                
                <ProjectList 
                    isSidebarExpanded={props.isSidebarExpanded}
                    isExpanded={projectsExpanded}
                    onToggle={() => setProjectsExpanded(prev => !prev)}
                    projectFolders={props.projectFolders}
                    chats={props.chats}
                    activeProjectId={props.activeProjectId}
                    activeChatId={props.activeChatId}
                    onSelectProject={props.onSelectProject}
                    onSelectChat={props.onSelectChat}
                    onNewProject={props.onNewProject}
                    onNewChat={props.onNewChat}
                    onOpenRenameModal={props.onOpenRenameModal}
                    onOpenInstructionsModal={props.onOpenInstructionsModal}
                    onDeleteProject={props.onDeleteProject}
                    onDeleteChat={props.onDeleteChat}
                    onOpenMoveModal={props.onOpenMoveModal}
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
            <div className="sidebar-footer" ref={profileMenuRef}>
                 {isProfileSettingsOpen && (
                    <div className="options-dropdown profile-options-dropdown">
                        <div className="dropdown-section">
                            <button className="dropdown-item">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                                <span>gulzarhussain...</span>
                            </button>
                        </div>
                        <div className="dropdown-section">
                            <button className="dropdown-item">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
                                <span>Upgrade plan</span>
                            </button>
                            <button className="dropdown-item" onClick={() => handleProfileMenuAction(props.onOpenSettingsModal)}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>
                                <span>Settings</span>
                            </button>
                        </div>
                        <div className="dropdown-divider"></div>
                        <div className="dropdown-section">
                            <button className="dropdown-item">
                                <span>Help</span>
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
                            </button>
                             <button className="dropdown-item">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
                                <span>Log out</span>
                            </button>
                        </div>
                    </div>
                )}
                <button className="user-profile" onClick={() => setIsProfileSettingsOpen(p => !p)}>
                    <div className="user-avatar">GH</div>
                    {props.isSidebarExpanded && (
                         <div className="user-details-expanded">
                            <div className="user-info">
                                <span className="name">Gulzar Hussain</span>
                                <span className="plan">Free</span>
                            </div>
                        </div>
                    )}
                </button>
            </div>
        </aside>
    );
};