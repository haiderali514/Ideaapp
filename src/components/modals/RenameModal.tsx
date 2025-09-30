import React from 'react';

interface RenameModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (e: React.FormEvent) => void;
    renameInput: string;
    setRenameInput: (value: string) => void;
}

export const RenameModal: React.FC<RenameModalProps> = ({ isOpen, onClose, onSubmit, renameInput, setRenameInput }) => {
    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <h2>Rename</h2>
                <form onSubmit={onSubmit}>
                    <input type="text" value={renameInput} onChange={(e) => setRenameInput(e.target.value)} autoFocus />
                    <div className="modal-actions">
                        <button type="button" onClick={onClose}>Cancel</button>
                        <button type="submit" disabled={!renameInput.trim()}>Save</button>
                    </div>
                </form>
            </div>
        </div>
    );
};
