/**
 * Web API Executor
 * 
 * Implements macro actions using standard Web APIs when running in a browser.
 * These work without Android but provide limited functionality compared to native.
 */

export interface ActionResult {
  success: boolean;
  message: string;
  error?: string;
}

/**
 * Web API-based action implementations
 */
export const webExecutor = {
  // Check if specific Web API is available
  isSupported: (api: string): boolean => {
    switch (api) {
      case 'vibration':
        return 'vibrate' in navigator;
      case 'notifications':
        return 'Notification' in window;
      case 'geolocation':
        return 'geolocation' in navigator;
      case 'battery':
        return 'getBattery' in navigator;
      case 'wakeLock':
        return 'wakeLock' in navigator;
      default:
        return false;
    }
  },

  // Vibration (works on mobile browsers)
  vibrate: async (pattern: number | number[]): Promise<ActionResult> => {
    if (!webExecutor.isSupported('vibration')) {
      return { success: false, message: 'Vibration API not supported' };
    }

    try {
      navigator.vibrate(pattern);
      return { success: true, message: 'Vibration triggered' };
    } catch (error) {
      return { success: false, message: 'Vibration failed', error: String(error) };
    }
  },

  // Notifications (requires permission)
  sendNotification: async (title: string, options?: NotificationOptions): Promise<ActionResult> => {
    if (!webExecutor.isSupported('notifications')) {
      return { success: false, message: 'Notifications API not supported' };
    }

    try {
      // Request permission if not granted
      if (Notification.permission === 'default') {
        const permission = await Notification.requestPermission();
        if (permission !== 'granted') {
          return { success: false, message: 'Notification permission denied' };
        }
      }

      if (Notification.permission === 'granted') {
        new Notification(title, options);
        return { success: true, message: 'Notification sent' };
      }

      return { success: false, message: 'Notification permission not granted' };
    } catch (error) {
      return { success: false, message: 'Notification failed', error: String(error) };
    }
  },

  // Geolocation
  getCurrentLocation: async (): Promise<{ success: boolean; lat?: number; lng?: number; error?: string }> => {
    if (!webExecutor.isSupported('geolocation')) {
      return { success: false, error: 'Geolocation API not supported' };
    }

    return new Promise((resolve) => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            success: true,
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          resolve({
            success: false,
            error: error.message
          });
        }
      );
    });
  },

  // Watch location changes
  watchLocation: async (callback: (lat: number, lng: number) => void): Promise<{ watchId: number }> => {
    if (!webExecutor.isSupported('geolocation')) {
      throw new Error('Geolocation API not supported');
    }

    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        callback(position.coords.latitude, position.coords.longitude);
      },
      (error) => {
        console.error('Location watch error:', error);
      }
    );

    return { watchId };
  },

  clearLocationWatch: (watchId: number) => {
    navigator.geolocation.clearWatch(watchId);
  },

  // Battery status
  getBatteryInfo: async (): Promise<{ level: number; charging: boolean } | null> => {
    if (!webExecutor.isSupported('battery')) {
      return null;
    }

    try {
      const battery = await (navigator as any).getBattery();
      return {
        level: Math.round(battery.level * 100),
        charging: battery.charging
      };
    } catch (error) {
      console.error('Battery API error:', error);
      return null;
    }
  },

  // Wake Lock (keep screen on)
  requestWakeLock: async (): Promise<{ success: boolean; wakeLock?: any; error?: string }> => {
    if (!webExecutor.isSupported('wakeLock')) {
      return { success: false, error: 'Wake Lock API not supported' };
    }

    try {
      const wakeLock = await (navigator as any).wakeLock.request('screen');
      return { success: true, wakeLock };
    } catch (error) {
      return { success: false, error: String(error) };
    }
  },

  // Open external URL or app (limited)
  openUrl: async (url: string): Promise<ActionResult> => {
    try {
      window.open(url, '_blank');
      return { success: true, message: 'URL opened' };
    } catch (error) {
      return { success: false, message: 'Failed to open URL', error: String(error) };
    }
  },

  // Share API (mobile browsers)
  share: async (data: { title?: string; text?: string; url?: string }): Promise<ActionResult> => {
    if (!('share' in navigator)) {
      return { success: false, message: 'Share API not supported' };
    }

    try {
      await (navigator as any).share(data);
      return { success: true, message: 'Shared successfully' };
    } catch (error) {
      return { success: false, message: 'Share failed', error: String(error) };
    }
  },

  // Clipboard
  copyToClipboard: async (text: string): Promise<ActionResult> => {
    if (!navigator.clipboard) {
      return { success: false, message: 'Clipboard API not supported' };
    }

    try {
      await navigator.clipboard.writeText(text);
      return { success: true, message: 'Copied to clipboard' };
    } catch (error) {
      return { success: false, message: 'Copy failed', error: String(error) };
    }
  },

  readFromClipboard: async (): Promise<{ success: boolean; text?: string; error?: string }> => {
    if (!navigator.clipboard) {
      return { success: false, error: 'Clipboard API not supported' };
    }

    try {
      const text = await navigator.clipboard.readText();
      return { success: true, text };
    } catch (error) {
      return { success: false, error: String(error) };
    }
  },

  // Device orientation (for motion detection)
  requestOrientationPermission: async (): Promise<ActionResult> => {
    if (typeof (DeviceOrientationEvent as any).requestPermission === 'function') {
      try {
        const permission = await (DeviceOrientationEvent as any).requestPermission();
        if (permission === 'granted') {
          return { success: true, message: 'Orientation permission granted' };
        }
        return { success: false, message: 'Orientation permission denied' };
      } catch (error) {
        return { success: false, message: 'Permission request failed', error: String(error) };
      }
    }
    return { success: true, message: 'No permission needed' };
  },

  // Screen orientation
  lockOrientation: async (orientation: 'portrait' | 'landscape'): Promise<ActionResult> => {
    if (!screen.orientation || !screen.orientation.lock) {
      return { success: false, message: 'Screen orientation lock not supported' };
    }

    try {
      await screen.orientation.lock(orientation === 'portrait' ? 'portrait-primary' : 'landscape-primary');
      return { success: true, message: `Orientation locked to ${orientation}` };
    } catch (error) {
      return { success: false, message: 'Orientation lock failed', error: String(error) };
    }
  },

  unlockOrientation: async (): Promise<ActionResult> => {
    if (!screen.orientation || !screen.orientation.unlock) {
      return { success: false, message: 'Screen orientation lock not supported' };
    }

    try {
      screen.orientation.unlock();
      return { success: true, message: 'Orientation unlocked' };
    } catch (error) {
      return { success: false, message: 'Orientation unlock failed', error: String(error) };
    }
  },

  // Full screen
  requestFullscreen: async (): Promise<ActionResult> => {
    if (!document.documentElement.requestFullscreen) {
      return { success: false, message: 'Fullscreen API not supported' };
    }

    try {
      await document.documentElement.requestFullscreen();
      return { success: true, message: 'Entered fullscreen' };
    } catch (error) {
      return { success: false, message: 'Fullscreen request failed', error: String(error) };
    }
  },

  exitFullscreen: async (): Promise<ActionResult> => {
    if (!document.exitFullscreen) {
      return { success: false, message: 'Fullscreen API not supported' };
    }

    try {
      await document.exitFullscreen();
      return { success: true, message: 'Exited fullscreen' };
    } catch (error) {
      return { success: false, message: 'Exit fullscreen failed', error: String(error) };
    }
  },

  // Media controls (limited to current page's media)
  playMedia: async (): Promise<ActionResult> => {
    try {
      const videos = document.querySelectorAll('video');
      const audios = document.querySelectorAll('audio');
      
      if (videos.length > 0) {
        await videos[0].play();
        return { success: true, message: 'Playing video' };
      }
      
      if (audios.length > 0) {
        await audios[0].play();
        return { success: true, message: 'Playing audio' };
      }
      
      return { success: false, message: 'No media elements found' };
    } catch (error) {
      return { success: false, message: 'Play failed', error: String(error) };
    }
  },

  pauseMedia: async (): Promise<ActionResult> => {
    try {
      const videos = document.querySelectorAll('video');
      const audios = document.querySelectorAll('audio');
      
      videos.forEach(v => v.pause());
      audios.forEach(a => a.pause());
      
      if (videos.length > 0 || audios.length > 0) {
        return { success: true, message: 'Media paused' };
      }
      
      return { success: false, message: 'No media elements found' };
    } catch (error) {
      return { success: false, message: 'Pause failed', error: String(error) };
    }
  }
};

// Feature detection helper
export const getAvailableWebFeatures = (): string[] => {
  const features: string[] = [];
  
  if (webExecutor.isSupported('vibration')) features.push('vibration');
  if (webExecutor.isSupported('notifications')) features.push('notifications');
  if (webExecutor.isSupported('geolocation')) features.push('geolocation');
  if (webExecutor.isSupported('battery')) features.push('battery');
  if (webExecutor.isSupported('wakeLock')) features.push('wakeLock');
  if ('share' in navigator) features.push('share');
  if (navigator.clipboard) features.push('clipboard');
  if (screen.orientation) features.push('orientation');
  if (document.documentElement.requestFullscreen) features.push('fullscreen');
  
  return features;
};
