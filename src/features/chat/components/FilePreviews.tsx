import React from 'react';

interface FilePreviewsProps {
    files: File[];
    onRemoveFile: (index: number) => void;
}

export const FilePreviews: React.FC<FilePreviewsProps> = ({ files, onRemoveFile }) => {
    if (files.length === 0) return null;

    return (
        <div className="file-previews">
            {files.map((file, index) => (
                <div key={index} className="file-preview-chip">
                    {file.type.startsWith('image/') 
                        ? <img src={URL.createObjectURL(file)} alt={file.name} /> 
                        : <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9l-7-7z"></path><polyline points="13 2 13 9 20 9"></polyline></svg>
                    }
                    <span>{file.name}</span>
                    <button onClick={() => onRemoveFile(index)}>×</button>
                </div>
            ))}
        </div>
    );
};
