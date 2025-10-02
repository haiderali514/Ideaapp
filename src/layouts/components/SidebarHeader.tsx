import React from 'react';

export const SidebarHeader: React.FC<{ 
    isSidebarExpanded: boolean; 
    setIsSidebarExpanded: (expanded: boolean) => void;
}> = ({ isSidebarExpanded, setIsSidebarExpanded }) => {
    return (
        <div className="sidebar-header">
            {isSidebarExpanded && (
                <span className="sidebar-title">IdeaSpark AI</span>
            )}
            <div className="sidebar-header-actions">
                <button className="sidebar-toggle" onClick={() => setIsSidebarExpanded(!isSidebarExpanded)}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="9" y1="3" x2="9" y2="21"></line></svg>
                    <span className="tooltip">{isSidebarExpanded ? 'Close sidebar' : 'Open sidebar'}</span>
                </button>
            </div>
        </div>
    );
};