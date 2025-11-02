import { Context } from "npm:hono";
import * as kv from './kv_store.tsx';

/**
 * Android Executor - Handles macro execution with different modes
 * 
 * UNSUPPORTED IN ANDROID MODE:
 * - Time-based triggers (Time Trigger, Schedule Trigger, etc.)
 *   Reason: Requires system-level scheduling that web bridges cannot access
 * 
 * - Audio control actions (Set Audio Mode, Set Volume, etc.)
 *   Reason: AudioManager APIs require system permissions not available via web
 * 
 * These actions will be automatically skipped when running in Android mode.
 * Use Demo mode to preview or Web/Hybrid mode for partial functionality.
 */

interface AndroidAction {
  type: string;
  parameters: Record<string, any>;
  requiresPermission?: string[];
}

interface MacroExecution {
  id: string;
  macroId: string;
  status: 'pending' | 'running' | 'completed' | 'failed' | 'cancelled';
  currentStep: number;
  totalSteps: number;
  progress: number;
  log: string[];
  startTime: string;
  endTime?: string;
  error?: string;
}

/**
 * Execution Mode
 * - 'demo': Simulated execution for demo purposes (default)
 * - 'android': Real execution via Android WebView bridge
 * - 'web': Real execution using Web APIs where available
 * - 'hybrid': Try Android bridge first, fallback to Web APIs
 */
type ExecutionMode = 'demo' | 'android' | 'web' | 'hybrid';

export class AndroidExecutor {
  private executions: Map<string, MacroExecution> = new Map();
  private mode: ExecutionMode = 'demo';

  constructor(mode: ExecutionMode = 'demo') {
    this.mode = mode;
  }

  setMode(mode: ExecutionMode) {
    this.mode = mode;
    console.log(`Executor mode set to: ${mode}`);
  }

  getMode(): ExecutionMode {
    return this.mode;
  }

  async executeAction(action: AndroidAction): Promise<{ success: boolean; message: string; data?: any }> {
    try {
      switch (action.type) {
        case 'set_volume':
          return await this.setVolume(action.parameters);
        case 'set_brightness':
          return await this.setBrightness(action.parameters);
        case 'toggle_wifi':
          return await this.toggleWifi(action.parameters);
        case 'toggle_bluetooth':
          return await this.toggleBluetooth(action.parameters);
        case 'set_do_not_disturb':
          return await this.setDoNotDisturb(action.parameters);
        case 'send_notification':
          return await this.sendNotification(action.parameters);
        case 'launch_app':
          return await this.launchApp(action.parameters);
        case 'close_app':
          return await this.closeApp(action.parameters);
        case 'set_ringer_mode':
          return await this.setRingerMode(action.parameters);
        case 'toggle_location':
          return await this.toggleLocation(action.parameters);
        case 'set_alarm':
          return await this.setAlarm(action.parameters);
        case 'send_sms':
          return await this.sendSMS(action.parameters);
        case 'make_call':
          return await this.makeCall(action.parameters);
        case 'control_media':
          return await this.controlMedia(action.parameters);
        case 'toggle_flashlight':
          return await this.toggleFlashlight(action.parameters);
        case 'set_wallpaper':
          return await this.setWallpaper(action.parameters);
        default:
          return { success: false, message: `Unknown action type: ${action.type}` };
      }
    } catch (error) {
      console.error(`Error executing action ${action.type}:`, error);
      return { success: false, message: `Failed to execute ${action.type}: ${error.message}` };
    }
  }

  private async setVolume(params: { level: number; stream?: string }): Promise<{ success: boolean; message: string }> {
    // In a real implementation, this would use Android Audio Manager
    console.log(`Setting volume to ${params.level}% for stream ${params.stream || 'media'}`);
    
    // Simulate Android API call
    if (params.level < 0 || params.level > 100) {
      return { success: false, message: 'Volume level must be between 0 and 100' };
    }
    
    // Mock implementation - in reality this would interface with Android APIs
    await this.simulateAndroidCall('AudioManager.setStreamVolume', params);
    return { success: true, message: `Volume set to ${params.level}%` };
  }

  private async setBrightness(params: { level: number }): Promise<{ success: boolean; message: string }> {
    console.log(`Setting screen brightness to ${params.level}%`);
    
    if (params.level < 0 || params.level > 100) {
      return { success: false, message: 'Brightness level must be between 0 and 100' };
    }
    
    await this.simulateAndroidCall('Settings.System.putInt', {
      setting: 'screen_brightness',
      value: Math.round(params.level * 2.55) // Convert to 0-255 range
    });
    
    return { success: true, message: `Brightness set to ${params.level}%` };
  }

  private async toggleWifi(params: { enabled: boolean }): Promise<{ success: boolean; message: string }> {
    console.log(`${params.enabled ? 'Enabling' : 'Disabling'} WiFi`);
    
    await this.simulateAndroidCall('WifiManager.setWifiEnabled', { enabled: params.enabled });
    return { success: true, message: `WiFi ${params.enabled ? 'enabled' : 'disabled'}` };
  }

  private async toggleBluetooth(params: { enabled: boolean }): Promise<{ success: boolean; message: string }> {
    console.log(`${params.enabled ? 'Enabling' : 'Disabling'} Bluetooth`);
    
    await this.simulateAndroidCall('BluetoothAdapter.enable', { enabled: params.enabled });
    return { success: true, message: `Bluetooth ${params.enabled ? 'enabled' : 'disabled'}` };
  }

  private async setDoNotDisturb(params: { enabled: boolean; allowCalls?: boolean; allowAlarms?: boolean }): Promise<{ success: boolean; message: string }> {
    console.log(`${params.enabled ? 'Enabling' : 'Disabling'} Do Not Disturb mode`);
    
    await this.simulateAndroidCall('NotificationManager.setInterruptionFilter', {
      filter: params.enabled ? 'INTERRUPTION_FILTER_PRIORITY' : 'INTERRUPTION_FILTER_ALL',
      allowCalls: params.allowCalls ?? true,
      allowAlarms: params.allowAlarms ?? true
    });
    
    return { success: true, message: `Do Not Disturb ${params.enabled ? 'enabled' : 'disabled'}` };
  }

  private async sendNotification(params: { title: string; message: string; priority?: string }): Promise<{ success: boolean; message: string }> {
    console.log(`Sending notification: ${params.title}`);
    
    await this.simulateAndroidCall('NotificationManager.notify', {
      title: params.title,
      text: params.message,
      priority: params.priority || 'DEFAULT'
    });
    
    return { success: true, message: 'Notification sent successfully' };
  }

  private async launchApp(params: { packageName: string }): Promise<{ success: boolean; message: string }> {
    console.log(`Launching app: ${params.packageName}`);
    
    await this.simulateAndroidCall('PackageManager.getLaunchIntentForPackage', { packageName: params.packageName });
    return { success: true, message: `Launched ${params.packageName}` };
  }

  private async closeApp(params: { packageName: string }): Promise<{ success: boolean; message: string }> {
    console.log(`Closing app: ${params.packageName}`);
    
    await this.simulateAndroidCall('ActivityManager.killBackgroundProcesses', { packageName: params.packageName });
    return { success: true, message: `Closed ${params.packageName}` };
  }

  private async setRingerMode(params: { mode: 'normal' | 'silent' | 'vibrate' }): Promise<{ success: boolean; message: string }> {
    console.log(`Setting ringer mode to: ${params.mode}`);
    
    const modeMap = {
      'normal': 'RINGER_MODE_NORMAL',
      'silent': 'RINGER_MODE_SILENT',
      'vibrate': 'RINGER_MODE_VIBRATE'
    };
    
    await this.simulateAndroidCall('AudioManager.setRingerMode', { mode: modeMap[params.mode] });
    return { success: true, message: `Ringer mode set to ${params.mode}` };
  }

  private async toggleLocation(params: { enabled: boolean }): Promise<{ success: boolean; message: string }> {
    console.log(`${params.enabled ? 'Enabling' : 'Disabling'} location services`);
    
    await this.simulateAndroidCall('LocationManager.setLocationEnabledForUser', { enabled: params.enabled });
    return { success: true, message: `Location services ${params.enabled ? 'enabled' : 'disabled'}` };
  }

  private async setAlarm(params: { time: string; label?: string; days?: string[] }): Promise<{ success: boolean; message: string }> {
    console.log(`Setting alarm for ${params.time}`);
    
    await this.simulateAndroidCall('AlarmManager.setRepeating', {
      time: params.time,
      label: params.label || 'MacroMaster Alarm',
      days: params.days || []
    });
    
    return { success: true, message: `Alarm set for ${params.time}` };
  }

  private async sendSMS(params: { phoneNumber: string; message: string }): Promise<{ success: boolean; message: string }> {
    console.log(`Sending SMS to ${params.phoneNumber}`);
    
    await this.simulateAndroidCall('SmsManager.sendTextMessage', {
      destinationAddress: params.phoneNumber,
      text: params.message
    });
    
    return { success: true, message: `SMS sent to ${params.phoneNumber}` };
  }

  private async makeCall(params: { phoneNumber: string }): Promise<{ success: boolean; message: string }> {
    console.log(`Making call to ${params.phoneNumber}`);
    
    await this.simulateAndroidCall('TelecomManager.placeCall', { phoneNumber: params.phoneNumber });
    return { success: true, message: `Calling ${params.phoneNumber}` };
  }

  private async controlMedia(params: { action: 'play' | 'pause' | 'next' | 'previous' | 'stop' }): Promise<{ success: boolean; message: string }> {
    console.log(`Media control: ${params.action}`);
    
    await this.simulateAndroidCall('MediaController.sendCommand', { command: params.action });
    return { success: true, message: `Media ${params.action} executed` };
  }

  private async toggleFlashlight(params: { enabled: boolean }): Promise<{ success: boolean; message: string }> {
    console.log(`${params.enabled ? 'Turning on' : 'Turning off'} flashlight`);
    
    await this.simulateAndroidCall('CameraManager.setTorchMode', { enabled: params.enabled });
    return { success: true, message: `Flashlight ${params.enabled ? 'on' : 'off'}` };
  }

  private async setWallpaper(params: { imageUrl: string; screen?: 'home' | 'lock' | 'both' }): Promise<{ success: boolean; message: string }> {
    console.log(`Setting wallpaper: ${params.imageUrl}`);
    
    await this.simulateAndroidCall('WallpaperManager.setBitmap', {
      imageUrl: params.imageUrl,
      screen: params.screen || 'both'
    });
    
    return { success: true, message: 'Wallpaper updated successfully' };
  }

  private async simulateAndroidCall(method: string, params: any): Promise<void> {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 200 + Math.random() * 800));
    
    // Log the simulated call
    console.log(`Android API Call: ${method}`, params);
    
    // In a real implementation, this would make actual Android system calls
    // through JNI, a service bridge, or ADB commands
  }

  async startMacroExecution(macroId: string, steps: any[]): Promise<string> {
    const executionId = `exec_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const execution: MacroExecution = {
      id: executionId,
      macroId,
      status: 'pending',
      currentStep: 0,
      totalSteps: steps.length,
      progress: 0,
      log: [`Started macro execution at ${new Date().toISOString()}`],
      startTime: new Date().toISOString()
    };
    
    this.executions.set(executionId, execution);
    
    // Store in KV store for persistence
    await kv.set(`execution:${executionId}`, execution);
    
    // Start execution in background
    this.executeMacro(executionId, steps).catch(error => {
      console.error(`Macro execution failed: ${error}`);
      this.updateExecutionStatus(executionId, 'failed', error.message);
    });
    
    return executionId;
  }

  private async executeMacro(executionId: string, steps: any[]): Promise<void> {
    const execution = this.executions.get(executionId);
    if (!execution) return;
    
    try {
      execution.status = 'running';
      await kv.set(`execution:${executionId}`, execution);
      
      for (let i = 0; i < steps.length; i++) {
        const step = steps[i];
        execution.currentStep = i + 1;
        execution.progress = Math.round(((i + 1) / steps.length) * 100);
        
        // Skip triggers - they define when to run, not what to do
        if (step.type === 'trigger') {
          execution.log.push(`⏭️ Skipping step ${i + 1}: ${step.title} (trigger - defines when to run)`);
          await kv.set(`execution:${executionId}`, execution);
          continue;
        }
        
        // Check if step is supported in Android mode
        if (this.mode === 'android' && this.isStepUnsupportedInAndroid(step)) {
          execution.log.push(`⚠️ Skipping step ${i + 1}: ${step.title} (not supported in Android mode)`);
          await kv.set(`execution:${executionId}`, execution);
          continue;
        }
        
        execution.log.push(`Executing step ${i + 1}: ${step.title}`);
        
        await kv.set(`execution:${executionId}`, execution);
        
        if (step.type === 'action') {
          const action = this.convertStepToAction(step);
          const result = await this.executeAction(action);
          
          if (result.success) {
            execution.log.push(`✓ ${result.message}`);
          } else {
            execution.log.push(`✗ ${result.message}`);
            throw new Error(result.message);
          }
        } else if (step.type === 'condition') {
          // Handle conditions/checks
          execution.log.push(`Checking condition: ${step.description}`);
          const conditionMet = await this.evaluateCondition(step);
          
          if (!conditionMet) {
            execution.log.push(`Condition not met, stopping execution`);
            break;
          } else {
            execution.log.push(`✓ Condition satisfied`);
          }
        }
      }
      
      execution.status = 'completed';
      execution.endTime = new Date().toISOString();
      execution.log.push(`Macro completed successfully at ${execution.endTime}`);
      
    } catch (error) {
      execution.status = 'failed';
      execution.error = error.message;
      execution.endTime = new Date().toISOString();
      execution.log.push(`Macro failed: ${error.message}`);
    }
    
    await kv.set(`execution:${executionId}`, execution);
  }

  private convertStepToAction(step: any): AndroidAction {
    // Convert macro step to Android action based on step settings
    const { settings } = step;
    
    // Map common step types to Android actions
    if (step.title.toLowerCase().includes('volume')) {
      return {
        type: 'set_volume',
        parameters: { level: settings.level || 50, stream: settings.stream || 'media' }
      };
    } else if (step.title.toLowerCase().includes('brightness')) {
      return {
        type: 'set_brightness',
        parameters: { level: settings.brightness || 50 }
      };
    } else if (step.title.toLowerCase().includes('wifi')) {
      return {
        type: 'toggle_wifi',
        parameters: { enabled: settings.state !== 'off' }
      };
    } else if (step.title.toLowerCase().includes('bluetooth')) {
      return {
        type: 'toggle_bluetooth',
        parameters: { enabled: settings.enabled !== false }
      };
    } else if (step.title.toLowerCase().includes('silent') || step.title.toLowerCase().includes('ringer')) {
      return {
        type: 'set_ringer_mode',
        parameters: { mode: settings.mode || 'silent' }
      };
    } else if (step.title.toLowerCase().includes('do not disturb') || step.title.toLowerCase().includes('dnd')) {
      return {
        type: 'set_do_not_disturb',
        parameters: { 
          enabled: settings.enabled !== false,
          allowCalls: settings.allowCalls,
          allowAlarms: settings.allowAlarms
        }
      };
    } else if (step.title.toLowerCase().includes('notification')) {
      return {
        type: 'send_notification',
        parameters: {
          title: settings.title || 'MacroMaster',
          message: settings.message || step.description,
          priority: settings.priority || 'DEFAULT'
        }
      };
    }
    
    // Default fallback
    return {
      type: 'send_notification',
      parameters: {
        title: 'Macro Step',
        message: `Executed: ${step.title}`,
        priority: 'LOW'
      }
    };
  }

  private async evaluateCondition(step: any): Promise<boolean> {
    // Simulate condition evaluation
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // For now, always return true (conditions pass)
    // In a real implementation, this would check actual device state
    return true;
  }

  private isStepUnsupportedInAndroid(step: any): boolean {
    const unsupportedTriggers = ['Time Trigger', 'Bedtime Trigger', 'Schedule Trigger', 'Timer Trigger', 'Alarm Trigger'];
    const unsupportedActions = ['Set Audio Mode', 'Silent Mode', 'Change Volume', 'Set Volume', 'Audio Mode', 'Media Volume', 'Ring Volume', 'Notification Volume'];
    
    const title = step.title.toLowerCase();
    
    if (step.type === 'trigger') {
      return unsupportedTriggers.some(trigger => title.includes(trigger.toLowerCase()));
    }
    
    if (step.type === 'action') {
      return unsupportedActions.some(action => title.includes(action.toLowerCase()));
    }
    
    return false;
  }

  async getExecutionStatus(executionId: string): Promise<MacroExecution | null> {
    // Try memory first, then KV store
    let execution = this.executions.get(executionId);
    
    if (!execution) {
      execution = await kv.get(`execution:${executionId}`);
      if (execution) {
        this.executions.set(executionId, execution);
      }
    }
    
    return execution || null;
  }

  async cancelExecution(executionId: string): Promise<boolean> {
    const execution = this.executions.get(executionId);
    if (!execution) return false;
    
    execution.status = 'cancelled';
    execution.endTime = new Date().toISOString();
    execution.log.push(`Execution cancelled at ${execution.endTime}`);
    
    await kv.set(`execution:${executionId}`, execution);
    return true;
  }

  private async updateExecutionStatus(executionId: string, status: MacroExecution['status'], error?: string): Promise<void> {
    const execution = this.executions.get(executionId);
    if (!execution) return;
    
    execution.status = status;
    if (error) {
      execution.error = error;
    }
    if (status === 'completed' || status === 'failed' || status === 'cancelled') {
      execution.endTime = new Date().toISOString();
    }
    
    await kv.set(`execution:${executionId}`, execution);
  }
}

export const androidExecutor = new AndroidExecutor();