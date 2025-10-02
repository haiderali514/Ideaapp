import React, { useState } from 'react';
import { ProjectFolder, ChatData } from '../../types';
import { useAppContext } from '../../context/AppContext';

const ProjectPreview: React.FC<{onBack: () => void}> = ({ onBack }) => (
    <div className="project-preview-placeholder">
        <div className="preview-content">
            <h3>App Preview</h3>
            <p>Your generated app preview will appear here.</p>
            <p>Interact with the AI in the journal to build components and see them live.</p>
            <button onClick={onBack}>Back to Project Hub</button>
        </div>
    </div>
);


export const ProjectView: React.FC<{ project: ProjectFolder }> = ({ project }) => {
    const { setMainViewMode } = useAppContext();
    const [showPreview, setShowPreview] = useState(false);

    if (showPreview) {
        return <ProjectPreview onBack={() => setShowPreview(false)} />;
    }

    return (
        <div className="project-hub-placeholder">
            <div className="hub-content">
                <div className="hub-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path></svg>
                </div>
                <h2>{project.name}</h2>
                <p>Use the journal on the left to build your app. You can switch between the code and a live preview here.</p>
                <div className="hub-actions">
                    <button className="hub-action-btn" onClick={() => setShowPreview(true)}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                        <span>Show Preview</span>
                    </button>
                    <button className="hub-action-btn" onClick={() => setMainViewMode('code_editor')}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="16 18 22 12 16 6"></polyline><polyline points="8 6 2 12 8 18"></polyline></svg>
                        <span>View Code</span>
                    </button>
                </div>
            </div>
        </div>
    );
};