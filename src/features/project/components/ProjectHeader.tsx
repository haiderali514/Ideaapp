import React, { useState, useRef, useEffect } from 'react';
import { ProjectFolder } from '../../../types';

interface ProjectHeaderProps {
    project: ProjectFolder;
    fileInputRef: React.RefObject<HTMLInputElement>;
    onOpenRenameModal: () => void;
    onOpenInstructionsModal: () => void;
    onDeleteProject: () => void;
}

export const ProjectHeader: React.FC<ProjectHeaderProps> = (props) => {
    const { project, fileInputRef, onOpenRenameModal, onOpenInstructionsModal, onDeleteProject } = props;
    const [isOptionsOpen, setIsOptionsOpen] = useState(false);
    const optionsMenuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (optionsMenuRef.current && !optionsMenuRef.current.contains(event.target as Node)) {
                setIsOptionsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleAction = (action: () => void) => {
        action();
        setIsOptionsOpen(false);
    }

    return (
        <header className="project-landing-header">
            <h1 className="project-landing-title">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path></svg>
                {project.name}
            </h1>
            <div className="project-header-actions">
                <button className="add-files-btn" onClick={() => fileInputRef.current?.click()}>Add files</button>
                 <button className="generate-btn">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style={{marginRight: '8px'}}><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>
                    GitHub Sync
                </button>
                <div className="project-options-container" ref={optionsMenuRef}>
                    <button className="options-btn" onClick={() => setIsOptionsOpen(prev => !prev)}>
                         <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"><path fill="currentColor" d="M5 10c-1.1 0-2 .9-2 2s.9 2 2 2s2-.9 2-2s-.9-2-2-2m14 0c-1.1 0-2 .9-2 2s.9 2 2 2s2-.9 2-2s-.9-2-2-2m-7 0c-1.1 0-2 .9-2 2s.9 2 2 2s2-.9 2-2s-.9-2-2-2"/></svg>
                    </button>
                    {isOptionsOpen && (
                        <div className="options-dropdown">
                            <button className="dropdown-item" onClick={() => handleAction(onOpenRenameModal)}>Edit project</button>
                            <button className="dropdown-item" onClick={() => handleAction(onOpenInstructionsModal)}>Add instructions</button>
                            <button className="dropdown-item delete" onClick={() => handleAction(onDeleteProject)}>Delete project</button>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};