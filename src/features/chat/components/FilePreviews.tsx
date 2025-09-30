import React from 'react';
import { FileIcon } from '../../../components/FileIcon';
import { formatFileSize } from '../../../utils/fileUtils';

interface FilePreviewsProps {
    files: File[];
    onRemoveFile: (index: number) => void;
}

export const FilePreviews: React.FC<FilePreviewsProps> = ({ files, onRemoveFile }) => {
    if (files.length === 0) return null;

    return (
        <div className="file-preview-cards-container">
            {files.map((file, index) => (
                <div key={index} className="file-preview-card">
                    <div className="file-icon">
                        <FileIcon mimeType={file.type} />
                    </div>
                    <div className="file-info">
                        <span className="file-name">{file.name}</span>
                        <span className="file-size">{formatFileSize(file.size)}</span>
                    </div>
                    <button className="remove-file-btn" onClick={() => onRemoveFile(index)} title="Remove file">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                    </button>
                </div>
            ))}
        </div>
    );
};
