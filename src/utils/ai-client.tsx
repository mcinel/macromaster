import { projectId, publicAnonKey } from './supabase/info';

// Using the server edge function with the make-server route prefix
const EDGE_FUNCTION = 'server';
const ROUTE_PREFIX = 'make-server-c7d9e72f';
const SERVER_BASE_URL = `https://${projectId}.supabase.co/functions/v1/${EDGE_FUNCTION}/${ROUTE_PREFIX}`;

export interface PromptEnhancementRequest {
  prompt: string;
}

export interface PromptEnhancementResponse {
  originalPrompt: string;
  enhancedPrompt: string;
  success: boolean;
  error?: string;
}

export interface MacroGenerationRequest {
  prompt: string;
}

export interface MacroGenerationResponse {
  macro: {
    id: string;
    name: string;
    description: string;
    category: string;
    permissions: string[];
    steps: Array<{
      id: string;
      type: 'trigger' | 'condition' | 'action';
      title: string;
      description: string;
      icon: string;
      settings: Record<string, any>;
    }>;
    isEnabled: boolean;
    createdAt: string;
    runCount: number;
  };
  explanation: string;
  confidence: number;
  success: boolean;
  originalPrompt: string;
  error?: string;
}

class AIClient {
  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const response = await fetch(`${SERVER_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${publicAnonKey}`,
        ...options.headers,
      },
    });

    if (!response.ok) {
      let errorMessage = 'Unknown error occurred';
      try {
        const errorData = await response.json();
        errorMessage = errorData.error || errorMessage;
      } catch {
        errorMessage = response.statusText || errorMessage;
      }
      throw new Error(errorMessage);
    }

    return response.json();
  }

  async enhancePrompt(prompt: string): Promise<PromptEnhancementResponse> {
    return this.makeRequest<PromptEnhancementResponse>('/ai/enhance-prompt', {
      method: 'POST',
      body: JSON.stringify({ prompt }),
    });
  }

  async generateMacro(prompt: string): Promise<MacroGenerationResponse> {
    return this.makeRequest<MacroGenerationResponse>('/ai/generate-macro', {
      method: 'POST',
      body: JSON.stringify({ prompt }),
    });
  }
}

export const aiClient = new AIClient();