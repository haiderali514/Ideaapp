import React, { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom/client';
import { GoogleGenAI, Chat, GenerateContentResponse } from "@google/genai";

const API_KEY = process.env.API_KEY;

interface ChatPart { text: string; }
interface ChatHistoryItem { role: 'user' | 'model'; parts: ChatPart[]; }

interface ChatData {
  id: string;
  name: string;
  history: ChatHistoryItem[];
  instructions?: string;
  projectId?: string | null;
}

interface ProjectFolder {
  id: string;
  name: string;
}

const App = () => {
  const [chats, setChats] = useState<ChatData[]>([]);
  const [projectFolders, setProjectFolders] = useState<ProjectFolder[]>([]);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [currentMessage, setCurrentMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [isRenameModalOpen, setIsRenameModalOpen] = useState(false);
  const [isInstructionsModalOpen, setIsInstructionsModalOpen] = useState(false);
  const [isMoveModalOpen, setIsMoveModalOpen] = useState(false);
  const [renameInput, setRenameInput] = useState('');
  const [currentInstructions, setCurrentInstructions] = useState('');
  const [itemToRename, setItemToRename] = useState<ChatData | ProjectFolder | null>(null);
  
  const [isProjectOptionsOpen, setIsProjectOptionsOpen] = useState(false);
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);
  const [expandedSections, setExpandedSections] = useState({ projects: true, chats: true });

  const chatLogRef = useRef<HTMLDivElement>(null);
  const optionsMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatLogRef.current) {
      chatLogRef.current.scrollTop = chatLogRef.current.scrollHeight;
    }
  }, [chats, activeChatId, isLoading]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (optionsMenuRef.current && !optionsMenuRef.current.contains(event.target as Node)) {
        setIsProjectOptionsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleNewChat = () => {
    const newChat: ChatData = {
      id: Date.now().toString(),
      name: "New Chat",
      history: [],
      instructions: '',
      projectId: null,
    };
    setChats(prev => [newChat, ...prev]);
    setActiveChatId(newChat.id);
    if (!isSidebarExpanded) setIsSidebarExpanded(true);
    setExpandedSections(prev => ({...prev, chats: true}));
  };

  const handleNewProjectFolder = () => {
    const name = prompt("Enter new project folder name:");
    if (name && name.trim()) {
      const newProjectFolder: ProjectFolder = { id: Date.now().toString(), name: name.trim() };
      setProjectFolders(prev => [newProjectFolder, ...prev]);
      setExpandedSections(prev => ({...prev, projects: true}));
    }
  };

  const handleDeleteChat = (chatId: string) => {
    if (window.confirm("Are you sure you want to delete this chat?")) {
        setChats(prev => prev.filter(c => c.id !== chatId));
        if (activeChatId === chatId) {
            const remainingChats = chats.filter(c => c.id !== chatId);
            setActiveChatId(remainingChats.length > 0 ? remainingChats[0].id : null);
        }
        setIsProjectOptionsOpen(false);
    }
  };

  const handleOpenRenameModal = (item: ChatData | ProjectFolder) => {
      setItemToRename(item);
      setRenameInput(item.name);
      setIsRenameModalOpen(true);
      setIsProjectOptionsOpen(false);
  };

  const handleRenameModalSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (itemToRename && renameInput.trim()) {
          if ('history' in itemToRename) { // It's a ChatData
              setChats(prev => prev.map(c => c.id === itemToRename.id ? {...c, name: renameInput.trim()} : c));
          } else { // It's a ProjectFolder
              setProjectFolders(prev => prev.map(p => p.id === itemToRename.id ? {...p, name: renameInput.trim()} : p));
          }
          setIsRenameModalOpen(false);
          setRenameInput('');
          setItemToRename(null);
      }
  };

  const handleOpenInstructionsModal = (chat: ChatData) => {
    setCurrentInstructions(chat.instructions || '');
    setIsInstructionsModalOpen(true);
    setIsProjectOptionsOpen(false);
  };

  const handleInstructionsModalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (activeChatId) {
        setChats(prev => prev.map(c => c.id === activeChatId ? {...c, instructions: currentInstructions} : c));
        setIsInstructionsModalOpen(false);
    }
  };
  
  const handleMoveChat = (chatId: string, targetProjectId: string | null) => {
    setChats(prev => prev.map(c => c.id === chatId ? {...c, projectId: targetProjectId} : c));
    setIsMoveModalOpen(false);
  };

  const sendMessage = async (message: string, chatId: string) => {
    if (!message.trim()) return;
    const chatData = chats.find(c => c.id === chatId);
    if (!chatData) {
        setError("Could not find the active chat.");
        return;
    }
    const userMessage = { role: 'user' as const, parts: [{ text: message }] };
    const updatedHistory = [...chatData.history, userMessage];
    setChats(prev => prev.map(c => c.id === chatId ? { ...c, history: updatedHistory } : c));
    setCurrentMessage('');
    setIsLoading(true);
    setError('');
    try {
      if (!API_KEY) throw new Error("API_KEY is not configured.");
      const ai = new GoogleGenAI({ apiKey: API_KEY });
      const baseSystemInstruction = `You are an expert software project manager...`;
      const customInstructions = chatData.instructions ? `\n\nCRITICAL: You must adhere to the following user-provided instructions for this specific project:\n<instructions>\n${chatData.instructions}\n</instructions>` : '';
      const chat: Chat = ai.chats.create({
        model: 'gemini-2.5-flash',
        history: chatData.history,
        config: { systemInstruction: baseSystemInstruction + customInstructions },
      });
      const response: GenerateContentResponse = await chat.sendMessage({ message });
      const modelMessage = { role: 'model' as const, parts: [{ text: response.text }] };
      setChats(prev => prev.map(c => c.id === chatId ? { ...c, history: [...updatedHistory, modelMessage] } : c));
    } catch (err) {
      console.error(err);
      setError('An error occurred. Please check your connection and API key.');
      setChats(prev => prev.map(c => c.id === chatId ? { ...c, history: chatData.history } : c));
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (activeChatId) sendMessage(currentMessage, activeChatId);
  };
  
  const activeChat = chats.find(c => c.id === activeChatId);

  const RenameModal = () => (
    <div className="modal-overlay" onClick={() => setIsRenameModalOpen(false)}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>Rename</h2>
        <form onSubmit={handleRenameModalSubmit}>
          <input type="text" value={renameInput} onChange={(e) => setRenameInput(e.target.value)} autoFocus />
          <div className="modal-actions">
            <button type="button" onClick={() => setIsRenameModalOpen(false)}>Cancel</button>
            <button type="submit" disabled={!renameInput.trim()}>Save</button>
          </div>
        </form>
      </div>
    </div>
  );

  const InstructionsModal = () => (
    <div className="modal-overlay" onClick={() => setIsInstructionsModalOpen(false)}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Custom Instructions</h2>
            <form onSubmit={handleInstructionsModalSubmit}>
                <textarea value={currentInstructions} onChange={(e) => setCurrentInstructions(e.target.value)} autoFocus />
                <div className="modal-actions">
                    <button type="button" onClick={() => setIsInstructionsModalOpen(false)}>Cancel</button>
                    <button type="submit">Save</button>
                </div>
            </form>
        </div>
    </div>
  );

  const MoveToProjectModal = () => {
    const [selectedProject, setSelectedProject] = useState(activeChat?.projectId || 'none');
    if (!activeChat) return null;
    return (
        <div className="modal-overlay" onClick={() => setIsMoveModalOpen(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <h2>Move to Project</h2>
                <form onSubmit={(e) => { e.preventDefault(); handleMoveChat(activeChat.id, selectedProject === 'none' ? null : selectedProject); }}>
                    <select value={selectedProject} onChange={(e) => setSelectedProject(e.target.value)}>
                        <option value="none">None (Uncategorized)</option>
                        {projectFolders.map(pf => <option key={pf.id} value={pf.id}>{pf.name}</option>)}
                    </select>
                    <div className="modal-actions">
                        <button type="button" onClick={() => setIsMoveModalOpen(false)}>Cancel</button>
                        <button type="submit">Move</button>
                    </div>
                </form>
            </div>
        </div>
    );
  };
  
  const toggleSection = (section: 'projects' | 'chats') => {
      setExpandedSections(prev => ({...prev, [section]: !prev[section]}));
  };

  return (
    <>
      {isRenameModalOpen && <RenameModal />}
      {isInstructionsModalOpen && <InstructionsModal />}
      {isMoveModalOpen && <MoveToProjectModal />}
      <div className="app-container">
        <aside className={`sidebar ${!isSidebarExpanded ? 'collapsed' : ''}`}>
            <div className="sidebar-content">
                <div className="sidebar-header">
                     <button className="sidebar-logo">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 2L2 7V17L12 22L22 17V7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M2 7L12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M12 22V12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M22 7L12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M17 4.5L7 9.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                        {isSidebarExpanded && <span>IdeaPlan AI</span>}
                    </button>
                    <button className="sidebar-toggle" onClick={() => setIsSidebarExpanded(!isSidebarExpanded)}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="9" y1="3" x2="9" y2="21"></line></svg>
                         <span className="tooltip">{isSidebarExpanded ? 'Close sidebar' : 'Open sidebar'}</span>
                    </button>
                </div>
                <div className="sidebar-section">
                     <button className="sidebar-item" onClick={handleNewChat}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path></svg>
                        {isSidebarExpanded && <span>New chat</span>}
                         <span className="tooltip">New chat</span>
                    </button>
                     <button className="sidebar-item"><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg> {isSidebarExpanded && <span>Search chats</span>} <span className="tooltip">Search chats</span></button>
                     <button className="sidebar-item"><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path></svg>{isSidebarExpanded && <span>Library</span>}<span className="tooltip">Library</span></button>
                </div>
                
                <div className={`sidebar-section-header ${!expandedSections.projects ? 'collapsed' : ''}`} onClick={() => toggleSection('projects')}>
                    <span>Projects</span>
                    <div style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
                      <button className="add-project-btn" onClick={(e) => { e.stopPropagation(); handleNewProjectFolder(); }}><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg></button>
                      <svg className="chevron" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
                    </div>
                </div>
                <ul className={`project-list ${!expandedSections.projects ? 'collapsed' : ''}`}>
                    {projectFolders.map(pf => (
                        <li key={pf.id}>
                            <div className='project-folder-item' onClick={() => {/* maybe expand/collapse chats in folder in future*/}}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path></svg>
                                {isSidebarExpanded && <span>{pf.name}</span>}
                                <span className="tooltip">{pf.name}</span>
                            </div>
                            <ul className="chat-list">
                                {chats.filter(c => c.projectId === pf.id).map(chat => (
                                    <li key={chat.id} className={`chat-list-item nested ${chat.id === activeChatId ? 'active' : ''}`} onClick={() => setActiveChatId(chat.id)}>
                                        {isSidebarExpanded && <span>{chat.name}</span>}
                                        <span className="tooltip">{chat.name}</span>
                                    </li>
                                ))}
                            </ul>
                        </li>
                    ))}
                </ul>

                <div className={`sidebar-section-header ${!expandedSections.chats ? 'collapsed' : ''}`} onClick={() => toggleSection('chats')}>
                    <span>Chats</span>
                    <svg className="chevron" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
                </div>
                 <ul className={`chat-list ${!expandedSections.chats ? 'collapsed' : ''}`}>
                    {chats.filter(c => !c.projectId).map(chat => (
                    <li key={chat.id} className={`chat-list-item ${chat.id === activeChatId ? 'active' : ''}`} onClick={() => setActiveChatId(chat.id)}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
                        {isSidebarExpanded && <span>{chat.name}</span>}
                        <span className="tooltip">{chat.name}</span>
                    </li>
                    ))}
                </ul>
            </div>
        </aside>
        <main className="main-content">
          {activeChat ? (
            <div className="project-view">
              <header className="project-header">
                <span>{activeChat.name}</span>
                <div className="project-options-container" ref={optionsMenuRef}>
                    <button className="options-btn" onClick={() => setIsProjectOptionsOpen(prev => !prev)}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="1"></circle><circle cx="12" cy="5" r="1"></circle><circle cx="12" cy="19" r="1"></circle></svg>
                    </button>
                    {isProjectOptionsOpen && (
                        <div className="options-dropdown">
                            <button className="dropdown-item" onClick={() => { setIsMoveModalOpen(true); setIsProjectOptionsOpen(false); }}>Move to Project</button>
                            <button className="dropdown-item" onClick={() => handleOpenInstructionsModal(activeChat)}>Add Instructions</button>
                            <button className="dropdown-item" onClick={() => handleOpenRenameModal(activeChat)}>Rename</button>
                             <button className="dropdown-item delete" onClick={() => handleDeleteChat(activeChat.id)}>Delete Chat</button>
                        </div>
                    )}
                </div>
              </header>
              <div className="chat-log" ref={chatLogRef}>
                {activeChat.history.length === 0 && !isLoading && (
                    <div className="empty-chat-placeholder"><h2>{activeChat.name}</h2><p>Send a message to start.</p></div>
                )}
                {activeChat.history.map((item, index) => (
                  <div key={index} className={`chat-message ${item.role}`}>
                    <div className={`avatar ${item.role}`}>{item.role === 'user' ? 'G' : 'AI'}</div>
                    <div className="message-content"><div className="message-bubble" dangerouslySetInnerHTML={{ __html: (window as any).marked.parse(item.parts[0].text) }}></div></div>
                  </div>
                ))}
                {isLoading && <div className="loading-indicator">Thinking...</div>}
                {error && <div className="error-message">{error}</div>}
              </div>
              <div className="chat-form-container">
                  <form className="chat-form" onSubmit={handleFormSubmit}>
                    <textarea className="chat-textarea" value={currentMessage} onChange={(e) => setCurrentMessage(e.target.value)} placeholder={`Message ${activeChat.name}...`} disabled={isLoading} onKeyDown={(e) => {if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleFormSubmit(e); }}}/>
                    <button type="submit" className="send-button" disabled={isLoading || !currentMessage.trim()}><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z"/></svg></button>
                  </form>
              </div>
            </div>
          ) : ( <div className="placeholder"><h1>IdeaPlan AI</h1><p>Click "New chat".</p></div> )}
        </main>
      </div>
    </>
  );
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);