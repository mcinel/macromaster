import { Context } from "npm:hono";

export interface AndroidPermission {
  name: string;
  displayName: string;
  description: string;
  category: 'System' | 'Privacy' | 'Storage' | 'Network' | 'Device' | 'Communication';
  dangerLevel: 'normal' | 'dangerous' | 'signature';
  required: boolean;
  granted?: boolean;
}

export const ANDROID_PERMISSIONS: Record<string, AndroidPermission> = {
  // Audio & Media
  'MODIFY_AUDIO_SETTINGS': {
    name: 'MODIFY_AUDIO_SETTINGS',
    displayName: 'Modify Audio Settings',
    description: 'Allows the app to modify global audio settings such as volume and which speaker is used for output.',
    category: 'System',
    dangerLevel: 'normal',
    required: true
  },
  'WRITE_SETTINGS': {
    name: 'WRITE_SETTINGS',
    displayName: 'Modify System Settings',
    description: 'Allows the app to modify the system\'s settings data, including brightness and volume.',
    category: 'System',
    dangerLevel: 'signature',
    required: true
  },

  // Network
  'CHANGE_WIFI_STATE': {
    name: 'CHANGE_WIFI_STATE',
    displayName: 'Change WiFi State',
    description: 'Allows the app to connect to and disconnect from Wi-Fi access points and to make changes to device configuration for Wi-Fi networks.',
    category: 'Network',
    dangerLevel: 'normal',
    required: true
  },
  'ACCESS_WIFI_STATE': {
    name: 'ACCESS_WIFI_STATE',
    displayName: 'View WiFi Connections',
    description: 'Allows the app to view information about Wi-Fi networking, such as whether Wi-Fi is enabled and name of connected Wi-Fi devices.',
    category: 'Network',
    dangerLevel: 'normal',
    required: true
  },
  'BLUETOOTH': {
    name: 'BLUETOOTH',
    displayName: 'Pair with Bluetooth Devices',
    description: 'Allows the app to view the configuration of Bluetooth on the device, and to make and accept connections with paired devices.',
    category: 'Network',
    dangerLevel: 'normal',
    required: true
  },
  'BLUETOOTH_ADMIN': {
    name: 'BLUETOOTH_ADMIN',
    displayName: 'Access Bluetooth Settings',
    description: 'Allows the app to configure the local Bluetooth device, and to discover and pair with remote devices.',
    category: 'Network',
    dangerLevel: 'normal',
    required: true
  },

  // Notifications & Do Not Disturb
  'ACCESS_NOTIFICATION_POLICY': {
    name: 'ACCESS_NOTIFICATION_POLICY',
    displayName: 'Access Do Not Disturb',
    description: 'Allows the app to access and modify Do Not Disturb configuration.',
    category: 'Privacy',
    dangerLevel: 'normal',
    required: true
  },
  'BIND_NOTIFICATION_LISTENER_SERVICE': {
    name: 'BIND_NOTIFICATION_LISTENER_SERVICE',
    displayName: 'Notification Access',
    description: 'Allows the app to receive all notifications posted by any application.',
    category: 'Privacy',
    dangerLevel: 'signature',
    required: false
  },

  // Location
  'ACCESS_FINE_LOCATION': {
    name: 'ACCESS_FINE_LOCATION',
    displayName: 'Precise Location',
    description: 'This app can get your exact location from location services while the app is in use.',
    category: 'Privacy',
    dangerLevel: 'dangerous',
    required: false
  },
  'ACCESS_COARSE_LOCATION': {
    name: 'ACCESS_COARSE_LOCATION',
    displayName: 'Approximate Location',
    description: 'This app can get your approximate location from location sources such as network providers.',
    category: 'Privacy',
    dangerLevel: 'dangerous',
    required: false
  },

  // Phone & SMS
  'CALL_PHONE': {
    name: 'CALL_PHONE',
    displayName: 'Make Phone Calls',
    description: 'Allows the app to call phone numbers without your intervention. This may result in unexpected charges or calls.',
    category: 'Communication',
    dangerLevel: 'dangerous',
    required: false
  },
  'SEND_SMS': {
    name: 'SEND_SMS',
    displayName: 'Send SMS Messages',
    description: 'Allows the app to send SMS messages. This may result in unexpected charges.',
    category: 'Communication',
    dangerLevel: 'dangerous',
    required: false
  },

  // Camera & Flashlight
  'CAMERA': {
    name: 'CAMERA',
    displayName: 'Take Pictures and Videos',
    description: 'This app can take pictures and record videos using the camera at any time.',
    category: 'Privacy',
    dangerLevel: 'dangerous',
    required: false
  },
  'FLASHLIGHT': {
    name: 'FLASHLIGHT',
    displayName: 'Control Flashlight',
    description: 'Allows the app to control the flashlight.',
    category: 'Device',
    dangerLevel: 'normal',
    required: false
  },

  // Apps & Usage
  'PACKAGE_USAGE_STATS': {
    name: 'PACKAGE_USAGE_STATS',
    displayName: 'Usage Access',
    description: 'Allows the app to access usage statistics for installed apps.',
    category: 'System',
    dangerLevel: 'signature',
    required: false
  },
  'QUERY_ALL_PACKAGES': {
    name: 'QUERY_ALL_PACKAGES',
    displayName: 'Query All Packages',
    description: 'Allows the app to see all installed applications.',
    category: 'System',
    dangerLevel: 'normal',
    required: false
  },

  // Device Admin
  'DEVICE_POWER': {
    name: 'DEVICE_POWER',
    displayName: 'Turn Screen On/Off',
    description: 'Allows the app to turn the device screen on or off.',
    category: 'Device',
    dangerLevel: 'signature',
    required: false
  },
  'WAKE_LOCK': {
    name: 'WAKE_LOCK',
    displayName: 'Prevent Device from Sleeping',
    description: 'Allows the app to prevent the device from going to sleep.',
    category: 'Device',
    dangerLevel: 'normal',
    required: false
  },

  // Battery
  'BATTERY_STATS': {
    name: 'BATTERY_STATS',
    displayName: 'Battery Statistics',
    description: 'Allows an application to collect battery statistics.',
    category: 'Device',
    dangerLevel: 'normal',
    required: false
  },

  // Alarms
  'SET_ALARM': {
    name: 'SET_ALARM',
    displayName: 'Set Alarms',
    description: 'Allows the app to set an alarm in an installed alarm clock app.',
    category: 'System',
    dangerLevel: 'normal',
    required: false
  }
};

export class PermissionManager {
  private grantedPermissions: Set<string> = new Set();
  
  constructor() {
    // Initialize with some basic permissions that are typically auto-granted
    this.grantedPermissions.add('MODIFY_AUDIO_SETTINGS');
    this.grantedPermissions.add('ACCESS_WIFI_STATE');
    this.grantedPermissions.add('WAKE_LOCK');
  }

  async checkPermission(permission: string): Promise<boolean> {
    return this.grantedPermissions.has(permission);
  }

  async requestPermission(permission: string): Promise<{ granted: boolean; message: string }> {
    const permissionInfo = ANDROID_PERMISSIONS[permission];
    
    if (!permissionInfo) {
      return { granted: false, message: `Unknown permission: ${permission}` };
    }

    // Simulate permission request process
    await new Promise(resolve => setTimeout(resolve, 1000));

    // For dangerous permissions, simulate user interaction
    if (permissionInfo.dangerLevel === 'dangerous') {
      // In a real app, this would show a system dialog
      // For simulation, we'll grant about 70% of requests
      const granted = Math.random() > 0.3;
      
      if (granted) {
        this.grantedPermissions.add(permission);
        return { 
          granted: true, 
          message: `Permission granted: ${permissionInfo.displayName}` 
        };
      } else {
        return { 
          granted: false, 
          message: `Permission denied by user: ${permissionInfo.displayName}` 
        };
      }
    }

    // For normal permissions, auto-grant
    if (permissionInfo.dangerLevel === 'normal') {
      this.grantedPermissions.add(permission);
      return { 
        granted: true, 
        message: `Permission auto-granted: ${permissionInfo.displayName}` 
      };
    }

    // For signature permissions, require special setup
    if (permissionInfo.dangerLevel === 'signature') {
      // These require system-level access or special app signing
      return { 
        granted: false, 
        message: `Signature permission requires system access: ${permissionInfo.displayName}` 
      };
    }

    return { granted: false, message: `Could not process permission: ${permission}` };
  }

  async requestMultiplePermissions(permissions: string[]): Promise<Record<string, boolean>> {
    const results: Record<string, boolean> = {};
    
    for (const permission of permissions) {
      const result = await this.requestPermission(permission);
      results[permission] = result.granted;
    }
    
    return results;
  }

  getRequiredPermissions(actions: string[]): string[] {
    const permissions = new Set<string>();
    
    // Map actions to required permissions
    const actionPermissionMap: Record<string, string[]> = {
      'set_volume': ['MODIFY_AUDIO_SETTINGS'],
      'set_brightness': ['WRITE_SETTINGS'],
      'toggle_wifi': ['CHANGE_WIFI_STATE', 'ACCESS_WIFI_STATE'],
      'toggle_bluetooth': ['BLUETOOTH', 'BLUETOOTH_ADMIN'],
      'set_do_not_disturb': ['ACCESS_NOTIFICATION_POLICY'],
      'send_notification': [],
      'launch_app': ['QUERY_ALL_PACKAGES'],
      'close_app': ['PACKAGE_USAGE_STATS'],
      'set_ringer_mode': ['MODIFY_AUDIO_SETTINGS'],
      'toggle_location': ['ACCESS_FINE_LOCATION'],
      'set_alarm': ['SET_ALARM'],
      'send_sms': ['SEND_SMS'],
      'make_call': ['CALL_PHONE'],
      'control_media': ['MODIFY_AUDIO_SETTINGS'],
      'toggle_flashlight': ['CAMERA', 'FLASHLIGHT'],
      'set_wallpaper': []
    };
    
    actions.forEach(action => {
      const actionPerms = actionPermissionMap[action] || [];
      actionPerms.forEach(perm => permissions.add(perm));
    });
    
    return Array.from(permissions);
  }

  getPermissionInfo(permission: string): AndroidPermission | null {
    return ANDROID_PERMISSIONS[permission] || null;
  }

  getAllPermissions(): AndroidPermission[] {
    return Object.values(ANDROID_PERMISSIONS);
  }

  getGrantedPermissions(): string[] {
    return Array.from(this.grantedPermissions);
  }

  getMissingPermissions(requiredPermissions: string[]): AndroidPermission[] {
    return requiredPermissions
      .filter(perm => !this.grantedPermissions.has(perm))
      .map(perm => ANDROID_PERMISSIONS[perm])
      .filter(Boolean);
  }

  async checkMacroPermissions(macro: any): Promise<{
    allGranted: boolean;
    missing: AndroidPermission[];
    granted: string[];
  }> {
    const requiredPermissions = macro.permissions || [];
    const missing: AndroidPermission[] = [];
    const granted: string[] = [];
    
    for (const permission of requiredPermissions) {
      if (await this.checkPermission(permission)) {
        granted.push(permission);
      } else {
        const permInfo = this.getPermissionInfo(permission);
        if (permInfo) {
          missing.push(permInfo);
        }
      }
    }
    
    return {
      allGranted: missing.length === 0,
      missing,
      granted
    };
  }
}

export const permissionManager = new PermissionManager();