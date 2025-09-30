export interface ChatPart {
  text?: string;
  inlineData?: {
    mimeType: string;
    data: string;
  };
}

export interface ChatHistoryItem {
  role: 'user' | 'model';
  parts: ChatPart[];
}

export interface ChatData {
  id: string;
  name: string;
  history: ChatHistoryItem[];
  projectId?: string | null;
}

export interface UIComponent {
  id: string;
  prompt: string;
  html: string;
  css: string;
}

// FIX: Added optional problemStatement and features properties to align with usage across the app.
export interface ProjectFolder {
  id: string;
  name: string;
  instructions?: string;
  problemStatement?: string;
  features?: string[];
  components?: UIComponent[];
}