import { projectId, publicAnonKey } from './supabase/info';

// Mock data for demo mode
const MOCK_PERMISSIONS = [
  {
    name: 'MODIFY_AUDIO_SETTINGS',
    displayName: 'Modify Audio Settings',
    description: 'Allows the app to modify global audio settings such as volume and which speaker is used for output.',
    category: 'System',
    dangerLevel: 'normal'
  },
  {
    name: 'WRITE_SETTINGS',
    displayName: 'Modify System Settings',
    description: 'Allows the app to modify the system\'s settings data, including brightness and volume.',
    category: 'System',
    dangerLevel: 'signature'
  },
  {
    name: 'CHANGE_WIFI_STATE',
    displayName: 'Change WiFi State',
    description: 'Allows the app to connect to and disconnect from Wi-Fi access points.',
    category: 'Network',
    dangerLevel: 'normal'
  },
  {
    name: 'BLUETOOTH_ADMIN',
    displayName: 'Access Bluetooth Settings',
    description: 'Allows the app to configure the local Bluetooth device.',
    category: 'Network',
    dangerLevel: 'normal'
  },
  {
    name: 'ACCESS_NOTIFICATION_POLICY',
    displayName: 'Access Do Not Disturb',
    description: 'Allows the app to access and modify Do Not Disturb configuration.',
    category: 'Privacy',
    dangerLevel: 'normal'
  }
];

const MOCK_GRANTED_PERMISSIONS = ['MODIFY_AUDIO_SETTINGS', 'CHANGE_WIFI_STATE'];

const MOCK_DEVICE_CAPABILITIES = {
  android: {
    version: '13',
    apiLevel: 33,
    brand: 'Android',
    model: 'Demo Device'
  },
  supportedActions: [
    'set_volume',
    'set_brightness',
    'toggle_wifi',
    'toggle_bluetooth',
    'set_do_not_disturb',
    'send_notification'
  ],
  limitations: [
    'Demo mode - actual device actions are simulated',
    'Some permissions require user interaction'
  ]
};

class ApiClient {
  private baseUrl: string;
  private headers: Record<string, string>;

  constructor() {
    // Use real server URL
    this.baseUrl = `https://${projectId}.supabase.co/functions/v1/make-server-c7d9e72f`;
    this.headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${publicAnonKey}`,
    };
  }

  private isDemo(): boolean {
    const savedSettings = localStorage.getItem('automation-app-settings');
    if (savedSettings) {
      const settings = JSON.parse(savedSettings);
      return settings.executionMode === 'demo' || !settings.executionMode;
    }
    return true; // Default to demo if no settings
  }

  private getExecutionMode(): string {
    const savedSettings = localStorage.getItem('automation-app-settings');
    if (savedSettings) {
      const settings = JSON.parse(savedSettings);
      return settings.executionMode || 'demo';
    }
    return 'demo';
  }

  private async mockDelay(ms: number = 500): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async getPermissions() {
    if (this.isDemo()) {
      await this.mockDelay();
      return {
        permissions: MOCK_PERMISSIONS,
        granted: MOCK_GRANTED_PERMISSIONS
      };
    }

    const response = await fetch(`${this.baseUrl}/permissions`, {
      headers: this.headers,
    });
    
    if (!response.ok) {
      throw new Error(`Failed to load permissions: ${response.statusText}`);
    }
    
    return response.json();
  }

  async requestPermission(permission: string) {
    if (this.isDemo()) {
      await this.mockDelay(1000);
      // Simulate permission request - grant about 70% of the time
      const granted = Math.random() > 0.3;
      return {
        granted,
        message: granted 
          ? `Permission granted: ${permission}` 
          : `Permission denied by user: ${permission}`
      };
    }

    const response = await fetch(`${this.baseUrl}/permissions/request`, {
      method: 'POST',
      headers: this.headers,
      body: JSON.stringify({ permission }),
    });
    
    if (!response.ok) {
      throw new Error(`Failed to request permission: ${response.statusText}`);
    }
    
    return response.json();
  }

  async requestMultiplePermissions(permissions: string[]) {
    if (this.isDemo()) {
      await this.mockDelay(1500);
      const results: Record<string, boolean> = {};
      permissions.forEach(permission => {
        results[permission] = Math.random() > 0.3; // 70% grant rate
      });
      return { results };
    }

    const response = await fetch(`${this.baseUrl}/permissions/request-multiple`, {
      method: 'POST',
      headers: this.headers,
      body: JSON.stringify({ permissions }),
    });
    
    if (!response.ok) {
      throw new Error(`Failed to request permissions: ${response.statusText}`);
    }
    
    return response.json();
  }

  async checkMacroPermissions(macro: any) {
    if (this.isDemo()) {
      await this.mockDelay();
      const requiredPermissions = macro.permissions || [];
      const missing = MOCK_PERMISSIONS.filter(p => 
        requiredPermissions.includes(p.name) && 
        !MOCK_GRANTED_PERMISSIONS.includes(p.name)
      );
      
      return {
        allGranted: missing.length === 0,
        missing,
        granted: MOCK_GRANTED_PERMISSIONS.filter(p => requiredPermissions.includes(p))
      };
    }

    const response = await fetch(`${this.baseUrl}/permissions/check-macro`, {
      method: 'POST',
      headers: this.headers,
      body: JSON.stringify({ macro }),
    });
    
    if (!response.ok) {
      throw new Error(`Failed to check macro permissions: ${response.statusText}`);
    }
    
    return response.json();
  }

  async executeMacro(macro: any) {
    if (this.isDemo()) {
      await this.mockDelay();
      const executionId = `demo_exec_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      // Simulate starting execution
      setTimeout(() => {
        this.updateMockExecution(executionId, macro);
      }, 100);
      
      return {
        success: true,
        executionId,
        message: 'Demo macro execution started'
      };
    }

    // Real execution - pass execution mode to server
    const executionMode = this.getExecutionMode();
    const response = await fetch(`${this.baseUrl}/macro/execute`, {
      method: 'POST',
      headers: this.headers,
      body: JSON.stringify({ macro, executionMode }),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to execute macro');
    }
    
    return response.json();
  }

  private mockExecutions = new Map<string, any>();

  private updateMockExecution(executionId: string, macro: any) {
    const execution = {
      id: executionId,
      macroId: macro.id,
      status: 'running',
      currentStep: 0,
      totalSteps: macro.steps?.length || 1,
      progress: 0,
      log: [`Started demo execution at ${new Date().toISOString()}`],
      startTime: new Date().toISOString()
    };
    
    this.mockExecutions.set(executionId, execution);
    
    // Simulate step-by-step execution
    let currentStep = 0;
    const stepInterval = setInterval(() => {
      currentStep++;
      execution.currentStep = currentStep;
      execution.progress = Math.round((currentStep / execution.totalSteps) * 100);
      execution.log.push(`Demo: Executing step ${currentStep}/${execution.totalSteps}`);
      
      if (currentStep >= execution.totalSteps) {
        execution.status = 'completed';
        execution.endTime = new Date().toISOString();
        execution.log.push(`Demo execution completed at ${execution.endTime}`);
        clearInterval(stepInterval);
      }
      
      this.mockExecutions.set(executionId, { ...execution });
    }, 2000);
  }

  async getExecutionStatus(executionId: string) {
    // Check if this is a demo execution by ID prefix (not by current settings)
    if (executionId.startsWith('demo_exec_')) {
      await this.mockDelay(100);
      const execution = this.mockExecutions.get(executionId);
      if (!execution) {
        console.warn(`⚠️ Demo execution not found: ${executionId}`);
        throw new Error(`Demo execution not found: ${executionId}`);
      }
      return execution;
    }

    // Local executions should not be polled
    if (executionId.startsWith('local_exec_')) {
      throw new Error(`Cannot poll local execution: ${executionId}. Local executions are handled synchronously.`);
    }

    // Server execution
    const response = await fetch(`${this.baseUrl}/macro/execution/${executionId}`, {
      headers: this.headers,
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`❌ Failed to get execution status for ${executionId}:`, response.statusText, errorText);
      throw new Error(`Failed to get execution status: ${response.statusText}`);
    }
    
    return response.json();
  }

  async cancelExecution(executionId: string) {
    // Check if this is a demo execution by ID prefix (not by current settings)
    if (executionId.startsWith('demo_exec_')) {
      await this.mockDelay();
      const execution = this.mockExecutions.get(executionId);
      if (execution) {
        execution.status = 'cancelled';
        execution.endTime = new Date().toISOString();
        execution.log.push(`Demo execution cancelled at ${execution.endTime}`);
        this.mockExecutions.set(executionId, execution);
      }
      return { success: true, message: 'Demo execution cancelled' };
    }

    // Server execution
    const response = await fetch(`${this.baseUrl}/macro/execution/${executionId}/cancel`, {
      method: 'POST',
      headers: this.headers,
    });
    
    if (!response.ok) {
      throw new Error(`Failed to cancel execution: ${response.statusText}`);
    }
    
    return response.json();
  }

  async getDeviceCapabilities() {
    if (this.isDemo()) {
      await this.mockDelay();
      return MOCK_DEVICE_CAPABILITIES;
    }

    const response = await fetch(`${this.baseUrl}/device/capabilities`, {
      headers: this.headers,
    });
    
    if (!response.ok) {
      throw new Error(`Failed to get device capabilities: ${response.statusText}`);
    }
    
    return response.json();
  }

  async executeAction(action: any) {
    if (this.isDemo()) {
      await this.mockDelay(Math.random() * 1000 + 500);
      // Simulate action execution
      const success = Math.random() > 0.1; // 90% success rate
      return {
        success,
        message: success 
          ? `Demo: Successfully executed ${action.type}` 
          : `Demo: Failed to execute ${action.type}`,
        data: success ? { result: 'demo_success' } : undefined
      };
    }

    const response = await fetch(`${this.baseUrl}/action/execute`, {
      method: 'POST',
      headers: this.headers,
      body: JSON.stringify({ action }),
    });
    
    if (!response.ok) {
      throw new Error(`Failed to execute action: ${response.statusText}`);
    }
    
    return response.json();
  }
}

// Export singleton instance
export const apiClient = new ApiClient();