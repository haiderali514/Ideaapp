import React, { useState } from 'react';
import { generateComponentCode } from '../../services/geminiService';
import { UIComponent } from '../../types';

interface ComponentBuilderProps {
    onSaveComponent: (componentData: Omit<UIComponent, 'id'>) => void;
}

export const ComponentBuilder: React.FC<ComponentBuilderProps> = ({ onSaveComponent }) => {
    const [prompt, setPrompt] = useState('');
    const [generatedCode, setGeneratedCode] = useState<{ html: string; css: string } | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleGenerate = async () => {
        if (!prompt.trim()) return;
        setIsLoading(true);
        setGeneratedCode(null);
        const code = await generateComponentCode(prompt);
        setGeneratedCode(code);
        setIsLoading(false);
    };

    const handleSave = () => {
        if (generatedCode && prompt) {
            onSaveComponent({
                prompt,
                html: generatedCode.html,
                css: generatedCode.css,
            });
            // Clear the state after saving
            setPrompt('');
            setGeneratedCode(null);
        }
    };
    
    const iframeContent = generatedCode 
        ? `<html><head><style>${generatedCode.css}</style></head><body>${generatedCode.html}</body></html>`
        : '';

    return (
        <div className="component-builder-container">
            <div className="builder-prompt-section">
                <div className="workflow-heading" style={{ marginBottom: 'var(--spacing-4)', textAlign: 'left' }}>
                    <h2 style={{ fontSize: '1.25rem' }}>AI Component Builder</h2>
                    <p style={{ maxWidth: 'none', margin: 0 }}>Describe the UI component you want to create, and the AI will generate the code and a live preview.</p>
                </div>
                <textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="e.g., A product card with an image, title, price, and an 'Add to Cart' button."
                    rows={3}
                />
                <div className="workflow-actions" style={{ justifyContent: 'flex-start' }}>
                    <button className="generate-btn" onClick={handleGenerate} disabled={!prompt.trim() || isLoading}>
                        {isLoading ? 'Generating...' : <>✨ Generate Component</>}
                    </button>
                    {generatedCode && !isLoading && (
                        <button className="save-btn" onClick={handleSave}>
                            Save to Project
                        </button>
                    )}
                </div>
            </div>

            {(isLoading || generatedCode) && (
                <div className="builder-main-content">
                    <div className="builder-preview-panel">
                        <div className="panel-header">Preview</div>
                        {isLoading ? (
                            <div className="loading-dots" style={{margin: 'auto'}}><span></span><span></span><span></span></div>
                        ) : (
                            <iframe
                                className="builder-preview-iframe"
                                srcDoc={iframeContent}
                                title="Component Preview"
                                sandbox="allow-scripts"
                            />
                        )}
                    </div>
                    <div className="builder-code-panel">
                        <div className="panel-header">Code</div>
                        <div className="builder-code-panel-content">
                            {isLoading ? (
                                <div className="loading-dots" style={{ margin: 'auto' }}><span></span><span></span><span></span></div>
                            ) : (
                                <>
                                    <div className="code-block">
                                        <h4>HTML</h4>
                                        <pre><code>{generatedCode?.html}</code></pre>
                                    </div>
                                    <div className="code-block">
                                        <h4>CSS</h4>
                                        <pre><code>{generatedCode?.css}</code></pre>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};