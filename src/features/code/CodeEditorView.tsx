import React from 'react';
import { useAppContext } from '../../context/AppContext';

const CodeLine: React.FC<{ number: number, children: React.ReactNode }> = ({ number, children }) => (
    <div className="code-line">
        <span className="line-number">{number}</span>
        <span className="line-content">{children}</span>
    </div>
);

const FileItem: React.FC<{ name: string, icon: string, active?: boolean, level?: number }> = ({ name, icon, active, level=0 }) => (
    <div className={`file-tree-item ${active ? 'active' : ''}`} style={{ paddingLeft: `calc(var(--spacing-2) + ${level * 20}px)` }}>
        <span>{icon}</span>
        <span>{name}</span>
    </div>
);

export const CodeEditorView: React.FC = () => {
    const { setMainViewMode } = useAppContext();

    return (
        <div className="code-editor-view">
            <header className="code-editor-header">
                <div className="code-editor-header-left">
                    <h3>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="16 18 22 12 16 6"></polyline><polyline points="8 6 2 12 8 18"></polyline></svg>
                        Code
                    </h3>
                </div>
                <div className="code-editor-header-right">
                    <button className="header-btn">Read only</button>
                    <button className="header-btn upgrade">Upgrade</button>
                    <button className="header-btn" onClick={() => setMainViewMode('project_preview')}>Close</button>
                </div>
            </header>
            <div className="code-editor-body">
                <aside className="code-editor-sidebar">
                    <div className="file-tree-header">
                        <h4>Files</h4>
                    </div>
                    <ul className="file-tree">
                        <li><FileItem name="public" icon="📂" /></li>
                        <li>
                            <ul>
                                <li><FileItem name="favicon.ico" icon="📄" level={1} /></li>
                                <li><FileItem name="placeholder.svg" icon="📄" level={1} /></li>
                            </ul>
                        </li>
                         <li><FileItem name="src" icon="📂" /></li>
                         <li>
                             <ul>
                                <li><FileItem name="components" icon="📂" level={1} /></li>
                                <li><FileItem name="hooks" icon="📂" level={1} /></li>
                                <li><FileItem name="pages" icon="📂" level={1} /></li>
                                <li>
                                     <ul>
                                        <li><FileItem name="index.tsx" icon="⚛️" active level={2} /></li>
                                    </ul>
                                </li>
                                <li><FileItem name="App.tsx" icon="⚛️" level={1} /></li>
                             </ul>
                         </li>
                         <li><FileItem name="index.css" icon="#" level={0} /></li>
                    </ul>
                </aside>
                <main className="code-editor-main">
                    <div className="code-editor-tabs">
                        <div className="code-editor-tab active">src/pages/index.tsx</div>
                    </div>
                    <div className="code-panel">
                        <pre><code>
                            <CodeLine number={1}><span className="token-keyword">import</span> <span className="token-punctuation">{'{'}</span> useState, useEffect <span className="token-punctuation">{'}'}</span> <span className="token-keyword">from</span> <span className="token-string">"react"</span><span className="token-punctuation">;</span></CodeLine>
                            <CodeLine number={2}><span className="token-keyword">import</span> <span className="token-punctuation">{'{'}</span> TaskCard, Task <span className="token-punctuation">{'}'}</span> <span className="token-keyword">from</span> <span className="token-string">"@/components/TaskCard"</span><span className="token-punctuation">;</span></CodeLine>
                            <CodeLine number={3}><span className="token-comment">{'// ... other imports'}</span></CodeLine>
                            <CodeLine number={4}>&nbsp;</CodeLine>
                            <CodeLine number={5}><span className="token-keyword">interface</span> IndexProps <span className="token-punctuation">{'{'}</span></CodeLine>
                            <CodeLine number={6}>  currentView: <span className="token-keyword">string</span>;</CodeLine>
                            <CodeLine number={7}><span className="token-punctuation">{'}'}</span></CodeLine>
                            <CodeLine number={8}>&nbsp;</CodeLine>
                            <CodeLine number={9}><span className="token-keyword">const</span> Index <span className="token-punctuation">=</span> (<span className="token-punctuation">{'{'}</span> currentView <span className="token-punctuation">{'}'}</span>: IndexProps) <span className="token-punctuation">=&gt;</span> <span className="token-punctuation">{'{'}</span></CodeLine>
                            <CodeLine number={10}>  <span className="token-keyword">const</span> [tasks, setTasks] <span className="token-punctuation">=</span> <span className="token-function">useState</span>&lt;Task[]&gt;([])<span className="token-punctuation">;</span></CodeLine>
                            <CodeLine number={11}>&nbsp;</CodeLine>
                            <CodeLine number={12}>  <span className="token-keyword">const</span> [tasks, setTasks] <span className="token-punctuation">=</span> <span className="token-function">useState</span>&lt;Task[]&gt;([</CodeLine>
                            <CodeLine number={13}>    <span className="token-punctuation">{'{'}</span> id: <span className="token-string">'1'</span>, title: <span className="token-string">'Review project proposal'</span>, completed: <span className="token-keyword">false</span> <span className="token-punctuation">{'}'}</span>,</CodeLine>
                            <CodeLine number={14}>    <span className="token-punctuation">{'{'}</span> id: <span className="token-string">'2'</span>, title: <span className="token-string">'Morning workout routine'</span>, completed: <span className="token-keyword">true</span> <span className="token-punctuation">{'}'}</span>,</CodeLine>
                            <CodeLine number={15}>    <span className="token-punctuation">{'{'}</span> id: <span className="token-string">'3'</span>, title: <span className="token-string">'Learn React hooks'</span>, completed: <span className="token-keyword">false</span> <span className="token-punctuation">{'}'}</span>,</CodeLine>
                            <CodeLine number={16}>  ])<span className="token-punctuation">;</span></CodeLine>
                             <CodeLine number={17}>&nbsp;</CodeLine>
                             <CodeLine number={18}>  <span className="token-keyword">return</span> (</CodeLine>
                             <CodeLine number={19}>    &lt;<span className="token-tag">div</span>&gt;</CodeLine>
                             <CodeLine number={20}>      <span className="token-comment">{'// ... UI Code'}</span></CodeLine>
                            <CodeLine number={21}>    &lt;/<span className="token-tag">div</span>&gt;</CodeLine>
                            <CodeLine number={22}>  )<span className="token-punctuation">;</span></CodeLine>
                            <CodeLine number={23}><span className="token-punctuation">{'}'}</span>;</CodeLine>
                        </code></pre>
                    </div>
                </main>
            </div>
        </div>
    );
};
