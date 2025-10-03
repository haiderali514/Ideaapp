import React from 'react';
import { useAppContext } from '../context/AppContext';

export const LandingHeader: React.FC = () => {
    const { showAuthPage } = useAppContext();

    return (
        <header className="landing-header">
            <div className="landing-header-left">
                <span className="landing-header-logo">IdeaSpark AI</span>
                <nav>
                    <a href="#">Community</a>
                    <a href="#">Pricing</a>
                    <a href="#">Enterprise</a>
                    <a href="#">Learn</a>
                    <a href="#">Launched</a>
                </nav>
            </div>
            <div className="landing-header-right">
                <button className="header-btn" onClick={showAuthPage}>Log In</button>
                <button className="header-btn publish" onClick={showAuthPage}>Sign Up</button>
            </div>
        </header>
    );
};