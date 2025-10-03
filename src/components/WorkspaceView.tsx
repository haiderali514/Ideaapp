import React from 'react';
import { ProjectFolder } from '../types';
import { ProjectCard } from '../features/workspace/components/ProjectCard';
import { CommunityProjectCard } from '../features/workspace/components/CommunityProjectCard';

interface WorkspaceViewProps {
    projects: ProjectFolder[];
    onSelectProject: (projectId: string) => void;
    onNewProject: () => void;
}

const FilterPill: React.FC<{ children: React.ReactNode, active?: boolean }> = ({ children, active }) => (
    <button className={`filter-pill ${active ? 'active' : ''}`}>{children}</button>
);

export const WorkspaceView: React.FC<WorkspaceViewProps> = ({ projects, onSelectProject, onNewProject }) => {
    return (
        <div className="workspace-view">
            <div className="workspace-header">
                <h2>h h h h h h h h h h's Workspace</h2>
                <div className="workspace-filters">
                    <button className="header-btn publish" onClick={onNewProject}>+ New Project</button>
                    <div className="search-projects">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                        <input type="text" placeholder="Search projects..." />
                    </div>
                    <select><option>Last edited</option></select>
                    <select><option>Newest first</option></select>
                    <select><option>All creators</option></select>
                </div>
                <a href="#" className="view-all-link">View All</a>
            </div>
            
            {projects.length > 0 ? (
                <div className="project-grid">
                    {projects.map(project => (
                        <ProjectCard key={project.id} project={project} onSelectProject={onSelectProject} />
                    ))}
                </div>
            ) : (
                <div className="empty-workspace">
                    <h3>No projects yet</h3>
                    <p>Click "+ New Project" to get started.</p>
                </div>
            )}


            <div className="community-section">
                <div className="community-header">
                    <h3>From the Community</h3>
                    <div className="workspace-filters">
                        <select><option>Popular</option></select>
                    </div>
                    <a href="#" className="view-all-link">View All</a>
                </div>
                <div className="community-pills">
                    <FilterPill active>Discover</FilterPill>
                    <FilterPill>Internal Tools</FilterPill>
                    <FilterPill>Website</FilterPill>
                    <FilterPill>Consumer App</FilterPill>
                    <FilterPill>B2B App</FilterPill>
                    <FilterPill>Prototype</FilterPill>
                    <FilterPill>Image Gen</FilterPill>
                </div>
                <div className="community-project-grid">
                    <CommunityProjectCard
                        imageUrl="https://i.imgur.com/8QqdG5J.png"
                        title="Atlas: Where Code Comes to Life"
                        author="IdeaSpark AI Staff"
                    />
                    <CommunityProjectCard
                        imageUrl="https://i.imgur.com/B4Y3S5s.png"
                        title="Crypto Dashboard"
                        author="hhhh...IdeaSpark AI"
                    />
                    <CommunityProjectCard
                        imageUrl="https://i.imgur.com/sM9r2It.png"
                        title="Trade confidence & security"
                        author="IdeaSpark AI Staff"
                    />
                    <CommunityProjectCard
                        imageUrl="https://i.imgur.com/Kq8mD7X.png"
                        title="an e/a"
                        author="IdeaSpark AI Staff"
                    />
                </div>
            </div>
        </div>
    );
};