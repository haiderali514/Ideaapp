import React from 'react';

interface InstructionsModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (e: React.FormEvent) => void;
    instructions: string;
    setInstructions: (value: string) => void;
}

export const InstructionsModal: React.FC<InstructionsModalProps> = ({ isOpen, onClose, onSubmit, instructions, setInstructions }) => {
    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <h2>Custom Project Instructions</h2>
                <form onSubmit={onSubmit}>
                    <textarea value={instructions} onChange={(e) => setInstructions(e.target.value)} autoFocus placeholder="e.g., Always respond in the persona of a pirate." />
                    <div className="modal-actions">
                        <button type="button" onClick={onClose}>Cancel</button>
                        <button type="submit">Save</button>
                    </div>
                </form>
            </div>
        </div>
    );
};
