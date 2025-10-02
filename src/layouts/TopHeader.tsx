import React from 'react';
import { ProjectFolder } from '../types';

interface TopHeaderProps {
    activeProject: ProjectFolder | undefined;
}

export const TopHeader: React.FC<TopHeaderProps> = ({ activeProject }) => {
    return (
        <header className="top-header">
            <div className="top-header-left">
                {activeProject ? (
                    <div>
                        <h1 className="top-header-project-name">{activeProject.name}</h1>
                        <p className="top-header-project-status">Previewing last saved version</p>
                    </div>
                ) : (
                    <h1 className="top-header-project-name">Dashboard</h1>
                )}
            </div>
            
            <div className="top-header-center">
                 <button className="header-btn preview-btn">
                     <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
                    <span>Preview</span>
                </button>
                 <div className="header-path-display">/</div>
            </div>

            <div className="top-header-right">
                <button className="header-btn">Invite</button>
                <button className="header-btn upgrade">Upgrade</button>
                <button className="header-btn publish">Publish</button>
            </div>
        </header>
    );
};