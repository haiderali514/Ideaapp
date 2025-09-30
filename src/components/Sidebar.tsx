import React, { useState, useEffect, useRef } from 'react';
import { ChatData, ProjectFolder } from '../types';

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

export const Sidebar: React.FC<SidebarProps> = ({
    isSidebarExpanded,
    setIsSidebarExpanded,
    chats,
    projectFolders,
    activeChatId,
    activeProjectId,
    onNewChat,
    onNewProject,
    onSelectProject,
    onSelectChat,
    onOpenRenameModal,
    onOpenInstructionsModal,
    onDeleteProject
}) => {
    const [expandedSections, setExpandedSections] = useState({ projects: true, chats: true });
    const [activeProjectMenu, setActiveProjectMenu] = useState<string | null>(null);
    const activeMenuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (activeMenuRef.current && !activeMenuRef.current.contains(event.target as Node) && !(event.target as Element).closest('.project-folder-options button')) {
                setActiveProjectMenu(null);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const toggleSection = (section: 'projects' | 'chats') => setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));

    return (
        <aside className={`sidebar ${!isSidebarExpanded ? 'collapsed' : ''}`}>
            <div className="sidebar-content">
                <div className="sidebar-header">
                     <button className="sidebar-logo">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 2L2 7V17L12 22L22 17V7L12 2Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M2 7L12 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M12 22V12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M22 7L12 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M17 4.5L7 9.5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
                        {isSidebarExpanded && <span>IdeaPlan AI</span>}
                    </button>
                    <button className="sidebar-toggle" onClick={() => setIsSidebarExpanded(!isSidebarExpanded)}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="9" y1="3" x2="9" y2="21"></line></svg>
                         <span className="tooltip">{isSidebarExpanded ? 'Close sidebar' : 'Open sidebar'}</span>
                    </button>
                </div>
                <div className="sidebar-section">
                     <button className="sidebar-item" onClick={() => onNewChat()}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path></svg>
                        {isSidebarExpanded && <span>New chat</span>}
                         <span className="tooltip">New chat</span>
                    </button>
                </div>
                
                <div className={`sidebar-section-header ${!expandedSections.projects ? 'collapsed' : ''}`} onClick={() => toggleSection('projects')}>
                    <span>Projects</span>
                    <div style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
                      <button className="add-project-btn" onClick={(e) => { e.stopPropagation(); onNewProject(); }}><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg></button>
                      <svg className="chevron" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
                    </div>
                </div>
                <ul className={`project-list ${!expandedSections.projects ? 'collapsed' : ''}`}>
                    {projectFolders.map(pf => (
                        <li key={pf.id} className="project-list-item">
                            <div className={`project-folder-item ${pf.id === activeProjectId && !activeChatId ? 'active' : ''}`}>
                                <div className="project-folder-name" onClick={() => onSelectProject(pf.id)}>
                                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path></svg>
                                  {isSidebarExpanded && <span>{pf.name}</span>}
                                  <span className="tooltip">{pf.name}</span>
                                </div>
                                {isSidebarExpanded && (
                                <div className="project-folder-actions">
                                    <button className="add-chat-to-project-btn" onClick={(e) => { e.stopPropagation(); onNewChat(pf.id); }} title={`New chat in ${pf.name}`}>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                                    </button>
                                    <div className="project-folder-options">
                                        <button onClick={() => setActiveProjectMenu(pf.id === activeProjectMenu ? null : pf.id)}>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"><path fill="currentColor" d="M5 10c-1.1 0-2 .9-2 2s.9 2 2 2s2-.9 2-2s-.9-2-2-2m14 0c-1.1 0-2 .9-2 2s.9 2 2 2s2-.9 2-2s-.9-2-2-2m-7 0c-1.1 0-2 .9-2 2s.9 2 2 2s2-.9 2-2s-.9-2-2-2"/></svg>
                                        </button>
                                         {activeProjectMenu === pf.id && (
                                            <div className="options-dropdown" ref={activeMenuRef}>
                                                <button className="dropdown-item" onClick={() => onNewChat(pf.id)}>New Chat</button>
                                                <button className="dropdown-item" onClick={() => onOpenInstructionsModal(pf)}>Set Instructions</button>
                                                <button className="dropdown-item" onClick={() => onOpenRenameModal(pf)}>Rename</button>
                                                <button className="dropdown-item delete" onClick={() => onDeleteProject(pf)}>Delete Project</button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                )}
                            </div>
                            <ul className="chat-list nested">
                                {chats.filter(c => c.projectId === pf.id).map(chat => (
                                    <li key={chat.id} className={`chat-list-item ${chat.id === activeChatId ? 'active' : ''}`} onClick={() => onSelectChat(chat.id)}>
                                        {isSidebarExpanded && <span>{chat.name}</span>}
                                        <span className="tooltip">{chat.name}</span>
                                    </li>
                                ))}
                            </ul>
                        </li>
                    ))}
                </ul>

                <div className={`sidebar-section-header ${!expandedSections.chats ? 'collapsed' : ''}`} onClick={() => toggleSection('chats')}>
                    <span>Chats</span>
                    <svg className="chevron" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
                </div>
                 <ul className={`chat-list ${!expandedSections.chats ? 'collapsed' : ''}`}>
                    {chats.filter(c => !c.projectId).map(chat => (
                    <li key={chat.id} className={`chat-list-item ${chat.id === activeChatId ? 'active' : ''}`} onClick={() => onSelectChat(chat.id)}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
                        {isSidebarExpanded && <span>{chat.name}</span>}
                        <span className="tooltip">{chat.name}</span>
                    </li>
                    ))}
                </ul>
            </div>
        </aside>
    );
};
