import React from 'react';
import { ProjectFolder } from '../../../types';

interface ProjectCardProps {
    project: ProjectFolder;
    onSelectProject: (projectId: string) => void;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ project, onSelectProject }) => {
    return (
        <div className="project-card" onClick={() => onSelectProject(project.id)}>
            <div className="project-card-thumbnail"></div>
            <div className="project-card-info">
                <div className="project-card-avatar"></div>
                <div className="project-card-details">
                    <h4>{project.name}</h4>
                    <p>Edited 2 days ago</p>
                </div>
            </div>
        </div>
    );
};