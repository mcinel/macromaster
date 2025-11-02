import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Switch } from './ui/switch';
import { Button } from './ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Separator } from './ui/separator';
import { Badge } from './ui/badge';
import { Alert, AlertDescription } from './ui/alert';
import { LogoShowcase } from './LogoShowcase';
import { ExecutionModeDebugger } from './ExecutionModeDebugger';
import { 
  Moon, 
  Sun, 
  Bell, 
  Shield, 
  Download, 
  Upload, 
  Trash2, 
  Info, 
  Zap, 
  Clock, 
  RefreshCw, 
  Database,
  Smartphone,
  Wifi,
  Battery,
  Volume2,
  Palette,
  Settings as SettingsIcon
} from 'lucide-react';
import { toast } from "sonner@2.0.3";

export function Settings() {
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [autoRunEnabled, setAutoRunEnabled] = useState(true);
  const [executionTimeout, setExecutionTimeout] = useState('30');
  const [retryAttempts, setRetryAttempts] = useState('3');
  const [logLevel, setLogLevel] = useState('info');
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [vibrationEnabled, setVibrationEnabled] = useState(true);
  const [backgroundExecution, setBackgroundExecution] = useState(false);
  const [dataUsage, setDataUsage] = useState('wifi-only');
  const [executionMode, setExecutionMode] = useState('hybrid');
  const [showLogoShowcase, setShowLogoShowcase] = useState(false);
  const [showDebugger, setShowDebugger] = useState(false);

  // Load settings from localStorage on component mount
  useEffect(() => {
    const savedSettings = localStorage.getItem('automation-app-settings');
    if (savedSettings) {
      const settings = JSON.parse(savedSettings);
      setDarkMode(settings.darkMode ?? false);
      setNotifications(settings.notifications ?? true);
      setAutoRunEnabled(settings.autoRunEnabled ?? true);
      setExecutionTimeout(settings.executionTimeout ?? '30');
      setRetryAttempts(settings.retryAttempts ?? '3');
      setLogLevel(settings.logLevel ?? 'info');
      setSoundEnabled(settings.soundEnabled ?? true);
      setVibrationEnabled(settings.vibrationEnabled ?? true);
      setBackgroundExecution(settings.backgroundExecution ?? false);
      setDataUsage(settings.dataUsage ?? 'wifi-only');
      setExecutionMode(settings.executionMode ?? 'hybrid');
    }

    // Apply dark mode class
    const isDark = darkMode || (savedSettings && JSON.parse(savedSettings).darkMode);
    if (isDark) {
      document.documentElement.classList.add('dark');
    }
  }, []);

  // Save settings to localStorage whenever they change
  const saveSettings = (newSettings: any) => {
    const currentSettings = {
      darkMode,
      notifications,
      autoRunEnabled,
      executionTimeout,
      retryAttempts,
      logLevel,
      soundEnabled,
      vibrationEnabled,
      backgroundExecution,
      executionMode,
      dataUsage,
      ...newSettings
    };
    localStorage.setItem('automation-app-settings', JSON.stringify(currentSettings));
  };

  const handleDarkModeToggle = (enabled: boolean) => {
    setDarkMode(enabled);
    if (enabled) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    saveSettings({ darkMode: enabled });
    toast.success(enabled ? 'Dark mode enabled' : 'Light mode enabled');
  };

  const handleExportData = () => {
    try {
      const data = {
        settings: JSON.parse(localStorage.getItem('automation-app-settings') || '{}'),
        macros: JSON.parse(localStorage.getItem('saved-macros') || '[]'),
        executionHistory: JSON.parse(localStorage.getItem('execution-history') || '[]'),
        exportDate: new Date().toISOString()
      };
      
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `automation-backup-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast.success('Data exported successfully');
    } catch (error) {
      toast.error('Failed to export data');
    }
  };

  const handleImportData = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          try {
            const data = JSON.parse(e.target?.result as string);
            
            if (data.settings) {
              localStorage.setItem('automation-app-settings', JSON.stringify(data.settings));
            }
            if (data.macros) {
              localStorage.setItem('saved-macros', JSON.stringify(data.macros));
            }
            if (data.executionHistory) {
              localStorage.setItem('execution-history', JSON.stringify(data.executionHistory));
            }
            
            toast.success('Data imported successfully. Please refresh the page.');
          } catch (error) {
            toast.error('Invalid backup file format');
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  const handleClearData = () => {
    if (confirm('Are you sure you want to clear all app data? This action cannot be undone.')) {
      localStorage.removeItem('automation-app-settings');
      localStorage.removeItem('saved-macros');
      localStorage.removeItem('execution-history');
      toast.success('All data cleared. Please refresh the page.');
    }
  };

  const getStorageUsage = () => {
    const total = JSON.stringify(localStorage).length;
    return `${(total / 1024).toFixed(1)} KB`;
  };

  if (showLogoShowcase) {
    return (
      <div className="relative">
        <Button
          onClick={() => setShowLogoShowcase(false)}
          variant="outline"
          className="fixed top-4 left-4 z-50"
        >
          ← Back to Settings
        </Button>
        <LogoShowcase />
      </div>
    );
  }

  if (showDebugger) {
    return (
      <div className="relative">
        <Button
          onClick={() => setShowDebugger(false)}
          variant="outline"
          className="fixed top-4 left-4 z-50"
        >
          ← Back to Settings
        </Button>
        <ExecutionModeDebugger />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-slate-50 dark:from-slate-900 dark:via-gray-900 dark:to-slate-900 overflow-x-hidden">
      {/* Header */}
      <div className="relative overflow-hidden px-4 pt-6 pb-4">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 via-indigo-600/10 to-cyan-600/10 animate-pulse-slow"></div>
        <div className="relative text-center w-full max-w-sm mx-auto">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
            Settings
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            Configure your automation experience and app preferences
          </p>
        </div>
      </div>

      <div className="w-full max-w-sm mx-auto px-4 pb-6 pt-4 space-y-4">

        {/* Appearance */}
        <Card className="border-0 shadow-xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {darkMode ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
            Appearance
          </CardTitle>
          <CardDescription>Customize the app's visual appearance</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium">Dark Mode</label>
              <p className="text-xs text-muted-foreground">Switch between light and dark themes</p>
            </div>
            <Switch checked={darkMode} onCheckedChange={handleDarkModeToggle} />
          </div>
        </CardContent>
      </Card>

        {/* Notifications */}
        <Card className="border-0 shadow-xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="w-5 h-5" />
            Notifications
          </CardTitle>
          <CardDescription>Manage notification preferences</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium">Push Notifications</label>
              <p className="text-xs text-muted-foreground">Receive notifications about macro execution</p>
            </div>
            <Switch 
              checked={notifications} 
              onCheckedChange={(checked) => {
                setNotifications(checked);
                saveSettings({ notifications: checked });
                toast.success(checked ? 'Notifications enabled' : 'Notifications disabled');
              }} 
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium">Sound Alerts</label>
              <p className="text-xs text-muted-foreground">Play sounds for macro completion</p>
            </div>
            <Switch 
              checked={soundEnabled} 
              onCheckedChange={(checked) => {
                setSoundEnabled(checked);
                saveSettings({ soundEnabled: checked });
              }} 
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium">Vibration</label>
              <p className="text-xs text-muted-foreground">Vibrate device for notifications</p>
            </div>
            <Switch 
              checked={vibrationEnabled} 
              onCheckedChange={(checked) => {
                setVibrationEnabled(checked);
                saveSettings({ vibrationEnabled: checked });
              }} 
            />
          </div>
        </CardContent>
      </Card>

        {/* Execution Settings */}
        <Card className="border-0 shadow-xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="w-5 h-5" />
            Execution Settings
          </CardTitle>
          <CardDescription>Configure how macros are executed</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium">Auto-Run Enabled</label>
              <p className="text-xs text-muted-foreground">Allow macros to run automatically when triggered</p>
            </div>
            <Switch 
              checked={autoRunEnabled} 
              onCheckedChange={(checked) => {
                setAutoRunEnabled(checked);
                saveSettings({ autoRunEnabled: checked });
              }} 
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium">Background Execution</label>
              <p className="text-xs text-muted-foreground">Run macros when app is in background</p>
            </div>
            <Switch 
              checked={backgroundExecution} 
              onCheckedChange={(checked) => {
                setBackgroundExecution(checked);
                saveSettings({ backgroundExecution: checked });
              }} 
            />
          </div>
          <Separator />
          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-2">
              <Smartphone className="w-4 h-4" />
              Execution Mode
            </label>
            <Select 
              value={executionMode} 
              onValueChange={(value) => {
                setExecutionMode(value);
                saveSettings({ executionMode: value });
                
                const modeMessages: Record<string, string> = {
                  demo: 'Demo mode: Actions are simulated',
                  web: 'Web mode: Using browser APIs (limited)',
                  hybrid: 'Hybrid mode: All macros compatible with smart fallbacks',
                  android: 'Android mode: Full native execution'
                };
                
                toast.success('Execution mode changed', {
                  description: modeMessages[value]
                });
              }}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="demo">
                  <div className="flex items-center gap-2">
                    <span>🎭 Demo (Simulated)</span>
                  </div>
                </SelectItem>
                <SelectItem value="web">
                  <div className="flex items-center gap-2">
                    <span>🌐 Web APIs (Limited)</span>
                  </div>
                </SelectItem>
                <SelectItem value="hybrid">
                  <div className="flex items-center gap-2">
                    <span>⚡ Hybrid (Recommended)</span>
                  </div>
                </SelectItem>
                <SelectItem value="android">
                  <div className="flex items-center gap-2">
                    <span>📱 Android Native (Full)</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
            <Alert className="mt-2">
              <Info className="w-4 h-4" />
              <AlertDescription className="text-xs">
                {executionMode === 'demo' && 'All actions are simulated. No real changes are made to your device.'}
                {executionMode === 'web' && 'Uses browser APIs. Limited functionality but works in any browser.'}
                {executionMode === 'hybrid' && (
                  <div className="space-y-1">
                    <p className="text-emerald-700 dark:text-emerald-300">✨ Recommended: All macros work with smart fallbacks.</p>
                    <p>Uses Android native APIs when available, falls back to Web APIs, and simulates unsupported actions to ensure every macro completes successfully.</p>
                  </div>
                )}
                {executionMode === 'android' && (
                  <div className="space-y-1">
                    <p>Full Android automation. Requires native app wrapper.</p>
                    <p className="text-amber-700 dark:text-amber-300 font-medium">⚠️ Note: Time triggers and audio control actions are not supported in Android mode.</p>
                  </div>
                )}
              </AlertDescription>
            </Alert>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setShowDebugger(true)} 
              className="w-full flex items-center gap-2 mt-2"
            >
              <SettingsIcon className="w-4 h-4" />
              Test Execution Modes
            </Button>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Execution Timeout
            </label>
            <Select 
              value={executionTimeout} 
              onValueChange={(value) => {
                setExecutionTimeout(value);
                saveSettings({ executionTimeout: value });
              }}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="10">10 seconds</SelectItem>
                <SelectItem value="30">30 seconds</SelectItem>
                <SelectItem value="60">1 minute</SelectItem>
                <SelectItem value="300">5 minutes</SelectItem>
                <SelectItem value="600">10 minutes</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-2">
              <RefreshCw className="w-4 h-4" />
              Retry Attempts
            </label>
            <Select 
              value={retryAttempts} 
              onValueChange={(value) => {
                setRetryAttempts(value);
                saveSettings({ retryAttempts: value });
              }}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0">No retries</SelectItem>
                <SelectItem value="1">1 retry</SelectItem>
                <SelectItem value="3">3 retries</SelectItem>
                <SelectItem value="5">5 retries</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

        {/* Privacy & Security */}
        <Card className="border-0 shadow-xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Privacy & Security
          </CardTitle>
          <CardDescription>Manage permissions and security settings</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-2">
              <Wifi className="w-4 h-4" />
              Data Usage
            </label>
            <Select 
              value={dataUsage} 
              onValueChange={(value) => {
                setDataUsage(value);
                saveSettings({ dataUsage: value });
              }}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="wifi-only">Wi-Fi only</SelectItem>
                <SelectItem value="cellular-allowed">Allow cellular data</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Alert>
            <Shield className="w-4 h-4" />
            <AlertDescription>
              This app requires device permissions to automate tasks. Review permissions in your device settings.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

        {/* Advanced Settings */}
        <Card className="border-0 shadow-xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="w-5 h-5" />
            Advanced Settings
          </CardTitle>
          <CardDescription>Advanced configuration options</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Log Level</label>
            <Select 
              value={logLevel} 
              onValueChange={(value) => {
                setLogLevel(value);
                saveSettings({ logLevel: value });
              }}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="error">Error only</SelectItem>
                <SelectItem value="warn">Warnings</SelectItem>
                <SelectItem value="info">Info</SelectItem>
                <SelectItem value="debug">Debug</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

        {/* Data Management */}
        <Card className="border-0 shadow-xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="w-5 h-5" />
            Data Management
          </CardTitle>
          <CardDescription>Backup, restore, and manage your data</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium">Storage Used</label>
              <p className="text-xs text-muted-foreground">{getStorageUsage()} of local storage</p>
            </div>
            <Badge variant="secondary">{getStorageUsage()}</Badge>
          </div>
          <Separator />
          <div className="grid grid-cols-1 gap-3">
            <Button variant="outline" onClick={handleExportData} className="flex items-center gap-2">
              <Download className="w-4 h-4" />
              Export Data
            </Button>
            <Button variant="outline" onClick={handleImportData} className="flex items-center gap-2">
              <Upload className="w-4 h-4" />
              Import Data
            </Button>
            <Button variant="destructive" onClick={handleClearData} className="flex items-center gap-2">
              <Trash2 className="w-4 h-4" />
              Clear All Data
            </Button>
          </div>
        </CardContent>
      </Card>

        {/* Design System */}
        <Card className="border-0 shadow-xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="w-5 h-5" />
            App Design
          </CardTitle>
          <CardDescription>Visual design and branding elements</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button 
            variant="outline" 
            onClick={() => setShowLogoShowcase(true)} 
            className="w-full flex items-center gap-2"
          >
            <Palette className="w-4 h-4" />
            View Logo & Design System
          </Button>
          <p className="text-xs text-muted-foreground">
            Explore the complete logo variations, design philosophy, and usage guidelines for MacroMaster.
          </p>
        </CardContent>
      </Card>

        {/* About */}
        <Card className="border-0 shadow-xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Info className="w-5 h-5" />
            About
          </CardTitle>
          <CardDescription>App information and version details</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm">Version</span>
            <Badge>1.0.0</Badge>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm">Build</span>
            <Badge variant="secondary">2024.01</Badge>
          </div>
          <Separator />
          <p className="text-xs text-muted-foreground">
            AI-powered automation app for Android devices. Create, manage, and execute custom macros with natural language.
          </p>
        </CardContent>
      </Card>
      </div>
    </div>
  );
}