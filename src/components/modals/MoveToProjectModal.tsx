import React, { useState } from 'react';
import { ChatData, ProjectFolder } from '../../types';

interface MoveToProjectModalProps {
    isOpen: boolean;
    onClose: () => void;
    onMove: (chatId: string, targetProjectId: string | null) => void;
    chat: ChatData;
    projects: ProjectFolder[];
}

export const MoveToProjectModal: React.FC<MoveToProjectModalProps> = ({ isOpen, onClose, onMove, chat, projects }) => {
    const [selectedProject, setSelectedProject] = useState(chat?.projectId || 'none');
    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onMove(chat.id, selectedProject === 'none' ? null : selectedProject);
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <h2>Move to Project</h2>
                <form onSubmit={handleSubmit}>
                    <select value={selectedProject} onChange={(e) => setSelectedProject(e.target.value)}>
                        <option value="none">None (Uncategorized)</option>
                        {projects.map(pf => <option key={pf.id} value={pf.id}>{pf.name}</option>)}
                    </select>
                    <div className="modal-actions">
                        <button type="button" onClick={onClose}>Cancel</button>
                        <button type="submit">Move</button>
                    </div>
                </form>
            </div>
        </div>
    );
};
