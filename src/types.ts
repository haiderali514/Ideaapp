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

export interface ProjectFolder {
  id: string;
  name: string;
  instructions?: string;
}
