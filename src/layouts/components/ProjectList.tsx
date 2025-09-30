import React, { useState, useRef, useEffect } from 'react';
import { ChatData, ProjectFolder } from '../../types';

interface ProjectListProps {
    isSidebarExpanded: boolean;
    isExpanded: boolean;
    onToggle: () => void;
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
    const { isSidebarExpanded, isExpanded, onToggle } = props;
    const [activeProjectMenu, setActiveProjectMenu] = useState<string | null>(null);
    const activeMenuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (activeMenuRef.current && !activeMenuRef.current.contains(event.target as Node)) {
                setActiveProjectMenu(null);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleAction = (action: () => void) => {
        action();
        setActiveProjectMenu(null);
    }
    
    if (isSidebarExpanded && !isExpanded) {
        return (
            <div className="sidebar-section-header collapsible" onClick={onToggle}>
                <span>Projects &gt;</span>
            </div>
        )
    }

    return (
        <>
            <div className={`sidebar-section-header collapsible ${!isExpanded ? 'collapsed' : ''}`} onClick={onToggle}>
                <span>Projects</span>
            </div>
            <ul className={`project-list ${!isExpanded || !isSidebarExpanded ? 'collapsed' : ''}`}>
                <li className="sidebar-item" onClick={props.onNewProject}>
                    <div className="chat-item-content">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
                            <line x1="12" y1="11" x2="12" y2="17"></line>
                            <line x1="9" y1="14" x2="15" y2="14"></line>
                        </svg>
                        {isSidebarExpanded && <span>New project</span>}
                    </div>
                    <span className="tooltip">New project</span>
                </li>
                {props.projectFolders.map(pf => (
                    <li key={pf.id} className={`project-folder-item ${pf.id === props.activeProjectId && !props.activeChatId ? 'active' : ''}`}>
                        <div className="project-folder-name" onClick={() => props.onSelectProject(pf.id)}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path></svg>
                            {isSidebarExpanded && <span>{pf.name}</span>}
                            <span className="tooltip">{pf.name}</span>
                        </div>
                        {isSidebarExpanded && (
                            <div className="project-folder-actions" ref={activeProjectMenu === pf.id ? activeMenuRef : null}>
                                <button className="item-options-btn" onClick={() => setActiveProjectMenu(pf.id === activeProjectMenu ? null : pf.id)}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"><path fill="currentColor" d="M5 10c-1.1 0-2 .9-2 2s.9 2 2 2s2-.9 2-2s-.9-2-2-2m14 0c-1.1 0-2 .9-2 2s.9 2 2 2s2-.9 2-2s-.9-2-2-2m-7 0c-1.1 0-2 .9-2 2s.9 2 2 2s2-.9 2-2s-.9-2-2-2"/></svg>
                                </button>
                                {activeProjectMenu === pf.id && (
                                    <div className="options-dropdown">
                                        <button className="dropdown-item" onClick={() => handleAction(() => props.onOpenRenameModal(pf))}>Rename project</button>
                                        <button className="dropdown-item delete" onClick={() => handleAction(() => props.onDeleteProject(pf))}>Delete project</button>
                                    </div>
                                )}
                            </div>
                        )}
                    </li>
                ))}
            </ul>
        </>
    );
};
