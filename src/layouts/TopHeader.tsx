import React, { useState, useRef, useEffect } from 'react';
import { ProjectFolder } from '../types';
import { useAppContext } from '../context/AppContext';

interface TopHeaderProps {
    activeProject: ProjectFolder | undefined;
    onGoToWorkspace: () => void;
}

export const TopHeader: React.FC<TopHeaderProps> = ({ activeProject, onGoToWorkspace }) => {
    const { user, handleLogout, openSettingsModal } = useAppContext();
    const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
    const profileMenuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
                setIsProfileMenuOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    if (!user) {
        return null; // Should not be rendered when logged out anyway
    }

    return (
        <header className="top-header">
            <div className="top-header-left">
                {activeProject ? (
                    <button className="back-to-workspace-btn" onClick={onGoToWorkspace}>
                        <div>
                            <h1 className="top-header-project-name">{activeProject.name}</h1>
                            <p className="top-header-project-status">Previewing last saved version</p>
                        </div>
                    </button>
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
                <div className="header-user-profile" ref={profileMenuRef}>
                    <button className="user-profile-btn" onClick={() => setIsProfileMenuOpen(p => !p)}>
                        <span className="user-avatar-btn">{user.initials}</span>
                    </button>
                    {isProfileMenuOpen && (
                        <div className="options-dropdown profile-options-dropdown">
                            <div className="dropdown-section">
                                <button className="dropdown-item">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                                    <span>{user.email}</span>
                                </button>
                            </div>
                            <div className="dropdown-section">
                                <button className="dropdown-item">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
                                    <span>Upgrade plan</span>
                                </button>
                                <button className="dropdown-item" onClick={() => { openSettingsModal(); setIsProfileMenuOpen(false); }}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>
                                    <span>Settings</span>
                                </button>
                            </div>
                            <div className="dropdown-divider"></div>
                            <div className="dropdown-section">
                                <button className="dropdown-item" onClick={handleLogout}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
                                    <span>Log out</span>
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};