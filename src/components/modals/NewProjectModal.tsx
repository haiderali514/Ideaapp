import React from 'react';

interface NewProjectModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (e: React.FormEvent) => void;
    newProjectName: string;
    setNewProjectName: (value: string) => void;
}

export const NewProjectModal: React.FC<NewProjectModalProps> = ({ isOpen, onClose, onSubmit, newProjectName, setNewProjectName }) => {
    if (!isOpen) return null;
    
    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <h2>New Project</h2>
                <form onSubmit={onSubmit}>
                    <input type="text" value={newProjectName} onChange={(e) => setNewProjectName(e.target.value)} autoFocus placeholder="Enter project name..." />
                    <div className="modal-actions">
                        <button type="button" onClick={onClose}>Cancel</button>
                        <button type="submit" disabled={!newProjectName.trim()}>Create</button>
                    </div>
                </form>
            </div>
        </div>
    );
};
