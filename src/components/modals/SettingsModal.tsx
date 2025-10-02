import React from 'react';

interface SettingsModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <h2>User Personalization</h2>
                <p>The AI uses this profile to tailor its recommendations and guidance to your needs. This will be editable in a future version.</p>
                
                <ul className="settings-list">
                    <li><strong>Goals:</strong> Build and launch a portfolio of small SaaS applications.</li>
                    <li><strong>Skills:</strong> Intermediate React, beginner in backend development.</li>
                    <li><strong>Interests:</strong> Productivity tools, minimalist design, data visualization.</li>
                </ul>

                <div className="modal-actions">
                    <button type="button" onClick={onClose}>Close</button>
                </div>
            </div>
        </div>
    );
};