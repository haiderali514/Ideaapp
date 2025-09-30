import React from 'react';

interface ProjectHeaderProps {
    projectName: string;
    fileInputRef: React.RefObject<HTMLInputElement>;
}

export const ProjectHeader: React.FC<ProjectHeaderProps> = ({ projectName, fileInputRef }) => {
    return (
        <header className="project-landing-header">
            <h1 className="project-landing-title">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path></svg>
                {projectName}
            </h1>
            <button className="add-files-btn" onClick={() => fileInputRef.current?.click()}>Add files</button>
        </header>
    );
};
