import React from 'react';
import { ProjectFolder, ChatData } from '../../types';

interface ProjectViewProps {
    project: ProjectFolder;
    chatsInProject: ChatData[];
    onSelectChat: (chatId: string) => void;
    onUpdateProject: (projectId: string, data: Partial<ProjectFolder>) => void;
}


export const ProjectView: React.FC<ProjectViewProps> = (props) => {
    const { project } = props;

    return (
        <div className="project-view-canvas">
            <div className="canvas-header">
                <h3><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg> TaskFlow</h3>
                 <div className="canvas-header-search">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                    <input type="text" placeholder="Search tasks..." />
                </div>
            </div>
            <div className="canvas-content-wrapper">
                 <div className="canvas-sidebar-preview">
                    <ul>
                        <li className="active">Inbox</li>
                        <li>Today</li>
                        <li>Pomodoro</li>
                        <li>Completed</li>
                    </ul>
                    <h4 className="category-title">Categories</h4>
                     <ul>
                        <li>Work</li>
                        <li>Personal</li>
                        <li>Health</li>
                        <li>Learning</li>
                    </ul>
                </div>
                <div className="canvas-content-preview">
                    <div className="preview-inbox">
                        <div className="preview-header">
                            <h4>Inbox</h4>
                             <button className="preview-add-btn">+</button>
                        </div>
                         <input type="text" placeholder="Add a task..." className="preview-input" />
                        <ul className="preview-task-list">
                            <li><input type="checkbox" checked readOnly/> <span>Review project proposal</span></li>
                            <li><input type="checkbox" readOnly/> <span>Morning workout routine</span></li>
                             <li><input type="checkbox" readOnly/> <span>Learn React hooks</span></li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};