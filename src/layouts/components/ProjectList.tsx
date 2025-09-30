import React, { useState, useRef, useEffect } from 'react';
import { ChatData, ProjectFolder } from '../../types';

interface ProjectListProps {
    isSidebarExpanded: boolean;
    projectFolders: ProjectFolder[];
    chats: ChatData[];
    activeProjectId: string | null;
    activeChatId: string | null;
    onSelectProject: (projectId: string) => void;
    onSelectChat: (chatId: string) => void;
    onNewChat: (projectId?: string | null) => void;
    onNewProject: () => void;
    onOpenRenameModal: (item: ChatData | ProjectFolder) => void;
    onOpenInstructionsModal: (project: ProjectFolder) => void;
    onDeleteProject: (project: ProjectFolder) => void;
}

export const ProjectList: React.FC<ProjectListProps> = (props) => {
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

    return (
        <>
            <div className="sidebar-section-title">
                <span>Projects</span>
            </div>
             <div className="sidebar-section new-project-section">
                <button className="sidebar-item" onClick={props.onNewProject}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
                        <line x1="12" y1="11" x2="12" y2="17"></line>
                        <line x1="9" y1="14" x2="15" y2="14"></line>
                    </svg>
                    {props.isSidebarExpanded && <span>New project</span>}
                    <span className="tooltip">New project</span>
                </button>
            </div>
            <ul className="project-list">
                {props.projectFolders.map(pf => (
                    <li key={pf.id} className="project-list-item">
                        <div className={`project-folder-item ${pf.id === props.activeProjectId && !props.activeChatId ? 'active' : ''}`}>
                            <div className="project-folder-name" onClick={() => props.onSelectProject(pf.id)}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path></svg>
                                {props.isSidebarExpanded && <span>{pf.name}</span>}
                                <span className="tooltip">{pf.name}</span>
                            </div>
                            {props.isSidebarExpanded && (
                            <div className="project-folder-actions">
                                <button className="add-chat-to-project-btn" onClick={(e) => { e.stopPropagation(); props.onNewChat(pf.id); }} title={`New chat in ${pf.name}`}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                                </button>
                                <div className="project-folder-options">
                                    <button onClick={() => setActiveProjectMenu(pf.id === activeProjectMenu ? null : pf.id)}>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"><path fill="currentColor" d="M5 10c-1.1 0-2 .9-2 2s.9 2 2 2s2-.9 2-2s-.9-2-2-2m14 0c-1.1 0-2 .9-2 2s.9 2 2 2s2-.9 2-2s-.9-2-2-2m-7 0c-1.1 0-2 .9-2 2s.9 2 2 2s2-.9 2-2s-.9-2-2-2"/></svg>
                                    </button>
                                        {activeProjectMenu === pf.id && (
                                        <div className="options-dropdown" ref={activeMenuRef}>
                                            <button className="dropdown-item" onClick={() => props.onNewChat(pf.id)}>New Chat</button>
                                            <button className="dropdown-item" onClick={() => props.onOpenInstructionsModal(pf)}>Set Instructions</button>
                                            <button className="dropdown-item" onClick={() => props.onOpenRenameModal(pf)}>Rename</button>
                                            <button className="dropdown-item delete" onClick={() => props.onDeleteProject(pf)}>Delete Project</button>
                                        </div>
                                    )}
                                </div>
                            </div>
                            )}
                        </div>
                        <ul className="chat-list nested">
                            {props.chats.filter(c => c.projectId === pf.id).map(chat => (
                                <li key={chat.id} className={`chat-list-item ${chat.id === props.activeChatId ? 'active' : ''}`} onClick={() => props.onSelectChat(chat.id)}>
                                    {props.isSidebarExpanded && <span>{chat.name}</span>}
                                    <span className="tooltip">{chat.name}</span>
                                </li>
                            ))}
                        </ul>
                    </li>
                ))}
            </ul>
        </>
    );
};