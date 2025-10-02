import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { useData } from '../hooks/useData';
import { useModals } from '../hooks/useModals';
import { useChatHandler } from '../hooks/useChatHandler';
import { ChatData, ProjectFolder } from '../types';

type MainViewMode = 'dashboard' | 'project_preview' | 'code_editor';

interface AppContextType extends ReturnType<typeof useData>, ReturnType<typeof useModals>, ReturnType<typeof useChatHandler> {
    isSidebarExpanded: boolean; // This can be repurposed for the new LeftPanel
    setIsSidebarExpanded: React.Dispatch<React.SetStateAction<boolean>>;
    activeChat: ChatData | undefined;
    activeProject: ProjectFolder | undefined;
    handleSelectProject: (projectId: string) => void;
    handleGoToWorkspace: () => void;
    isAuthenticated: boolean;
    handleLogin: () => void;
    mainViewMode: MainViewMode;
    setMainViewMode: React.Dispatch<React.SetStateAction<MainViewMode>>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [mainViewMode, setMainViewMode] = useState<MainViewMode>('dashboard');

    const data = useData();
    const modals = useModals({
        ...data
    });
    const chatHandler = useChatHandler({
        ...data,
        ...modals
    });

    const activeChat = data.chats.find(c => c.id === data.activeChatId);
    const activeProject = data.projectFolders.find(p => p.id === data.activeProjectId);

    const handleLogin = () => {
        setIsAuthenticated(true);
    };

    const handleSelectProject = (projectId: string) => {
        data.setActiveProjectId(projectId);
        setMainViewMode('project_preview');
        const chatsInProject = data.chats.filter(c => c.projectId === projectId);
        if (chatsInProject.length > 0) {
            data.setActiveChatId(chatsInProject[0].id);
        } else {
            // If project has no chats, create one and set it as active
            const newChatId = data.handleNewChat(projectId);
            data.setActiveChatId(newChatId);
        }
    };
    
    const handleGoToWorkspace = () => {
        data.setActiveProjectId(null);
        data.setActiveChatId(null);
        setMainViewMode('dashboard');
    };

    // Effect to handle project deletion and state cleanup
    useEffect(() => {
        if (data.activeProjectId && !data.projectFolders.find(p => p.id === data.activeProjectId)) {
            data.setActiveProjectId(null);
            data.setActiveChatId(null);
            setMainViewMode('dashboard');
        }
    }, [data.projectFolders, data.activeProjectId]);


    const value: AppContextType = {
        ...data,
        ...modals,
        ...chatHandler,
        isSidebarExpanded,
        setIsSidebarExpanded,
        activeChat,
        activeProject,
        handleSelectProject,
        handleGoToWorkspace,
        isAuthenticated,
        handleLogin,
        mainViewMode,
        setMainViewMode,
    };

    return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => {
    const context = useContext(AppContext);
    if (context === undefined) {
        throw new Error('useAppContext must be used within an AppProvider');
    }
    return context;
};