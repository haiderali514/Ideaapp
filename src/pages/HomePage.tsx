import React from 'react';
import { useAppContext } from '../context/AppContext';

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


export const HomePage = () => {
  const {
    // Data
    chats,
    projectFolders,
    activeChatId,
    activeProject,

    // UI State
    isSettingsModalOpen,
    
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
  } = useAppContext();

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
        <TopHeader activeProject={activeProject} />
        <div className="app-body">
            <LeftPanel 
                projects={projectFolders}
                onSelectProject={handleSelectProject}
                onNewProject={openNewProjectModal}
                onOpenSettingsModal={openSettingsModal}
            />
            <main className="main-panel">
            {activeProject ? (
                <ProjectView 
                    project={activeProject} 
                    chatsInProject={chats.filter(c => c.projectId === activeProject.id)} 
                    onSelectChat={setActiveChatId}
                    onUpdateProject={updateProject}
                />
            ) : (
                <WorkspaceView 
                    projects={projectFolders}
                    onSelectProject={handleSelectProject}
                />
            )}
            </main>
        </div>
      </div>
    </>
  );
};