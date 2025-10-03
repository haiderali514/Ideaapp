import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { useData } from '../hooks/useData';
import { useModals } from '../hooks/useModals';
import { useChatHandler } from '../hooks/useChatHandler';
import { ChatData, ProjectFolder } from '../types';

type MainViewMode = 'dashboard' | 'project_preview' | 'code_editor';

export interface User {
    name: string;
    initials: string;
    email: string;
}

interface AppContextType extends ReturnType<typeof useData>, ReturnType<typeof useModals>, ReturnType<typeof useChatHandler> {
    isSidebarExpanded: boolean; // This can be repurposed for the new LeftPanel
    setIsSidebarExpanded: React.Dispatch<React.SetStateAction<boolean>>;
    activeChat: ChatData | undefined;
    activeProject: ProjectFolder | undefined;
    handleSelectProject: (projectId: string) => void;
    handleGoToWorkspace: () => void;
    isAuthenticated: boolean;
    handleLogin: () => void;
    handleLogout: () => void;
    mainViewMode: MainViewMode;
    setMainViewMode: React.Dispatch<React.SetStateAction<MainViewMode>>;
    user: User | null;
    isAuthPageVisible: boolean;
    showAuthPage: () => void;
    hideAuthPage: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isAuthPageVisible, setIsAuthPageVisible] = useState(false);
    const [mainViewMode, setMainViewMode] = useState<MainViewMode>('dashboard');
    const [user, setUser] = useState<User | null>(null);

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
    
    const showAuthPage = () => setIsAuthPageVisible(true);
    const hideAuthPage = () => setIsAuthPageVisible(false);

    const handleLogin = () => {
        setIsAuthenticated(true);
        setUser({
            name: "Gulzar Hussain",
            initials: "GH",
            email: "gulzar.hussain@ideaspark.ai"
        });
        setIsAuthPageVisible(false);
    };

    const handleLogout = () => {
        setIsAuthenticated(false);
        setUser(null);
        data.setActiveProjectId(null);
        data.setActiveChatId(null);
        setMainViewMode('dashboard');
    };

    const handleSelectProject = (projectId: string) => {
        data.setActiveProjectId(projectId);
        data.setActiveChatId(null); 
        setMainViewMode('project_preview');
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
        handleLogout,
        mainViewMode,
        setMainViewMode,
        user,
        isAuthPageVisible,
        showAuthPage,
        hideAuthPage,
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