import React, { createContext, useContext, useState, ReactNode } from 'react';
import { useData } from '../hooks/useData';
import { useModals } from '../hooks/useModals';
import { useChatHandler } from '../hooks/useChatHandler';
import { ChatData, ProjectFolder } from '../types';

interface AppContextType extends ReturnType<typeof useData>, ReturnType<typeof useModals>, ReturnType<typeof useChatHandler> {
    isSidebarExpanded: boolean;
    setIsSidebarExpanded: React.Dispatch<React.SetStateAction<boolean>>;
    activeChat: ChatData | undefined;
    activeProject: ProjectFolder | undefined;
    handleSelectProject: (projectId: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);

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

    const handleSelectProject = (projectId: string) => {
        data.setActiveProjectId(projectId);
        data.setActiveChatId(null);
    };

    const value: AppContextType = {
        ...data,
        ...modals,
        ...chatHandler,
        isSidebarExpanded,
        setIsSidebarExpanded,
        activeChat,
        activeProject,
        handleSelectProject,
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
