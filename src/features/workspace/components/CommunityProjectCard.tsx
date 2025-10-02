import React from 'react';

interface CommunityProjectCardProps {
    imageUrl: string;
    title: string;
    author: string;
}

export const CommunityProjectCard: React.FC<CommunityProjectCardProps> = ({ imageUrl, title, author }) => {
    return (
        <div className="community-card">
            <div 
                className="community-card-thumbnail" 
                style={{ backgroundImage: `url(${imageUrl})` }}
            ></div>
            <div className="community-card-info">
                <h4>{title}</h4>
                <p>by {author}</p>
            </div>
        </div>
    );
};
