import { Macro } from '../App';
import { projectId, publicAnonKey } from './supabase/info';

const SERVER_URL = `https://${projectId}.supabase.co/functions/v1/make-server-c7d9e72f`;

interface MacroServiceResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
}

class MacroService {
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<MacroServiceResponse<T>> {
    try {
      const response = await fetch(`${SERVER_URL}${endpoint}`, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`,
          ...options.headers,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        console.error(`Macro service error (${endpoint}):`, data.error || response.statusText);
        return {
          success: false,
          error: data.error || `Request failed: ${response.statusText}`,
        };
      }

      return {
        success: true,
        data,
      };
    } catch (error) {
      console.error(`Macro service request error (${endpoint}):`, error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  // Get all macros
  async getAllMacros(): Promise<MacroServiceResponse<Macro[]>> {
    const response = await this.request<{ macros: Macro[] }>('/macros');
    
    if (response.success && response.data) {
      return {
        success: true,
        data: response.data.macros || [],
      };
    }
    
    return response;
  }

  // Get a single macro by ID
  async getMacro(id: string): Promise<MacroServiceResponse<Macro>> {
    const response = await this.request<{ macro: Macro }>(`/macros/${id}`);
    
    if (response.success && response.data) {
      return {
        success: true,
        data: response.data.macro,
      };
    }
    
    return response;
  }

  // Create a new macro
  async createMacro(macro: Macro): Promise<MacroServiceResponse<Macro>> {
    const response = await this.request<{ macro: Macro }>('/macros', {
      method: 'POST',
      body: JSON.stringify(macro),
    });
    
    if (response.success && response.data) {
      return {
        success: true,
        data: response.data.macro,
      };
    }
    
    return response;
  }

  // Update an existing macro
  async updateMacro(id: string, updates: Partial<Macro>): Promise<MacroServiceResponse<Macro>> {
    const response = await this.request<{ macro: Macro }>(`/macros/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
    
    if (response.success && response.data) {
      return {
        success: true,
        data: response.data.macro,
      };
    }
    
    return response;
  }

  // Delete a macro
  async deleteMacro(id: string): Promise<MacroServiceResponse<void>> {
    return await this.request(`/macros/${id}`, {
      method: 'DELETE',
    });
  }

  // Increment run count
  async recordMacroRun(id: string): Promise<MacroServiceResponse<Macro>> {
    const response = await this.request<{ macro: Macro }>(`/macros/${id}/run`, {
      method: 'POST',
    });
    
    if (response.success && response.data) {
      return {
        success: true,
        data: response.data.macro,
      };
    }
    
    return response;
  }

  // Initialize default macros (for first-time users)
  async initializeDefaultMacros(macros: Macro[]): Promise<MacroServiceResponse<{ count: number }>> {
    const response = await this.request<{ count: number }>('/macros/initialize', {
      method: 'POST',
      body: JSON.stringify({ macros }),
    });
    
    if (response.success && response.data) {
      return {
        success: true,
        data: { count: response.data.count || 0 },
      };
    }
    
    return response;
  }
}

// Export singleton instance
export const macroService = new MacroService();
