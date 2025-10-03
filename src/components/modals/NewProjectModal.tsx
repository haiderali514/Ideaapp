import React from 'react';

interface NewProjectModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (e: React.FormEvent) => void;
    newProjectName: string;
    setNewProjectName: (value: string) => void;
}

const suggestions = [
    "AI Task Manager",
    "Personal Finance Tracker",
    "Recipe Discovery App",
    "Social Media Dashboard"
];

export const NewProjectModal: React.FC<NewProjectModalProps> = ({ isOpen, onClose, onSubmit, newProjectName, setNewProjectName }) => {
    if (!isOpen) return null;

    const handleSuggestionClick = (suggestion: string) => {
        setNewProjectName(suggestion);
    };
    
    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content new-project-modal" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <div className="modal-icon">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path><line x1="12" y1="11" x2="12" y2="17"></line><line x1="9" y1="14" x2="15" y2="14"></line></svg>
                    </div>
                    <h2>Create a new project</h2>
                    <p className="modal-description">Give your project a name to get started. You can change this later.</p>
                </div>

                <form onSubmit={onSubmit}>
                    <div className="form-group">
                        <label htmlFor="projectName">Project Name</label>
                        <input 
                            id="projectName"
                            type="text" 
                            value={newProjectName} 
                            onChange={(e) => setNewProjectName(e.target.value)} 
                            autoFocus 
                            placeholder="e.g., My Awesome App" 
                        />
                    </div>

                    <div className="suggestion-pills">
                        {suggestions.map(s => (
                            <button type="button" key={s} className="suggestion-pill" onClick={() => handleSuggestionClick(s)}>
                                {s}
                            </button>
                        ))}
                    </div>

                    <div className="modal-actions">
                        <button type="button" onClick={onClose}>Cancel</button>
                        <button type="submit" className="create-btn" disabled={!newProjectName.trim()}>Create Project</button>
                    </div>
                </form>
            </div>
        </div>
    );
};