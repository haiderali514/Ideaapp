import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';

export const AuthPage: React.FC = () => {
    const [isLoginView, setIsLoginView] = useState(true);
    const { handleLogin, hideAuthPage } = useAppContext();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        handleLogin();
    };

    return (
        <div className="auth-page-container">
            <div className="auth-modal">
                <div className="auth-header">
                    <button className="close-btn" onClick={hideAuthPage}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                    </button>
                    <h2>{isLoginView ? 'Welcome back' : 'Create an account'}</h2>
                    <p>{isLoginView ? 'Log in to continue to IdeaSpark AI' : 'Get started with your AI co-founder.'}</p>
                </div>

                <div className="auth-social-logins">
                    <button className="social-btn google-btn">Continue with Google</button>
                    <button className="social-btn github-btn">Continue with GitHub</button>
                </div>

                <div className="auth-divider">
                    <span>OR</span>
                </div>

                <form onSubmit={handleSubmit}>
                    {!isLoginView && (
                        <div className="form-group">
                            <label htmlFor="name">Name</label>
                            <input id="name" type="text" placeholder="e.g., Ada Lovelace" required />
                        </div>
                    )}
                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input id="email" type="email" placeholder="e.g., ada.lovelace@example.com" required />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input id="password" type="password" placeholder="••••••••" required />
                    </div>

                    <button type="submit" className="auth-submit-btn">{isLoginView ? 'Log In' : 'Create Account'}</button>
                </form>

                <div className="auth-footer">
                    {isLoginView ? (
                        <p>Don't have an account? <button onClick={() => setIsLoginView(false)}>Sign Up</button></p>
                    ) : (
                        <p>Already have an account? <button onClick={() => setIsLoginView(true)}>Log In</button></p>
                    )}
                </div>
            </div>
        </div>
    );
};
