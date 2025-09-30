import React from 'react';

interface SidebarHeaderProps {
    isSidebarExpanded: boolean;
    setIsSidebarExpanded: (expanded: boolean) => void;
}

export const SidebarHeader: React.FC<SidebarHeaderProps> = ({ isSidebarExpanded, setIsSidebarExpanded }) => {
    return (
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
    );
};
