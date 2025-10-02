import React from 'react';
import { useAppContext } from '../context/AppContext';
import { LandingPage } from './LandingPage'; 

import { LeftPanel } from '../layouts/LeftPanel';
import { TopHeader } from '../layouts/TopHeader';
import { ProjectView } from '../features/project/ProjectView';
import { WorkspaceView } from '../components/WorkspaceView';
import { RenameModal } from '../components/modals/RenameModal';
import { NewProjectModal } from '../components/modals/NewProjectModal';
import { InstructionsModal } from '../components/modals/InstructionsModal';
import { MoveToProjectModal } from '../components/modals/MoveToProjectModal';
import { DeleteConfirmModal } from '../components/modals/DeleteConfirmModal';
import { SettingsModal } from '../components/modals/SettingsModal';
import { CodeEditorView } from '../features/code/CodeEditorView';


export const HomePage = () => {
  const {
    // Auth State
    isAuthenticated,

    // Data
    chats,
    projectFolders,
    activeChatId,
    activeProject,

    // UI State
    isSettingsModalOpen,
    mainViewMode,
    
    // Modal State & Actions
    isRenameModalOpen,
    isNewProjectModalOpen,
    isInstructionsModalOpen,
    isMoveModalOpen,
    isDeleteConfirmModalOpen,
    renameInput,
    newProjectName,
    currentInstructions,
    itemToDelete,
    chatToMove,
    openNewProjectModal,
    handleNewProjectSubmit,
    openRenameModal,
    handleRenameModalSubmit,
    setRenameInput,
    openInstructionsModal,
    handleInstructionsModalSubmit,
    setCurrentInstructions,
    openMoveModal,
    handleMoveChat,
    openDeleteModal,
    handleConfirmDelete,
    closeAllModals,
    setNewProjectName,
    openSettingsModal,
    
    // Data Actions
    handleNewChat,
    setActiveChatId,
    updateProject,

    // Navigation
    handleSelectProject,
    handleGoToWorkspace,
  } = useAppContext();

  if (!isAuthenticated) {
    return <LandingPage />;
  }
  
  const renderMainView = () => {
    if (!activeProject) {
        return (
            <WorkspaceView 
                projects={projectFolders}
                onSelectProject={handleSelectProject}
                onNewProject={openNewProjectModal}
            />
        );
    }
    
    switch(mainViewMode) {
        case 'code_editor':
            return <CodeEditorView />;
        case 'project_preview':
        default:
            return (
                // FIX: Removed `chatsInProject`, `onSelectChat`, and `onUpdateProject` props as they are not accepted by `ProjectView`.
                <ProjectView 
                    project={activeProject} 
                />
            );
    }
  };

  return (
    <>
      <RenameModal 
        isOpen={isRenameModalOpen}
        onClose={closeAllModals}
        onSubmit={handleRenameModalSubmit}
        renameInput={renameInput}
        setRenameInput={setRenameInput}
      />
      <NewProjectModal 
        isOpen={isNewProjectModalOpen}
        onClose={closeAllModals}
        onSubmit={handleNewProjectSubmit}
        newProjectName={newProjectName}
        setNewProjectName={setNewProjectName}
      />
      <InstructionsModal
        isOpen={isInstructionsModalOpen}
        onClose={closeAllModals}
        onSubmit={handleInstructionsModalSubmit}
        instructions={currentInstructions}
        setInstructions={setCurrentInstructions}
      />
      {isMoveModalOpen && chatToMove && <MoveToProjectModal
        isOpen={isMoveModalOpen}
        onClose={closeAllModals}
        onMove={handleMoveChat}
        chat={chatToMove}
        projects={projectFolders}
      />}
      <DeleteConfirmModal
        isOpen={isDeleteConfirmModalOpen}
        onClose={closeAllModals}
        onConfirm={handleConfirmDelete}
        itemToDelete={itemToDelete}
      />
      <SettingsModal 
        isOpen={isSettingsModalOpen}
        onClose={closeAllModals}
      />
      
      <div className="app-container">
        {activeProject && <TopHeader activeProject={activeProject} onGoToWorkspace={handleGoToWorkspace} />}
        <div className="app-body">
            {activeProject && (
              <LeftPanel 
                  chats={chats}
                  activeProject={activeProject}
                  handleNewChat={handleNewChat}
                  setActiveChatId={setActiveChatId}
                  onOpenSettingsModal={openSettingsModal}
              />
            )}
            <main className="main-panel">
                {renderMainView()}
            </main>
        </div>
      </div>
    </>
  );
};