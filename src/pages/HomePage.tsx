import React from 'react';
import { useAppContext } from '../context/AppContext';

import { Sidebar } from '../layouts/Sidebar';
import { ChatView } from '../features/chat/ChatView';
import { ProjectView } from '../features/project/ProjectView';
import { PlaceholderView } from '../components/PlaceholderView';
import { RenameModal } from '../components/modals/RenameModal';
import { NewProjectModal } from '../components/modals/NewProjectModal';
import { InstructionsModal } from '../components/modals/InstructionsModal';
import { MoveToProjectModal } from '../components/modals/MoveToProjectModal';
import { DeleteConfirmModal } from '../components/modals/DeleteConfirmModal';
import { ChatData } from '../types';

export const HomePage = () => {
  const {
    // Data
    chats,
    projectFolders,
    activeChatId,
    activeProjectId,
    activeChat,
    activeProject,

    // UI State
    isSidebarExpanded,
    setIsSidebarExpanded,
    
    // Chat Handler State & Actions
    isLoading,
    error,
    filesToSend,
    currentMessage,
    setCurrentMessage,
    handleFormSubmit,
    handleFileChange,
    removeFile,
    fileInputRef,
    handleNewMessageInProject,
    
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
      {isMoveModalOpen && activeChat && <MoveToProjectModal
        isOpen={isMoveModalOpen}
        onClose={closeAllModals}
        onMove={handleMoveChat}
        chat={activeChat}
        projects={projectFolders}
      />}
      <DeleteConfirmModal
        isOpen={isDeleteConfirmModalOpen}
        onClose={closeAllModals}
        onConfirm={handleConfirmDelete}
        itemToDelete={itemToDelete}
      />
      
      <input type="file" ref={fileInputRef} onChange={handleFileChange} multiple style={{ display: 'none' }} />

      <div className="app-container">
        <Sidebar 
            isSidebarExpanded={isSidebarExpanded}
            setIsSidebarExpanded={setIsSidebarExpanded}
            chats={chats}
            projectFolders={projectFolders}
            activeChatId={activeChatId}
            activeProjectId={activeProjectId}
            onNewChat={handleNewChat}
            onNewProject={openNewProjectModal}
            onSelectProject={handleSelectProject}
            onSelectChat={setActiveChatId}
            onOpenRenameModal={openRenameModal}
            onOpenInstructionsModal={openInstructionsModal}
            onDeleteProject={(p) => openDeleteModal(p)}
            onDeleteChat={(c) => openDeleteModal(c)}
            onOpenMoveModal={(c: ChatData) => openMoveModal(c)}
        />
        <main className="main-content">
          {activeChat ? (
            <ChatView
                chat={activeChat}
                isLoading={isLoading}
                error={error}
                filesToSend={filesToSend}
                currentMessage={currentMessage}
                setCurrentMessage={setCurrentMessage}
                onFormSubmit={handleFormSubmit}
                onFileChange={handleFileChange}
                onRemoveFile={removeFile}
                onOpenRenameModal={() => openRenameModal(activeChat)}
                onOpenMoveModal={() => openMoveModal(activeChat)}
                onDeleteChat={() => openDeleteModal(activeChat)}
                fileInputRef={fileInputRef}
             />
          ) : activeProject ? (
              <ProjectView 
                project={activeProject} 
                chatsInProject={chats.filter(c => c.projectId === activeProject.id)} 
                onSelectChat={setActiveChatId}
                fileInputRef={fileInputRef}
                onOpenRenameModal={() => openRenameModal(activeProject)}
                onOpenInstructionsModal={() => openInstructionsModal(activeProject)}
                onDeleteProject={() => openDeleteModal(activeProject)}
                onUpdateProject={updateProject}
                filesToSend={filesToSend}
                isLoading={isLoading}
                onNewMessageInProject={handleNewMessageInProject}
                onRemoveFile={removeFile}
              />
          ) : (
            <PlaceholderView 
                currentMessage={currentMessage}
                setCurrentMessage={setCurrentMessage}
                filesToSend={filesToSend}
                isLoading={isLoading}
                onFormSubmit={handleFormSubmit}
                onRemoveFile={removeFile}
                fileInputRef={fileInputRef}
            />
          )}
        </main>
      </div>
    </>
  );
};
