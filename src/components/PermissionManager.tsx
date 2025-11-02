import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Switch } from './ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Separator } from './ui/separator';
import { Alert, AlertDescription } from './ui/alert';
import { Settings, CheckCircle, AlertTriangle, ArrowLeft, Smartphone, Shield } from 'lucide-react';
import { toast } from "sonner@2.0.3";
import { apiClient } from '../utils/api-client';

interface PermissionStatus {
  [key: string]: 'granted' | 'denied' | 'pending';
}

interface AndroidPermission {
  name: string;
  displayName: string;
  description: string;
  category: string;
  dangerLevel: 'normal' | 'dangerous' | 'signature';
  granted?: boolean;
}

interface PermissionManagerProps {
  permission: string;
  isOpen: boolean;
  onClose: () => void;
  onPermissionChange: (permission: string, status: 'granted' | 'denied') => void;
  currentStatus: 'granted' | 'denied' | 'pending';
}

// Legacy permission mappings for backward compatibility
const legacyPermissionMappings: Record<string, string> = {
  'AUDIO_SETTINGS': 'MODIFY_AUDIO_SETTINGS',
  'BRIGHTNESS_CONTROL': 'WRITE_SETTINGS',
  'NOTIFICATION_ACCESS': 'BIND_NOTIFICATION_LISTENER_SERVICE',
  'BATTERY_STATS': 'BATTERY_STATS',
  'WIFI_CONTROL': 'CHANGE_WIFI_STATE',
  'BLUETOOTH_CONTROL': 'BLUETOOTH_ADMIN',
  'LOCATION_ACCESS': 'ACCESS_FINE_LOCATION',
  'DO_NOT_DISTURB': 'ACCESS_NOTIFICATION_POLICY',
  'APP_USAGE_ACCESS': 'PACKAGE_USAGE_STATS',
  'SMS_ACCESS': 'SEND_SMS',
  'CALL_ACCESS': 'CALL_PHONE',
  'MOTION_SENSORS': 'ACCESS_FINE_LOCATION'
};

export function PermissionManager({ 
  permission, 
  isOpen, 
  onClose, 
  onPermissionChange, 
  currentStatus 
}: PermissionManagerProps) {
  const [isSimulatingSettings, setIsSimulatingSettings] = useState(false);
  const [tempStatus, setTempStatus] = useState<'granted' | 'denied'>('denied');
  const [permissionInfo, setPermissionInfo] = useState<AndroidPermission | null>(null);
  const [isRequestingPermission, setIsRequestingPermission] = useState(false);
  
  useEffect(() => {
    if (currentStatus !== 'pending') {
      setTempStatus(currentStatus);
    }
  }, [currentStatus]);

  useEffect(() => {
    if (permission && isOpen) {
      loadPermissionInfo();
    }
  }, [permission, isOpen]);

  const loadPermissionInfo = async () => {
    try {
      const data = await apiClient.getPermissions();
      const androidPermissionName = legacyPermissionMappings[permission] || permission;
      const info = data.permissions.find((p: AndroidPermission) => p.name === androidPermissionName);
      
      if (info) {
        setPermissionInfo(info);
      }
    } catch (error) {
      console.error('Error loading permission info:', error);
    }
  };

  const handleRequestPermission = async () => {
    if (!permissionInfo) return;
    
    setIsRequestingPermission(true);
    
    try {
      const result = await apiClient.requestPermission(permissionInfo.name);
      
      if (result.granted) {
        setTempStatus('granted');
        onPermissionChange(permission, 'granted');
        toast.success(`Permission granted: ${permissionInfo.displayName}`);
      } else {
        setTempStatus('denied');
        onPermissionChange(permission, 'denied');
        toast.error(`Permission denied: ${result.message}`);
      }
    } catch (error) {
      console.error('Error requesting permission:', error);
      toast.error('Failed to request permission');
    } finally {
      setIsRequestingPermission(false);
    }
  };

  const handleOpenSettings = () => {
    setIsSimulatingSettings(true);
  };

  const handleBackFromSettings = () => {
    setIsSimulatingSettings(false);
    onPermissionChange(permission, tempStatus);
  };

  const handlePermissionToggle = (granted: boolean) => {
    setTempStatus(granted ? 'granted' : 'denied');
  };

  const getDangerLevelColor = (level: string) => {
    switch (level) {
      case 'dangerous':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300';
      case 'signature':
        return 'bg-amber-100 text-amber-800 dark:bg-amber-900/20 dark:text-amber-300';
      default:
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300';
    }
  };

  const getDangerLevelIcon = (level: string) => {
    switch (level) {
      case 'dangerous':
        return '⚠️';
      case 'signature':
        return '🔒';
      default:
        return '✅';
    }
  };

  if (!permissionInfo) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-md mx-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Settings className="w-5 h-5" />
              Loading Permission Info...
            </DialogTitle>
          </DialogHeader>
          <div className="py-8 text-center">
            <div className="animate-spin w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full mx-auto"></div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md mx-auto max-h-[90vh] overflow-y-auto">
        {!isSimulatingSettings ? (
          // Permission Request Screen
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Android Permission Required
              </DialogTitle>
              <DialogDescription>
                This macro requires system-level permissions to function
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-3 text-lg">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold">
                      {getDangerLevelIcon(permissionInfo.dangerLevel)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="break-words">{permissionInfo.displayName}</div>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant={currentStatus === 'granted' ? 'default' : 'secondary'} className="text-xs">
                          {currentStatus === 'granted' ? 'Granted' : 
                           currentStatus === 'denied' ? 'Denied' : 'Not Set'}
                        </Badge>
                        <Badge className={`text-xs ${getDangerLevelColor(permissionInfo.dangerLevel)}`}>
                          {permissionInfo.dangerLevel}
                        </Badge>
                      </div>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed break-words">
                    {permissionInfo.description}
                  </p>

                  <Separator />

                  <div>
                    <h4 className="text-sm font-semibold mb-2 text-blue-700 dark:text-blue-400">
                      📱 Category: {permissionInfo.category}
                    </h4>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      This permission allows the app to interact with {permissionInfo.category.toLowerCase()} features on your Android device.
                    </p>
                  </div>

                  {permissionInfo.dangerLevel === 'dangerous' && (
                    <Alert variant="destructive">
                      <AlertTriangle className="h-4 w-4" />
                      <AlertDescription className="text-sm">
                        This is a sensitive permission that requires explicit user consent. It allows access to private information or device controls.
                      </AlertDescription>
                    </Alert>
                  )}

                  {permissionInfo.dangerLevel === 'signature' && (
                    <Alert className="border-amber-200 bg-amber-50 dark:bg-amber-900/20">
                      <AlertTriangle className="h-4 w-4 text-amber-600" />
                      <AlertDescription className="text-sm">
                        This permission requires system-level access or special app configuration. It may not be available on all devices.
                      </AlertDescription>
                    </Alert>
                  )}

                  {currentStatus !== 'granted' && (
                    <Alert className="border-blue-200 bg-blue-50 dark:bg-blue-900/20">
                      <Settings className="h-4 w-4 text-blue-600" />
                      <AlertDescription className="text-sm">
                        This permission is required for the macro to work properly. Tap "Request Permission" to grant access.
                      </AlertDescription>
                    </Alert>
                  )}
                </CardContent>
              </Card>

              <div className="flex gap-3">
                <Button variant="outline" onClick={onClose} className="flex-1">
                  Cancel
                </Button>
                <Button 
                  onClick={handleRequestPermission}
                  className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white"
                  disabled={currentStatus === 'granted' || isRequestingPermission}
                >
                  {isRequestingPermission ? (
                    <>
                      <div className="w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Requesting...
                    </>
                  ) : currentStatus === 'granted' ? (
                    <>
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Already Granted
                    </>
                  ) : (
                    <>
                      <Shield className="w-4 h-4 mr-2" />
                      Request Permission
                    </>
                  )}
                </Button>
              </div>

              <Button 
                variant="outline" 
                onClick={handleOpenSettings}
                className="w-full text-sm"
                size="sm"
              >
                <Settings className="w-4 h-4 mr-2" />
                Advanced: Simulate Android Settings
              </Button>
            </div>
          </>
        ) : (
          // Simulated Android Settings Screen
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Smartphone className="w-5 h-5" />
                Android Settings
              </DialogTitle>
              <DialogDescription className="text-xs text-slate-500">
                App Permissions → MacroMaster → {permissionInfo.displayName}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <Alert className="border-amber-200 bg-amber-50 dark:bg-amber-900/20">
                <AlertTriangle className="h-4 w-4 text-amber-600" />
                <AlertDescription className="text-xs">
                  Simulated Android Settings - In a real app, this would open your device settings
                </AlertDescription>
              </Alert>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-base">
                    <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                      <Settings className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    </div>
                    MacroMaster
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm break-words">{permissionInfo.displayName}</div>
                      <div className="text-xs text-slate-600 dark:text-slate-400 mt-1 break-words">
                        {permissionInfo.description}
                      </div>
                      <Badge className={`text-xs mt-2 ${getDangerLevelColor(permissionInfo.dangerLevel)}`}>
                        {permissionInfo.dangerLevel} level
                      </Badge>
                    </div>
                    <Switch 
                      checked={tempStatus === 'granted'}
                      onCheckedChange={handlePermissionToggle}
                    />
                  </div>

                  {tempStatus === 'granted' ? (
                    <Alert>
                      <CheckCircle className="h-4 w-4" />
                      <AlertDescription className="text-sm">
                        Permission granted. MacroMaster can now access {permissionInfo.displayName.toLowerCase()}.
                      </AlertDescription>
                    </Alert>
                  ) : (
                    <Alert variant="destructive">
                      <AlertTriangle className="h-4 w-4" />
                      <AlertDescription className="text-sm">
                        Permission denied. Some macro features may not work properly.
                      </AlertDescription>
                    </Alert>
                  )}
                </CardContent>
              </Card>

              <Button onClick={handleBackFromSettings} className="w-full">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Return to MacroMaster
              </Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}

// Hook for managing permissions (updated to work with backend)
export function usePermissions() {
  const [permissions, setPermissions] = useState<PermissionStatus>({});
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    loadPermissions();
  }, []);

  const loadPermissions = async () => {
    try {
      const data = await apiClient.getPermissions();
      const permissionStatus: PermissionStatus = {};
      
      // Map granted permissions
      data.granted.forEach((permission: string) => {
        permissionStatus[permission] = 'granted';
      });
      
      // Set all other known permissions as pending
      data.permissions.forEach((perm: AndroidPermission) => {
        if (!permissionStatus[perm.name]) {
          permissionStatus[perm.name] = 'pending';
        }
      });
      
      setPermissions(permissionStatus);
      setIsLoaded(true);
    } catch (error) {
      console.error('Error loading permissions:', error);
      setIsLoaded(true);
    }
  };

  const updatePermission = (permission: string, status: 'granted' | 'denied') => {
    setPermissions(prev => ({
      ...prev,
      [permission]: status
    }));
  };

  const getPermissionStatus = (permission: string): 'granted' | 'denied' | 'pending' => {
    const androidPermissionName = legacyPermissionMappings[permission] || permission;
    return permissions[androidPermissionName] || 'pending';
  };

  const areAllPermissionsGranted = (requiredPermissions: string[]): boolean => {
    return requiredPermissions.every(permission => {
      const androidPermissionName = legacyPermissionMappings[permission] || permission;
      return permissions[androidPermissionName] === 'granted';
    });
  };

  const getPendingPermissions = (requiredPermissions: string[]): string[] => {
    return requiredPermissions.filter(permission => {
      const androidPermissionName = legacyPermissionMappings[permission] || permission;
      return permissions[androidPermissionName] !== 'granted';
    });
  };

  return {
    permissions,
    updatePermission,
    getPermissionStatus,
    areAllPermissionsGranted,
    getPendingPermissions,
    isLoaded
  };
}