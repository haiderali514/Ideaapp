import React, { useState } from 'react';
import { ChatData, ProjectFolder } from '../types';

interface useModalsProps {
    chats: ChatData[];
    setChats: React.Dispatch<React.SetStateAction<ChatData[]>>;
    projectFolders: ProjectFolder[];
    setProjectFolders: React.Dispatch<React.SetStateAction<ProjectFolder[]>>;
    setActiveProjectId: React.Dispatch<React.SetStateAction<string | null>>;
}

export const useModals = ({ chats, setChats, projectFolders, setProjectFolders, setActiveProjectId }: useModalsProps) => {
    const [isRenameModalOpen, setIsRenameModalOpen] = useState(false);
    const [isInstructionsModalOpen, setIsInstructionsModalOpen] = useState(false);
    const [isMoveModalOpen, setIsMoveModalOpen] = useState(false);
    const [isNewProjectModalOpen, setIsNewProjectModalOpen] = useState(false);
    const [isDeleteConfirmModalOpen, setIsDeleteConfirmModalOpen] = useState(false);

    const [renameInput, setRenameInput] = useState('');
    const [newProjectName, setNewProjectName] = useState('');
    const [currentInstructions, setCurrentInstructions] = useState('');

    const [itemToRename, setItemToRename] = useState<ChatData | ProjectFolder | null>(null);
    const [itemToDelete, setItemToDelete] = useState<ChatData | ProjectFolder | null>(null);
    const [projectForInstructions, setProjectForInstructions] = useState<ProjectFolder | null>(null);

    const closeAllModals = () => {
        setIsRenameModalOpen(false);
        setIsInstructionsModalOpen(false);
        setIsMoveModalOpen(false);
        setIsNewProjectModalOpen(false);
        setIsDeleteConfirmModalOpen(false);
    };

    const openNewProjectModal = () => setIsNewProjectModalOpen(true);

    const handleNewProjectSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (newProjectName.trim()) {
            const newProjectFolder: ProjectFolder = { id: Date.now().toString(), name: newProjectName.trim(), instructions: '' };
            setProjectFolders(prev => [newProjectFolder, ...prev]);
            setActiveProjectId(newProjectFolder.id);
            closeAllModals();
            setNewProjectName('');
        }
    };

    const openRenameModal = (item: ChatData | ProjectFolder) => {
        setItemToRename(item);
        setRenameInput(item.name);
        setIsRenameModalOpen(true);
    };

    const handleRenameModalSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (itemToRename && renameInput.trim()) {
            if ('history' in itemToRename) {
                setChats(prev => prev.map(c => c.id === itemToRename.id ? {...c, name: renameInput.trim()} : c));
            } else {
                setProjectFolders(prev => prev.map(p => p.id === itemToRename.id ? {...p, name: renameInput.trim()} : p));
            }
            closeAllModals();
            setItemToRename(null);
        }
    };

    const openInstructionsModal = (project: ProjectFolder) => {
        setProjectForInstructions(project);
        setCurrentInstructions(project.instructions || '');
        setIsInstructionsModalOpen(true);
    };

    const handleInstructionsModalSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (projectForInstructions) {
            setProjectFolders(prev => prev.map(p => p.id === projectForInstructions.id ? {...p, instructions: currentInstructions} : p));
            closeAllModals();
            setProjectForInstructions(null);
        }
    };

    const openMoveModal = () => setIsMoveModalOpen(true);
    
    const handleMoveChat = (chatId: string, targetProjectId: string | null) => {
        setChats(prev => prev.map(c => c.id === chatId ? {...c, projectId: targetProjectId} : c));
        const activeChat = chats.find(c => c.id === chatId);
        if (activeChat) {
            setActiveProjectId(targetProjectId);
        }
        closeAllModals();
    };

    const openDeleteModal = (item: ChatData | ProjectFolder) => {
        setItemToDelete(item);
        setIsDeleteConfirmModalOpen(true);
    };

    return {
        isRenameModalOpen, isInstructionsModalOpen, isMoveModalOpen, isNewProjectModalOpen, isDeleteConfirmModalOpen,
        renameInput, newProjectName, currentInstructions, itemToDelete,
        setRenameInput, setNewProjectName, setCurrentInstructions,
        openNewProjectModal, handleNewProjectSubmit,
        openRenameModal, handleRenameModalSubmit,
        openInstructionsModal, handleInstructionsModalSubmit,
        openMoveModal, handleMoveChat,
        openDeleteModal, 
        closeAllModals,
    };
};