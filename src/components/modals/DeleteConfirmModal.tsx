import React from 'react';
import { ChatData, ProjectFolder } from '../../types';

interface DeleteConfirmModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    itemToDelete: ChatData | ProjectFolder | null;
}

export const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({ isOpen, onClose, onConfirm, itemToDelete }) => {
    if (!isOpen || !itemToDelete) return null;

    const isProject = !('history' in itemToDelete);
    const title = `Delete ${isProject ? 'Project' : 'Chat'}`;
    const message = `Are you sure you want to permanently delete "${itemToDelete.name}"? ${isProject ? 'All chats within this project will also be deleted.' : 'This action cannot be undone.'}`;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <h2>{title}</h2>
                <p>{message}</p>
                <div className="modal-actions">
                    <button type="button" onClick={onClose}>Cancel</button>
                    <button type="button" className="delete-confirm-btn" onClick={onConfirm}>Delete</button>
                </div>
            </div>
        </div>
    );
};
