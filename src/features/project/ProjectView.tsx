import React, { useState, useEffect } from 'react';
import { ProjectFolder, ChatData, UIComponent } from '../../types';
import { ProjectHeader } from './components/ProjectHeader';
import { ProjectChatList } from './components/ProjectChatList';
import { generateFeaturesFromProblem } from '../../services/geminiService';
import { NewChatInput } from './components/NewChatInput';
import { ComponentBuilder } from '../design/ComponentBuilder';

type ProjectTab = 'plan' | 'design' | 'code' | 'chats';

interface ProjectViewProps {
    project: ProjectFolder;
    chatsInProject: ChatData[];
    onSelectChat: (chatId: string) => void;
    fileInputRef: React.RefObject<HTMLInputElement>;
    onOpenRenameModal: () => void;
    onOpenInstructionsModal: () => void;
    onDeleteProject: () => void;
    onUpdateProject: (projectId: string, data: Partial<ProjectFolder>) => void;
    filesToSend: File[];
    isLoading: boolean;
    onNewMessageInProject: (message: string, projectId: string) => void;
    onRemoveFile: (index: number) => void;
}

export const ProjectView: React.FC<ProjectViewProps> = (props) => {
    const { 
        project, onUpdateProject, chatsInProject, onSelectChat, 
        filesToSend, isLoading, onNewMessageInProject, onRemoveFile, fileInputRef 
    } = props;
    const [activeTab, setActiveTab] = useState<ProjectTab>('plan');
    const [problem, setProblem] = useState(project.problemStatement || '');
    const [features, setFeatures] = useState<string[]>(project.features || []);
    const [isLoadingFeatures, setIsLoadingFeatures] = useState(false);
    const [isSaved, setIsSaved] = useState(false);

    useEffect(() => {
        setProblem(project.problemStatement || '');
        setFeatures(project.features || []);
    }, [project]);

    const hasChanges = problem !== (project.problemStatement || '') || JSON.stringify(features) !== JSON.stringify(project.features || []);

    const handleGenerateFeatures = async () => {
        if (!problem.trim()) return;
        setIsLoadingFeatures(true);
        const generatedFeatures = await generateFeaturesFromProblem(problem);
        setFeatures(generatedFeatures);
        setIsLoadingFeatures(false);
        setIsSaved(false);
    };
    
    const handleProblemChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setProblem(e.target.value);
        setIsSaved(false);
    }

    const handleSavePlan = () => {
        onUpdateProject(project.id, { problemStatement: problem, features });
        setIsSaved(true);
    };

    const handleSaveComponent = (componentData: Omit<UIComponent, 'id'>) => {
        const newComponent: UIComponent = { ...componentData, id: Date.now().toString() };
        const updatedComponents = [...(project.components || []), newComponent];
        onUpdateProject(project.id, { components: updatedComponents });
    };

    return (
        <div className="project-landing-view">
            <ProjectHeader {...props} />

            <div className="project-tabs">
                <button className={`tab-btn ${activeTab === 'plan' ? 'active' : ''}`} onClick={() => setActiveTab('plan')}>Plan</button>
                <button className={`tab-btn ${activeTab === 'design' ? 'active' : ''}`} onClick={() => setActiveTab('design')}>Design</button>
                <button className={`tab-btn ${activeTab === 'code' ? 'active' : ''}`} onClick={() => setActiveTab('code')}>Code</button>
                <button className={`tab-btn ${activeTab === 'chats' ? 'active' : ''}`} onClick={() => setActiveTab('chats')}>Chats</button>
            </div>

            <div className="tab-content">
                {activeTab === 'plan' && (
                    <div className="project-workflow-section">
                        <div className="workflow-heading">
                            <h2>Define Your Idea</h2>
                            <p>Start by describing the core problem you want to solve. The AI will help you brainstorm features based on your input.</p>
                        </div>
                        
                        <div className="form-group">
                            <label htmlFor="problem-statement">Core Problem</label>
                            <textarea 
                                id="problem-statement"
                                value={problem}
                                onChange={handleProblemChange}
                                placeholder="e.g., 'Users struggle to find and book reliable home cleaning services.'"
                                rows={3}
                            />
                        </div>

                        <div className="workflow-actions">
                            <button className="generate-btn" onClick={handleGenerateFeatures} disabled={!problem.trim() || isLoadingFeatures}>
                                {isLoadingFeatures ? 'Generating...' : <>✨ Brainstorm Features</>}
                            </button>
                             <button className="save-btn" onClick={handleSavePlan} disabled={!hasChanges || isSaved}>
                                {isSaved ? 'Saved!' : 'Save Plan'}
                            </button>
                        </div>

                        {features.length > 0 && (
                            <div className="feature-list">
                                <h3>Suggested Features</h3>
                                <ul>
                                    {features.map((feature, index) => (
                                        <li key={index}>
                                            <div className="feature-icon">
                                               <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2L9 9H2L7 14L5 22L12 17L19 22L17 14L22 9H15Z"/></svg>
                                            </div>
                                            <span>{feature}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'design' && (
                    <div className="design-tab-content">
                        <ComponentBuilder onSaveComponent={handleSaveComponent} />
                        <div className="component-library">
                            <h3>Component Library</h3>
                            {(!project.components || project.components.length === 0) && (
                                <p className="empty-library-message">Your saved components will appear here.</p>
                            )}
                            <div className="saved-components-grid">
                                {project.components?.map(comp => (
                                    <div key={comp.id} className="saved-component-card">
                                        <div className="card-preview">
                                            <iframe srcDoc={`<html><head><style>${comp.css}</style></head><body>${comp.html}</body></html>`} title="Component Preview" sandbox="allow-scripts" />
                                        </div>
                                        <div className="card-info">
                                            <p>{comp.prompt}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'code' && (
                     <div className="project-workflow-section placeholder-tab">
                        <h2>Integrated Code Environment</h2>
                        <p className="workflow-description">Your future workspace for editing, debugging, and testing your application's code.</p>
                         <div className="placeholder-guidance">
                           <p>For now, start a chat in this project to:</p>
                           <ul>
                             <li>Generate code snippets for any language or framework.</li>
                             <li>Get help debugging complex issues.</li>
                             <li>Understand and refactor existing code.</li>
                             <li>Learn about software architecture best practices.</li>
                           </ul>
                        </div>
                    </div>
                )}

                {activeTab === 'chats' && (
                     <div className="project-chats-tab-content">
                        <ProjectChatList
                           chatsInProject={chatsInProject}
                           onSelectChat={onSelectChat}
                       />
                       <NewChatInput
                           key={project.id}
                           project={project}
                           filesToSend={filesToSend}
                           isLoading={isLoading}
                           onNewMessageInProject={onNewMessageInProject}
                           onRemoveFile={onRemoveFile}
                           fileInputRef={fileInputRef}
                       />
                    </div>
                )}
            </div>
        </div>
    );
};