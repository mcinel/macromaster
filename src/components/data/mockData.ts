import { Macro, MacroStep } from '../../App';

export const mockMacros: Macro[] = [
  {
    id: '1',
    name: 'Silent Night Mode',
    description: 'Automatically enable silent mode and reduce brightness at 10 PM',
    category: 'Sleep & Rest',
    isEnabled: true,
    createdAt: '2024-01-15',
    lastRun: '2 hours ago',
    runCount: 45,
    permissions: ['AUDIO_SETTINGS', 'BRIGHTNESS_CONTROL', 'NOTIFICATION_ACCESS'],
    steps: [
      {
        id: 's1',
        type: 'trigger',
        title: 'Time Trigger',
        description: 'When time is 10:00 PM',
        icon: 'Clock',
        settings: { time: '22:00', days: ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'] }
      },
      {
        id: 's2',
        type: 'action',
        title: 'Set Audio Mode',
        description: 'Change audio to Silent',
        icon: 'VolumeX',
        settings: { mode: 'silent' }
      },
      {
        id: 's3',
        type: 'action',
        title: 'Reduce Brightness',
        description: 'Set screen brightness to 20%',
        icon: 'Sun',
        settings: { brightness: 20 }
      }
    ]
  },
  {
    id: '2',
    name: 'Battery Saver Pro',
    description: 'Enable power saving features when battery drops below 20%',
    category: 'Battery & Power',
    isEnabled: true,
    createdAt: '2024-01-12',
    lastRun: '1 day ago',
    runCount: 12,
    permissions: ['BATTERY_STATS', 'WIFI_CONTROL', 'BLUETOOTH_CONTROL', 'LOCATION_CONTROL'],
    steps: [
      {
        id: 's4',
        type: 'trigger',
        title: 'Battery Level',
        description: 'When battery level is below 20%',
        icon: 'Battery',
        settings: { level: 20, operator: 'below' }
      },
      {
        id: 's5',
        type: 'action',
        title: 'Disable WiFi',
        description: 'Turn off WiFi to save power',
        icon: 'Wifi',
        settings: { state: 'off' }
      },
      {
        id: 's6',
        type: 'action',
        title: 'Disable Bluetooth',
        description: 'Turn off Bluetooth',
        icon: 'Bluetooth',
        settings: { state: 'off' }
      },
      {
        id: 's7',
        type: 'action',
        title: 'Enable Battery Saver',
        description: 'Activate system battery saver mode',
        icon: 'Zap',
        settings: { mode: 'enabled' }
      }
    ]
  },
  {
    id: '3',
    name: 'Work Focus Mode',
    description: 'Block distracting apps and enable Do Not Disturb during work hours',
    category: 'Productivity',
    isEnabled: false,
    createdAt: '2024-01-10',
    runCount: 8,
    permissions: ['APP_USAGE_ACCESS', 'DO_NOT_DISTURB', 'NOTIFICATION_ACCESS'],
    steps: [
      {
        id: 's8',
        type: 'trigger',
        title: 'Time Range',
        description: 'Between 9 AM and 5 PM on weekdays',
        icon: 'Clock',
        settings: { startTime: '09:00', endTime: '17:00', days: ['mon', 'tue', 'wed', 'thu', 'fri'] }
      },
      {
        id: 's9',
        type: 'condition',
        title: 'Location Check',
        description: 'Only when at work location',
        icon: 'MapPin',
        settings: { location: 'work', radius: 100 }
      },
      {
        id: 's10',
        type: 'action',
        title: 'Block Apps',
        description: 'Block social media and gaming apps',
        icon: 'Shield',
        settings: { apps: ['com.instagram.android', 'com.twitter.android', 'com.facebook.katana'] }
      },
      {
        id: 's11',
        type: 'action',
        title: 'Enable DND',
        description: 'Turn on Do Not Disturb mode',
        icon: 'BellOff',
        settings: { allowCalls: true, allowAlarms: true }
      }
    ]
  },
  {
    id: '4',
    name: 'Smart Home Control',
    description: 'Turn on lights and adjust thermostat when arriving home',
    category: 'Home Automation',
    isEnabled: true,
    createdAt: '2024-01-08',
    lastRun: '3 hours ago',
    runCount: 23,
    permissions: ['LOCATION_ACCESS', 'INTERNET_ACCESS'],
    steps: [
      {
        id: 's12',
        type: 'trigger',
        title: 'Location Trigger',
        description: 'When entering home area',
        icon: 'Home',
        settings: { location: 'home', radius: 50, action: 'enter' }
      },
      {
        id: 's13',
        type: 'condition',
        title: 'Time Condition',
        description: 'Only after sunset',
        icon: 'Sunrise',
        settings: { time: 'sunset', offset: 0 }
      },
      {
        id: 's14',
        type: 'action',
        title: 'Turn On Lights',
        description: 'Activate living room lights',
        icon: 'Lightbulb',
        settings: { device: 'living_room_lights', brightness: 80 }
      },
      {
        id: 's15',
        type: 'action',
        title: 'Adjust Temperature',
        description: 'Set thermostat to comfort mode',
        icon: 'Thermometer',
        settings: { temperature: 72, mode: 'auto' }
      }
    ]
  },
  {
    id: '5',
    name: 'Driving Safety Mode',
    description: 'Auto-reply to messages and enable hands-free mode while driving',
    category: 'Transportation',
    isEnabled: true,
    createdAt: '2024-01-05',
    lastRun: '5 hours ago',
    runCount: 31,
    permissions: ['SMS_ACCESS', 'CALL_ACCESS', 'LOCATION_ACCESS', 'MOTION_SENSORS'],
    steps: [
      {
        id: 's16',
        type: 'trigger',
        title: 'Motion Detection',
        description: 'When driving motion is detected',
        icon: 'Car',
        settings: { speed: 25, duration: 300 }
      },
      {
        id: 's17',
        type: 'action',
        title: 'Auto-Reply SMS',
        description: 'Send driving response to messages',
        icon: 'MessageSquare',
        settings: { message: 'I\'m currently driving and will respond when safe.' }
      },
      {
        id: 's18',
        type: 'action',
        title: 'Enable Voice Control',
        description: 'Activate hands-free voice commands',
        icon: 'Mic',
        settings: { sensitivity: 'high' }
      }
    ]
  },
  {
    id: '6',
    name: 'Morning Routine',
    description: 'Wake up with gradual brightness, weather update, and calendar briefing',
    category: 'Sleep & Rest',
    isEnabled: true,
    createdAt: '2024-01-20',
    lastRun: '10 hours ago',
    runCount: 67,
    permissions: ['BRIGHTNESS_CONTROL', 'INTERNET_ACCESS', 'CALENDAR_ACCESS', 'AUDIO_SETTINGS'],
    steps: [
      {
        id: 's19',
        type: 'trigger',
        title: 'Alarm Dismissed',
        description: 'When alarm is turned off',
        icon: 'AlarmClock',
        settings: { alarmType: 'any' }
      },
      {
        id: 's20',
        type: 'action',
        title: 'Gradual Brightness',
        description: 'Increase brightness from 10% to 100%',
        icon: 'Sun',
        settings: { startBrightness: 10, endBrightness: 100, duration: 120 }
      },
      {
        id: 's21',
        type: 'action',
        title: 'Read Weather',
        description: 'Announce today\'s weather forecast',
        icon: 'Cloud',
        settings: { voice: true }
      }
    ]
  },
  {
    id: '7',
    name: 'Power Optimizer',
    description: 'Automatically optimize battery based on usage patterns',
    category: 'Battery & Power',
    isEnabled: false,
    createdAt: '2024-01-18',
    runCount: 5,
    permissions: ['BATTERY_STATS', 'APP_USAGE_ACCESS', 'BACKGROUND_RESTRICTION'],
    steps: [
      {
        id: 's22',
        type: 'trigger',
        title: 'Usage Analysis',
        description: 'Every 2 hours during the day',
        icon: 'Clock',
        settings: { interval: 120, startTime: '08:00', endTime: '22:00' }
      },
      {
        id: 's23',
        type: 'action',
        title: 'Restrict Background Apps',
        description: 'Limit rarely used apps',
        icon: 'AppWindow',
        settings: { threshold: 7 }
      }
    ]
  },
  {
    id: '8',
    name: 'Meeting Mode',
    description: 'Silence notifications and auto-decline calls during calendar meetings',
    category: 'Productivity',
    isEnabled: true,
    createdAt: '2024-01-22',
    lastRun: '2 days ago',
    runCount: 15,
    permissions: ['CALENDAR_ACCESS', 'DO_NOT_DISTURB', 'CALL_ACCESS'],
    steps: [
      {
        id: 's24',
        type: 'trigger',
        title: 'Calendar Event',
        description: 'When meeting starts',
        icon: 'Calendar',
        settings: { eventType: 'busy' }
      },
      {
        id: 's25',
        type: 'action',
        title: 'Enable DND',
        description: 'Priority mode for important contacts',
        icon: 'BellOff',
        settings: { priority: true }
      }
    ]
  },
  {
    id: '9',
    name: 'Smart Lights Control',
    description: 'Sync phone brightness with smart home lighting',
    category: 'Home Automation',
    isEnabled: true,
    createdAt: '2024-01-17',
    lastRun: '1 hour ago',
    runCount: 89,
    permissions: ['BRIGHTNESS_CONTROL', 'INTERNET_ACCESS', 'LOCATION_ACCESS'],
    steps: [
      {
        id: 's26',
        type: 'trigger',
        title: 'At Home',
        description: 'When connected to home WiFi',
        icon: 'Wifi',
        settings: { ssid: 'Home Network' }
      },
      {
        id: 's27',
        type: 'action',
        title: 'Sync Lighting',
        description: 'Match ambient room brightness',
        icon: 'Lightbulb',
        settings: { sync: true }
      }
    ]
  },
  {
    id: '10',
    name: 'Navigation Assistant',
    description: 'Launch navigation app and adjust settings when connected to car Bluetooth',
    category: 'Transportation',
    isEnabled: true,
    createdAt: '2024-01-14',
    lastRun: '6 hours ago',
    runCount: 42,
    permissions: ['BLUETOOTH_CONTROL', 'LOCATION_ACCESS', 'APP_LAUNCH'],
    steps: [
      {
        id: 's28',
        type: 'trigger',
        title: 'Car Bluetooth',
        description: 'When connected to car stereo',
        icon: 'Bluetooth',
        settings: { deviceName: 'Car Audio' }
      },
      {
        id: 's29',
        type: 'action',
        title: 'Launch Maps',
        description: 'Open navigation app',
        icon: 'Map',
        settings: { app: 'com.google.android.apps.maps' }
      },
      {
        id: 's30',
        type: 'action',
        title: 'Max Volume',
        description: 'Set media volume to maximum',
        icon: 'Volume2',
        settings: { volume: 100 }
      }
    ]
  },
  {
    id: '11',
    name: 'Bedtime Wind Down',
    description: 'Gradually reduce screen activity and enable night mode before sleep',
    category: 'Sleep & Rest',
    isEnabled: true,
    createdAt: '2024-01-25',
    lastRun: '8 hours ago',
    runCount: 34,
    permissions: ['BRIGHTNESS_CONTROL', 'BLUE_LIGHT_FILTER', 'NOTIFICATION_ACCESS'],
    steps: [
      {
        id: 's31',
        type: 'trigger',
        title: 'Bedtime',
        description: 'At 9:30 PM daily',
        icon: 'Moon',
        settings: { time: '21:30' }
      },
      {
        id: 's32',
        type: 'action',
        title: 'Blue Light Filter',
        description: 'Enable night mode',
        icon: 'Eye',
        settings: { intensity: 'high' }
      },
      {
        id: 's33',
        type: 'action',
        title: 'Mute Notifications',
        description: 'Except alarms and calls',
        icon: 'BellOff',
        settings: { allowAlarms: true, allowCalls: true }
      }
    ]
  },
  {
    id: '12',
    name: 'Gym Mode',
    description: 'Track workout, play music, and monitor heart rate at the gym',
    category: 'Productivity',
    isEnabled: false,
    createdAt: '2024-01-11',
    runCount: 3,
    permissions: ['LOCATION_ACCESS', 'AUDIO_SETTINGS', 'HEALTH_SENSORS'],
    steps: [
      {
        id: 's34',
        type: 'trigger',
        title: 'Gym Location',
        description: 'When arriving at gym',
        icon: 'Dumbbell',
        settings: { location: 'gym', radius: 100 }
      },
      {
        id: 's35',
        type: 'action',
        title: 'Start Workout',
        description: 'Launch fitness app',
        icon: 'Activity',
        settings: { app: 'fitness_tracker' }
      },
      {
        id: 's36',
        type: 'action',
        title: 'Play Playlist',
        description: 'Start workout music',
        icon: 'Music',
        settings: { playlist: 'Workout Mix' }
      }
    ]
  },
  {
    id: '13',
    name: 'Fast Charger',
    description: 'Optimize charging speed when battery is critically low',
    category: 'Battery & Power',
    isEnabled: true,
    createdAt: '2024-01-09',
    lastRun: '2 days ago',
    runCount: 8,
    permissions: ['BATTERY_STATS', 'WIFI_CONTROL', 'SYNC_CONTROL', 'BRIGHTNESS_CONTROL'],
    steps: [
      {
        id: 's37',
        type: 'trigger',
        title: 'Critical Battery',
        description: 'When battery below 10%',
        icon: 'BatteryLow',
        settings: { level: 10 }
      },
      {
        id: 's38',
        type: 'action',
        title: 'Ultra Power Save',
        description: 'Disable all non-essential services',
        icon: 'Zap',
        settings: { mode: 'ultra' }
      },
      {
        id: 's39',
        type: 'action',
        title: 'Min Brightness',
        description: 'Set to 5% brightness',
        icon: 'Sun',
        settings: { brightness: 5 }
      }
    ]
  }
];

export const mockCategories = [
  'Sleep & Rest',
  'Battery & Power', 
  'Productivity',
  'Home Automation',
  'Transportation',
  'Communication',
  'Security',
  'Entertainment'
];

export const mockPermissions: Record<string, string> = {
  'AUDIO_SETTINGS': 'Modify audio settings and volume',
  'BRIGHTNESS_CONTROL': 'Control screen brightness',
  'NOTIFICATION_ACCESS': 'Read and modify notifications',
  'BATTERY_STATS': 'Access battery information',
  'WIFI_CONTROL': 'Control WiFi connection',
  'BLUETOOTH_CONTROL': 'Control Bluetooth connection',
  'LOCATION_CONTROL': 'Disable location services',
  'APP_USAGE_ACCESS': 'Monitor and control app usage',
  'DO_NOT_DISTURB': 'Control Do Not Disturb settings',
  'LOCATION_ACCESS': 'Access device location',
  'INTERNET_ACCESS': 'Connect to the internet',
  'SMS_ACCESS': 'Read and send text messages',
  'CALL_ACCESS': 'Make and receive phone calls',
  'MOTION_SENSORS': 'Access motion and activity sensors',
  'CALENDAR_ACCESS': 'Read calendar events',
  'BLUE_LIGHT_FILTER': 'Control blue light filter settings',
  'BACKGROUND_RESTRICTION': 'Restrict background app activity',
  'APP_LAUNCH': 'Launch and control applications',
  'HEALTH_SENSORS': 'Access health and fitness sensors',
  'SYNC_CONTROL': 'Control account sync settings'
};
