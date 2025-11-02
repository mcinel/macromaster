/**
 * Real Macro Executor
 * 
 * Executes macros using real APIs based on execution mode.
 * This runs CLIENT-SIDE to access browser/Android APIs.
 */

import { androidBridge, isAndroidWebView } from './android-bridge';
import { webExecutor } from './web-executor';
import { toast } from 'sonner@2.0.3';

export type ExecutionMode = 'demo' | 'web' | 'hybrid' | 'android';

interface MacroStep {
  id: string;
  type: string;
  title: string;
  description: string;
  parameters?: Record<string, any>;
}

interface ExecutionResult {
  success: boolean;
  message: string;
  data?: any;
}

/**
 * Real executor that runs actions locally using available APIs
 */
class RealExecutor {
  private mode: ExecutionMode = 'demo';

  setMode(mode: ExecutionMode) {
    this.mode = mode;
    console.log(`RealExecutor mode set to: ${mode}`);
  }

  getMode(): ExecutionMode {
    return this.mode;
  }

  /**
   * Execute a single macro step
   */
  async executeStep(step: MacroStep): Promise<ExecutionResult> {
    const mode = this.mode;
    
    // Skip triggers and conditions - they define when/if to run, not what to do
    if (step.type === 'trigger' || step.type === 'condition') {
      console.log(`⏭️ RealExecutor: Skipping ${step.type} "${step.title}"`);
      return {
        success: true,
        message: `${step.type === 'trigger' ? 'Trigger' : 'Condition'} evaluated (not executed)`,
        data: { skipped: true, reason: `${step.type}s are not executed, they define when/if the macro runs` }
      };
    }
    
    const actionType = this.normalizeActionType(step.type, step.title);
    const params = step.parameters || {};

    console.log(`🚀 RealExecutor: Executing "${step.title}" in ${mode.toUpperCase()} mode`, { 
      actionType, 
      params,
      androidAvailable: androidBridge.isAvailable()
    });

    // Demo mode - just simulate
    if (mode === 'demo') {
      console.log('📝 Demo mode: Simulating execution');
      return this.simulateExecution(step);
    }

    // Hybrid mode - try Android bridge first, then web APIs, with intelligent fallbacks
    if (mode === 'hybrid') {
      if (androidBridge.isAvailable()) {
        console.log('⚡ Hybrid mode: Using Android bridge');
        const result = await this.executeWithAndroidBridge(actionType, params, step);
        
        // If Android bridge fails, try web API fallback
        if (!result.success && this.hasWebFallback(actionType)) {
          console.log('⚡ Hybrid mode: Android failed, trying Web API fallback');
          return await this.executeWithWebAPIs(actionType, params, step);
        }
        
        // If still failed, try simulation fallback for unsupported actions
        if (!result.success && this.isUnsupportedAction(actionType, step.title)) {
          console.log('⚡ Hybrid mode: Using simulation fallback for unsupported action');
          return {
            success: true,
            message: `${step.title} (simulated - not available in current environment)`,
            data: { fallback: 'simulation', reason: result.message }
          };
        }
        
        return result;
      } else {
        console.log('⚡ Hybrid mode: Android not available, falling back to Web APIs');
        const result = await this.executeWithWebAPIs(actionType, params, step);
        
        // If web API fails, try simulation fallback
        if (!result.success && this.isUnsupportedAction(actionType, step.title)) {
          console.log('⚡ Hybrid mode: Using simulation fallback');
          return {
            success: true,
            message: `${step.title} (simulated - not available in browser)`,
            data: { fallback: 'simulation', reason: result.message }
          };
        }
        
        return result;
      }
    }

    // Android mode - only use Android bridge
    if (mode === 'android') {
      if (!androidBridge.isAvailable()) {
        console.log('❌ Android mode: Bridge not available');
        return {
          success: false,
          message: 'Android bridge not available. Please run in Android WebView or switch to Hybrid/Web mode.'
        };
      }
      console.log('📱 Android mode: Using Android bridge');
      return await this.executeWithAndroidBridge(actionType, params, step);
    }

    // Web mode - only use web APIs
    if (mode === 'web') {
      console.log('🌐 Web mode: Using Web APIs');
      return await this.executeWithWebAPIs(actionType, params, step);
    }

    return { success: false, message: 'Unknown execution mode' };
  }

  /**
   * Normalize action type from step data
   */
  private normalizeActionType(type: string, title: string): string {
    // Try to extract action type from title if type is generic
    const lowerTitle = title.toLowerCase();
    
    if (lowerTitle.includes('volume')) return 'set_volume';
    if (lowerTitle.includes('brightness')) return 'set_brightness';
    if (lowerTitle.includes('wifi')) return 'toggle_wifi';
    if (lowerTitle.includes('bluetooth')) return 'toggle_bluetooth';
    if (lowerTitle.includes('notification') && !lowerTitle.includes('disturb')) return 'send_notification';
    if (lowerTitle.includes('do not disturb') || lowerTitle.includes('dnd')) return 'set_do_not_disturb';
    if (lowerTitle.includes('flashlight') || lowerTitle.includes('torch')) return 'toggle_flashlight';
    if (lowerTitle.includes('launch') || lowerTitle.includes('open')) return 'launch_app';
    if (lowerTitle.includes('sms') || lowerTitle.includes('text message')) return 'send_sms';
    if (lowerTitle.includes('call')) return 'make_call';
    if (lowerTitle.includes('vibrat')) return 'vibrate';
    if (lowerTitle.includes('ringer') || lowerTitle.includes('silent')) return 'set_ringer_mode';
    
    return type;
  }

  /**
   * Execute using Android bridge
   */
  private async executeWithAndroidBridge(actionType: string, params: any, step: MacroStep): Promise<ExecutionResult> {
    try {
      switch (actionType) {
        case 'set_volume': {
          const stream = params.stream || params.streamType || 'media';
          const level = params.level || params.value || 50;
          const result = await androidBridge.setVolume(stream, level);
          return result;
        }

        case 'set_brightness': {
          const level = params.level || params.value || 50;
          const result = await androidBridge.setBrightness(level);
          return result;
        }

        case 'toggle_wifi': {
          const enabled = params.enabled !== undefined ? params.enabled : params.state === 'on';
          const result = await androidBridge.toggleWifi(enabled);
          return result;
        }

        case 'toggle_bluetooth': {
          const enabled = params.enabled !== undefined ? params.enabled : params.state === 'on';
          const result = await androidBridge.toggleBluetooth(enabled);
          return result;
        }

        case 'toggle_flashlight': {
          const enabled = params.enabled !== undefined ? params.enabled : params.state === 'on';
          const result = await androidBridge.toggleFlashlight(enabled);
          return result;
        }

        case 'send_notification': {
          const title = params.title || step.title;
          const message = params.message || params.text || step.description;
          const priority = params.priority || 'default';
          const result = await androidBridge.sendNotification(title, message, priority);
          return result;
        }

        case 'set_do_not_disturb': {
          const mode = params.mode || (params.enabled ? 'silent' : 'off');
          const result = await androidBridge.setDoNotDisturb(mode);
          return result;
        }

        case 'set_ringer_mode': {
          const mode = params.mode || 'normal';
          const result = await androidBridge.setRingerMode(mode);
          return result;
        }

        case 'launch_app': {
          const packageName = params.packageName || params.package || '';
          const data = params.data;
          const result = await androidBridge.launchApp(packageName, data);
          return result;
        }

        case 'send_sms': {
          const phoneNumber = params.phoneNumber || params.phone || params.number || '';
          const message = params.message || params.text || '';
          const result = await androidBridge.sendSMS(phoneNumber, message);
          return result;
        }

        case 'make_call': {
          const phoneNumber = params.phoneNumber || params.phone || params.number || '';
          const result = await androidBridge.makeCall(phoneNumber);
          return result;
        }

        case 'control_media': {
          const action = params.action || 'play';
          const result = await androidBridge.controlMedia(action);
          return result;
        }

        default:
          return {
            success: false,
            message: `Action type '${actionType}' not supported in Android mode`
          };
      }
    } catch (error) {
      console.error('Android bridge execution error:', error);
      return {
        success: false,
        message: `Android bridge error: ${error instanceof Error ? error.message : String(error)}`
      };
    }
  }

  /**
   * Execute using Web APIs
   */
  private async executeWithWebAPIs(actionType: string, params: any, step: MacroStep): Promise<ExecutionResult> {
    try {
      switch (actionType) {
        case 'send_notification': {
          const title = params.title || step.title;
          const message = params.message || params.text || step.description;
          const result = await webExecutor.sendNotification(title, {
            body: message,
            icon: '/icon.png',
            badge: '/badge.png'
          });
          return result;
        }

        case 'vibrate': {
          const pattern = params.pattern || params.duration || 200;
          const result = await webExecutor.vibrate(pattern);
          return result;
        }

        case 'toggle_wifi':
        case 'toggle_bluetooth':
        case 'set_volume':
        case 'set_brightness': {
          return {
            success: false,
            message: `${actionType} is not available in Web mode. Please use Android mode for full device control.`
          };
        }

        case 'launch_app': {
          // Try to open URL if provided
          const url = params.url || params.packageName;
          if (url) {
            const result = await webExecutor.openUrl(url);
            return result;
          }
          return {
            success: false,
            message: 'App launching requires Android mode'
          };
        }

        default:
          // Try generic vibration as fallback
          if (webExecutor.isSupported('vibration')) {
            await webExecutor.vibrate(200);
            return {
              success: true,
              message: `Simulated ${step.title} with vibration (limited Web API support)`
            };
          }
          
          return {
            success: false,
            message: `Action '${actionType}' not available in Web mode. ${this.getWebModeSuggestion(actionType)}`
          };
      }
    } catch (error) {
      console.error('Web API execution error:', error);
      return {
        success: false,
        message: `Web API error: ${error instanceof Error ? error.message : String(error)}`
      };
    }
  }

  /**
   * Simulate execution for demo mode
   */
  private async simulateExecution(step: MacroStep): Promise<ExecutionResult> {
    // Add realistic delay
    await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 1000));
    
    // 95% success rate for demo
    const success = Math.random() > 0.05;
    
    return {
      success,
      message: success 
        ? `Demo: Successfully executed ${step.title}` 
        : `Demo: Failed to execute ${step.title}`,
      data: { mode: 'demo', timestamp: new Date().toISOString() }
    };
  }

  /**
   * Get suggestion message for web mode limitations
   */
  private getWebModeSuggestion(actionType: string): string {
    const suggestions: Record<string, string> = {
      'set_volume': 'System volume control requires Android mode.',
      'set_brightness': 'Screen brightness control requires Android mode.',
      'toggle_wifi': 'WiFi control requires Android mode.',
      'toggle_bluetooth': 'Bluetooth control requires Android mode.',
      'send_sms': 'SMS sending requires Android mode.',
      'make_call': 'Phone calls require Android mode.',
    };

    return suggestions[actionType] || 'Try using Hybrid or Android mode for full functionality.';
  }

  /**
   * Check if an action type has a web API fallback
   */
  private hasWebFallback(actionType: string): boolean {
    const webSupportedActions = [
      'send_notification',
      'vibrate',
      'launch_app', // Can open URLs
    ];
    return webSupportedActions.includes(actionType);
  }

  /**
   * Check if an action is known to be unsupported (time triggers, audio controls, etc.)
   */
  private isUnsupportedAction(actionType: string, stepTitle: string): boolean {
    const lowerTitle = stepTitle.toLowerCase();
    
    // Time-based triggers (always unsupported in real execution)
    const timeTriggers = ['time trigger', 'bedtime trigger', 'schedule trigger', 
                          'timer trigger', 'alarm trigger'];
    if (timeTriggers.some(trigger => lowerTitle.includes(trigger))) {
      return true;
    }
    
    // Audio control actions (unsupported in Android mode without native access)
    const audioActions = ['set audio mode', 'silent mode', 'change volume', 
                          'set volume', 'media volume', 'ring volume', 'notification volume'];
    if (audioActions.some(action => lowerTitle.includes(action))) {
      return true;
    }
    
    // Action types that typically require system-level access
    const unsupportedTypes = ['set_ringer_mode', 'set_do_not_disturb'];
    return unsupportedTypes.includes(actionType);
  }

  /**
   * Check if an action is supported in current mode
   */
  isActionSupported(actionType: string): boolean {
    if (this.mode === 'demo') return true;
    
    if (this.mode === 'android') {
      return androidBridge.isAvailable();
    }

    if (this.mode === 'web') {
      const webSupportedActions = ['send_notification', 'vibrate'];
      return webSupportedActions.includes(actionType) || webExecutor.isSupported('notifications');
    }

    // Hybrid mode supports everything (will try Android then Web)
    return true;
  }

  /**
   * Get execution mode from localStorage
   */
  getExecutionModeFromSettings(): ExecutionMode {
    try {
      const savedSettings = localStorage.getItem('automation-app-settings');
      if (savedSettings) {
        const settings = JSON.parse(savedSettings);
        return settings.executionMode || 'demo';
      }
    } catch (error) {
      console.error('Error reading execution mode from settings:', error);
    }
    return 'demo';
  }
}

// Export singleton instance
export const realExecutor = new RealExecutor();
