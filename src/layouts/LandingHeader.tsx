import React from 'react';

export const LandingHeader: React.FC = () => {
    return (
        <header className="landing-header">
            <div className="landing-header-left">
                <span className="landing-header-logo">Lovable</span>
                <nav>
                    <a href="#">Community</a>
                    <a href="#">Pricing</a>
                    <a href="#">Enterprise</a>
                    <a href="#">Learn</a>
                    <a href="#">Launched</a>
                </nav>
            </div>
            <div className="landing-header-right">
                <div className="landing-header-actions">
                     <button title="Notifications">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>
                    </button>
                    <button title="Calendar">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                    </button>
                </div>
                 <div className="landing-header-user">
                    <button className="user-avatar-btn">H</button>
                    <span className="username">hhhhhhhhh's Lovable</span>
                </div>
            </div>
        </header>
    );
};
