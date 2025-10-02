import React from 'react';
import { useAppContext } from '../context/AppContext';
import { LandingHeader } from '../layouts/LandingHeader';

export const LandingPage: React.FC = () => {
    const { handleLogin } = useAppContext();

    return (
        <div className="landing-page-container">
            <LandingHeader />
            <main className="landing-hero">
                <div className="landing-pill">Introducing Lovable Cloud ↗</div>
                <h1>Build something <span className="lovable-heart">Lovable</span></h1>
                <p>Create apps and websites by chatting with AI.</p>
                <div className="landing-input-wrapper" onClick={handleLogin}>
                    <span>Ask Lovable to create a dashboard to...</span>
                    <div className="landing-input-controls">
                        <button>
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                            Attach
                        </button>
                        <button>
                             <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>
                            Public
                        </button>
                        <div className="landing-input-right-controls">
                            <button className="voice-btn">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path></svg>
                            </button>
                            <button className="send-btn">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="19" x2="12" y2="5"></line><polyline points="5 12 12 5 19 12"></polyline></svg>
                            </button>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};
