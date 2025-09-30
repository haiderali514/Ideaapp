import React from 'react';

const Logo = () => (
    <svg width="28" height="28" viewBox="0 0 41 41" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M35.2184 21.2852C35.2184 22.6281 34.6683 23.8999 33.7211 24.8471L29.5391 29.0291C28.5919 29.9763 27.3201 30.5264 25.9772 30.5264H15.0225C13.6796 30.5264 12.4078 29.9763 11.4606 29.0291L7.27864 24.8471C6.33146 23.8999 5.78125 22.6281 5.78125 21.2852V15.0225C5.78125 13.6796 6.33146 12.4078 7.27864 11.4606L11.4606 7.27864C12.4078 6.33146 13.6796 5.78125 15.0225 5.78125H25.9772C27.3201 5.78125 28.5919 6.33146 29.5391 7.27864L33.7211 11.4606C34.6683 12.4078 35.2184 13.6796 35.2184 15.0225V21.2852Z" fill="#a855f7"></path>
    </svg>
);


export const SidebarHeader: React.FC<{ isSidebarExpanded: boolean; setIsSidebarExpanded: (expanded: boolean) => void; }> = ({ isSidebarExpanded, setIsSidebarExpanded }) => {
    return (
        <div className="sidebar-header">
            {isSidebarExpanded && <span style={{fontWeight: 600, flexGrow: 1, whiteSpace: 'nowrap', color: 'var(--text-primary)'}}>IdeaSpark AI</span>}
            <button className="sidebar-toggle" onClick={() => setIsSidebarExpanded(!isSidebarExpanded)}>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="9" y1="3" x2="9" y2="21"></line></svg>
                <span className="tooltip">{isSidebarExpanded ? 'Close sidebar' : 'Open sidebar'}</span>
            </button>
        </div>
    );
};