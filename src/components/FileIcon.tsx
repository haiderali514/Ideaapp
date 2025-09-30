import React from 'react';

// A collection of SVG icons for different file types.
const icons = {
    image: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>,
    pdf: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="12" y1="18" x2="12" y2="12"></line><line x1="9" y1="15" x2="15" y2="15"></line></svg>,
    audio: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18V5l12-2v13"></path><circle cx="6" cy="18" r="3"></circle><circle cx="18" cy="16" r="3"></circle></svg>,
    video: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="23 7 16 12 23 17 23 7"></polygon><rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect></svg>,
    zip: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="10" y1="12" x2="10" y2="2"></line><line x1="14" y1="12" x2="14" y2="2"></line><path d="M10 2h4"></path><path d="M10 12h4"></path><path d="M20 12h-2a2 2 0 0 1-2-2V6a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v4a2 2 0 0 1-2 2H4a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2z"></path></svg>,
    code: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 18 22 12 16 6"></polyline><polyline points="8 6 2 12 8 18"></polyline></svg>,
    document: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"></path><polyline points="13 2 13 9 20 9"></polyline></svg>
};

/**
 * Renders a file-type-specific icon based on the provided MIME type.
 * @param {object} props - The component props.
 * @param {string} props.mimeType - The MIME type of the file.
 * @returns A React element representing the file icon.
 */
export const FileIcon: React.FC<{ mimeType: string }> = ({ mimeType }) => {
    if (mimeType.startsWith('image/')) return icons.image;
    if (mimeType === 'application/pdf') return icons.pdf;
    if (mimeType.startsWith('audio/')) return icons.audio;
    if (mimeType.startsWith('video/')) return icons.video;
    if (['application/zip', 'application/x-rar-compressed', 'application/x-7z-compressed'].includes(mimeType)) return icons.zip;
    if (['text/html', 'text/css', 'text/javascript', 'application/json', 'text/x-python', 'application/x-httpd-php'].includes(mimeType)) return icons.code;
    return icons.document;
};
