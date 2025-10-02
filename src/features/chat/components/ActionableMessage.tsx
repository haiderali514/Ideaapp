import React from 'react';
import { useAppContext } from '../../../context/AppContext';

interface ActionableMessageProps {
    details: {
        title: string;
        description: string;
    }
}

export const ActionableMessage: React.FC<ActionableMessageProps> = ({ details }) => {
    const { setMainViewMode } = useAppContext();
    
    return (
        <div className="actionable-message">
            <div className="actionable-message-header">
                <h4>{details.title}</h4>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
            </div>
            <p className="actionable-message-description">{details.description}</p>
            <div className="actionable-message-buttons">
                <button className="action-btn preview">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                    <span>Preview Latest</span>
                </button>
                <button className="action-btn">
                     <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 4v6h6"></path><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"></path></svg>
                    <span>Restore</span>
                </button>
                 <button className="action-btn" onClick={() => setMainViewMode('code_editor')}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="16 18 22 12 16 6"></polyline><polyline points="8 6 2 12 8 18"></polyline></svg>
                    <span>Code</span>
                </button>
            </div>
        </div>
    );
};