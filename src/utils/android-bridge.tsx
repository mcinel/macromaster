/**
 * Android Bridge Interface
 * 
 * This module provides a bridge between the web app and native Android code.
 * When the app is wrapped in an Android WebView, it can call native Android functions.
 * 
 * SETUP INSTRUCTIONS FOR ANDROID APP:
 * 
 * 1. In your Android Activity, add a JavaScript interface:
 * 
 *    webView.addJavascriptInterface(new AndroidBridge(this), "AndroidBridge");
 * 
 * 2. Implement the AndroidBridge class in Kotlin/Java:
 * 
 *    class AndroidBridge(private val context: Context) {
 *        @JavascriptInterface
 *        fun setVolume(streamType: String, level: Int): String { ... }
 *        
 *        @JavascriptInterface
 *        fun setBrightness(level: Int): String { ... }
 *        
 *        // ... implement all methods below
 *    }
 * 
 * 3. Enable JavaScript in your WebView:
 * 
 *    webView.settings.javaScriptEnabled = true
 */

// Check if running in Android WebView with bridge
export const isAndroidWebView = (): boolean => {
  return typeof (window as any).AndroidBridge !== 'undefined';
};

// Check if running in a browser with web API support
export const isBrowserEnvironment = (): boolean => {
  return typeof window !== 'undefined' && !isAndroidWebView();
};

// Android Bridge interface matching native implementation
interface AndroidBridgeInterface {
  // Audio & Media
  setVolume(streamType: string, level: number): string;
  getVolume(streamType: string): number;
  setRingerMode(mode: string): string;
  controlMedia(action: string): string;
  
  // Display
  setBrightness(level: number): string;
  getBrightness(): number;
  setWallpaper(imageUrl: string): string;
  
  // Network & Connectivity
  toggleWifi(enabled: boolean): string;
  toggleBluetooth(enabled: boolean): string;
  toggleLocation(enabled: boolean): string;
  toggleFlashlight(enabled: boolean): string;
  getWifiState(): boolean;
  getBluetoothState(): boolean;
  
  // Notifications & DND
  setDoNotDisturb(mode: string): string;
  sendNotification(title: string, message: string, priority: string): string;
  
  // Apps
  launchApp(packageName: string, data?: string): string;
  closeApp(packageName: string): string;
  getInstalledApps(): string; // Returns JSON array
  
  // Communication
  sendSMS(phoneNumber: string, message: string): string;
  makeCall(phoneNumber: string): string;
  
  // Scheduling
  setAlarm(hour: number, minute: number, label: string, days?: string): string;
  createCalendarEvent(title: string, startTime: string, endTime: string, description?: string): string;
  
  // System
  getDeviceInfo(): string; // Returns JSON object
  getBatteryLevel(): number;
  isCharging(): boolean;
  getCurrentLocation(): string; // Returns JSON object {lat, lng}
  
  // Permissions
  checkPermission(permission: string): boolean;
  requestPermission(permission: string): string;
  requestMultiplePermissions(permissions: string): string; // JSON array input
}

// Get the Android bridge if available
const getAndroidBridge = (): AndroidBridgeInterface | null => {
  if (isAndroidWebView()) {
    return (window as any).AndroidBridge as AndroidBridgeInterface;
  }
  return null;
};

/**
 * Bridge Wrapper Functions
 * These provide a safe interface to call Android native functions
 */

export const androidBridge = {
  // Check if bridge is available
  isAvailable: isAndroidWebView,
  
  // Audio & Media
  setVolume: async (streamType: 'media' | 'alarm' | 'ring' | 'notification', level: number): Promise<{ success: boolean; message?: string; error?: string }> => {
    const bridge = getAndroidBridge();
    console.log('🔊 androidBridge.setVolume called:', { streamType, level, bridgeAvailable: !!bridge });
    if (!bridge) return { success: false, error: 'Android bridge not available' };
    
    try {
      const result = bridge.setVolume(streamType, level);
      const parsedResult = JSON.parse(result);
      console.log('🔊 androidBridge.setVolume result:', parsedResult);
      return parsedResult;
    } catch (error) {
      console.error('🔊 androidBridge.setVolume error:', error);
      return { success: false, error: String(error) };
    }
  },
  
  getVolume: async (streamType: 'media' | 'alarm' | 'ring' | 'notification'): Promise<number> => {
    const bridge = getAndroidBridge();
    if (!bridge) return 0;
    return bridge.getVolume(streamType);
  },
  
  setRingerMode: async (mode: 'silent' | 'vibrate' | 'normal'): Promise<{ success: boolean; error?: string }> => {
    const bridge = getAndroidBridge();
    if (!bridge) return { success: false, error: 'Android bridge not available' };
    
    try {
      const result = bridge.setRingerMode(mode);
      return JSON.parse(result);
    } catch (error) {
      return { success: false, error: String(error) };
    }
  },
  
  controlMedia: async (action: 'play' | 'pause' | 'next' | 'previous'): Promise<{ success: boolean; error?: string }> => {
    const bridge = getAndroidBridge();
    if (!bridge) return { success: false, error: 'Android bridge not available' };
    
    try {
      const result = bridge.controlMedia(action);
      return JSON.parse(result);
    } catch (error) {
      return { success: false, error: String(error) };
    }
  },
  
  // Display
  setBrightness: async (level: number): Promise<{ success: boolean; error?: string }> => {
    const bridge = getAndroidBridge();
    if (!bridge) return { success: false, error: 'Android bridge not available' };
    
    try {
      const result = bridge.setBrightness(level);
      return JSON.parse(result);
    } catch (error) {
      return { success: false, error: String(error) };
    }
  },
  
  getBrightness: async (): Promise<number> => {
    const bridge = getAndroidBridge();
    if (!bridge) return 50; // Default
    return bridge.getBrightness();
  },
  
  // Network & Connectivity
  toggleWifi: async (enabled: boolean): Promise<{ success: boolean; error?: string }> => {
    const bridge = getAndroidBridge();
    if (!bridge) return { success: false, error: 'Android bridge not available' };
    
    try {
      const result = bridge.toggleWifi(enabled);
      return JSON.parse(result);
    } catch (error) {
      return { success: false, error: String(error) };
    }
  },
  
  toggleBluetooth: async (enabled: boolean): Promise<{ success: boolean; error?: string }> => {
    const bridge = getAndroidBridge();
    if (!bridge) return { success: false, error: 'Android bridge not available' };
    
    try {
      const result = bridge.toggleBluetooth(enabled);
      return JSON.parse(result);
    } catch (error) {
      return { success: false, error: String(error) };
    }
  },
  
  toggleFlashlight: async (enabled: boolean): Promise<{ success: boolean; error?: string }> => {
    const bridge = getAndroidBridge();
    if (!bridge) return { success: false, error: 'Android bridge not available' };
    
    try {
      const result = bridge.toggleFlashlight(enabled);
      return JSON.parse(result);
    } catch (error) {
      return { success: false, error: String(error) };
    }
  },
  
  // Apps
  launchApp: async (packageName: string, data?: string): Promise<{ success: boolean; error?: string }> => {
    const bridge = getAndroidBridge();
    if (!bridge) return { success: false, error: 'Android bridge not available' };
    
    try {
      const result = bridge.launchApp(packageName, data);
      return JSON.parse(result);
    } catch (error) {
      return { success: false, error: String(error) };
    }
  },
  
  closeApp: async (packageName: string): Promise<{ success: boolean; error?: string }> => {
    const bridge = getAndroidBridge();
    if (!bridge) return { success: false, error: 'Android bridge not available' };
    
    try {
      const result = bridge.closeApp(packageName);
      return JSON.parse(result);
    } catch (error) {
      return { success: false, error: String(error) };
    }
  },
  
  // Communication
  sendSMS: async (phoneNumber: string, message: string): Promise<{ success: boolean; error?: string }> => {
    const bridge = getAndroidBridge();
    if (!bridge) return { success: false, error: 'Android bridge not available' };
    
    try {
      const result = bridge.sendSMS(phoneNumber, message);
      return JSON.parse(result);
    } catch (error) {
      return { success: false, error: String(error) };
    }
  },
  
  makeCall: async (phoneNumber: string): Promise<{ success: boolean; error?: string }> => {
    const bridge = getAndroidBridge();
    if (!bridge) return { success: false, error: 'Android bridge not available' };
    
    try {
      const result = bridge.makeCall(phoneNumber);
      return JSON.parse(result);
    } catch (error) {
      return { success: false, error: String(error) };
    }
  },
  
  // Notifications
  sendNotification: async (title: string, message: string, priority: string = 'default'): Promise<{ success: boolean; error?: string }> => {
    const bridge = getAndroidBridge();
    if (!bridge) return { success: false, error: 'Android bridge not available' };
    
    try {
      const result = bridge.sendNotification(title, message, priority);
      return JSON.parse(result);
    } catch (error) {
      return { success: false, error: String(error) };
    }
  },
  
  setDoNotDisturb: async (mode: 'silent' | 'priority' | 'alarms' | 'off'): Promise<{ success: boolean; error?: string }> => {
    const bridge = getAndroidBridge();
    if (!bridge) return { success: false, error: 'Android bridge not available' };
    
    try {
      const result = bridge.setDoNotDisturb(mode);
      return JSON.parse(result);
    } catch (error) {
      return { success: false, error: String(error) };
    }
  },
  
  // System Info
  getDeviceInfo: async (): Promise<any> => {
    const bridge = getAndroidBridge();
    if (!bridge) return null;
    
    try {
      const result = bridge.getDeviceInfo();
      return JSON.parse(result);
    } catch (error) {
      return null;
    }
  },
  
  getBatteryLevel: async (): Promise<number> => {
    const bridge = getAndroidBridge();
    if (!bridge) return 100;
    return bridge.getBatteryLevel();
  },
  
  isCharging: async (): Promise<boolean> => {
    const bridge = getAndroidBridge();
    if (!bridge) return false;
    return bridge.isCharging();
  },
  
  getCurrentLocation: async (): Promise<{ lat: number; lng: number } | null> => {
    const bridge = getAndroidBridge();
    if (!bridge) return null;
    
    try {
      const result = bridge.getCurrentLocation();
      return JSON.parse(result);
    } catch (error) {
      return null;
    }
  },
  
  // Permissions
  checkPermission: async (permission: string): Promise<boolean> => {
    const bridge = getAndroidBridge();
    if (!bridge) return false;
    return bridge.checkPermission(permission);
  },
  
  requestPermission: async (permission: string): Promise<{ success: boolean; granted: boolean }> => {
    const bridge = getAndroidBridge();
    if (!bridge) return { success: false, granted: false };
    
    try {
      const result = bridge.requestPermission(permission);
      return JSON.parse(result);
    } catch (error) {
      return { success: false, granted: false };
    }
  }
};
