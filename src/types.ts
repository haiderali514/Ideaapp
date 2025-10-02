export interface ChatPart {
  text?: string;
  inlineData?: {
    mimeType: string;
    data: string;
  };
  // NEW: Added type to support different message styles
  type?: 'text' | 'thought' | 'action';
  actionDetails?: {
    title: string;
    description: string;
  }
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

export interface Competitor {
  name: string;
  inspirations: string[];
  opportunities: string[];
}

export interface ProjectAnalysis {
  technologies: { name: string, reason: string }[];
  uiuxStrategy: string;
  competitorAnalysis: Competitor[];
}

export interface Feature {
  text: string;
  isMvp: boolean;
  priority: 'low' | 'medium' | 'high';
}


export interface ProjectFolder {
  id: string;
  name: string;
  instructions?: string;
  problemStatement?: string;
  features?: Feature[];
  components?: UIComponent[];
  status?: 'pending' | 'accepted' | 'rejected';
  priority?: 'low' | 'medium' | 'high';
  analysis?: ProjectAnalysis;
}