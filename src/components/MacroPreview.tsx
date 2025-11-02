import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { Alert, AlertDescription } from './ui/alert';
import { Switch } from './ui/switch';
import { Macro } from '../App';
import { ArrowLeft, Play, Save, Shield, AlertTriangle, CheckCircle, Settings, ExternalLink } from 'lucide-react';
import { mockPermissions } from './data/mockData';
import { PermissionManager, usePermissions } from './PermissionManager';
import { getUnsupportedStepsForAndroid } from '../utils/shared-constants';

interface MacroPreviewProps {
  macro: Macro;
  explanation?: string;
  confidence?: number;
  onSave: () => void;
  onBack: () => void;
}

export function MacroPreview({ macro, explanation, confidence, onSave, onBack }: MacroPreviewProps) {
  const [isEnabled, setIsEnabled] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<'success' | 'error' | null>(null);
  const [selectedPermission, setSelectedPermission] = useState<string | null>(null);
  const [unsupportedStepsInAndroid, setUnsupportedStepsInAndroid] = useState<string[]>([]);
  
  const { 
    getPermissionStatus, 
    updatePermission, 
    areAllPermissionsGranted, 
    getPendingPermissions 
  } = usePermissions();

  // Check for unsupported steps in Android mode
  useEffect(() => {
    const unsupported = getUnsupportedStepsForAndroid(macro.steps);
    setUnsupportedStepsInAndroid(unsupported);
  }, [macro]);

  const handleTest = async () => {
    const pendingPermissions = getPendingPermissions(macro.permissions);
    
    if (pendingPermissions.length > 0) {
      setTestResult('error');
      return;
    }
    
    setIsTesting(true);
    setTestResult(null);
    
    // Simulate macro testing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Higher success rate if all permissions are granted
    const allPermissionsGranted = areAllPermissionsGranted(macro.permissions);
    const success = allPermissionsGranted ? Math.random() > 0.1 : Math.random() > 0.5;
    setTestResult(success ? 'success' : 'error');
    setIsTesting(false);
  };

  const handlePermissionClick = (permission: string) => {
    setSelectedPermission(permission);
  };

  const handlePermissionChange = (permission: string, status: 'granted' | 'denied') => {
    updatePermission(permission, status);
  };

  const allPermissionsGranted = areAllPermissionsGranted(macro.permissions);
  const pendingPermissions = getPendingPermissions(macro.permissions);

  const getStepIcon = (iconName: string) => {
    // Map icon names to actual Lucide components
    const iconMap: Record<string, any> = {
      'Clock': '⏰', 'Battery': '🔋', 'Wifi': '📶', 'Bluetooth': '🔵', 'Bell': '🔔', 'Volume2': '🔊', 'VolumeX': '🔇',
      'Sun': '☀️', 'Moon': '🌙', 'Smartphone': '📱', 'Car': '🚗', 'Home': '🏠', 'Briefcase': '💼', 'Shield': '🛡️',
      'Zap': '⚡', 'Settings': '⚙️', 'Phone': '📞', 'MessageSquare': '💬', 'Calendar': '📅', 'Camera': '📷',
      'MapPin': '📍', 'Headphones': '🎧', 'Play': '▶️', 'Pause': '⏸️', 'User': '👤', 'Lock': '🔒', 'Unlock': '🔓',
      'Eye': '👁️', 'EyeOff': '🙈', 'Lightbulb': '💡', 'Thermometer': '🌡️', 'Sunrise': '🌅', 'BellOff': '🔕',
      'Mic': '🎤', 'Target': '🎯'
    };
    return iconMap[iconName] || '⚙️';
  };

  const getStepColor = (type: string) => {
    switch (type) {
      case 'trigger': return 'bg-blue-100 border-blue-200 text-blue-800';
      case 'condition': return 'bg-yellow-100 border-yellow-200 text-yellow-800';
      case 'action': return 'bg-green-100 border-green-200 text-green-800';
      default: return 'bg-gray-100 border-gray-200 text-gray-800';
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="outline" size="sm" onClick={onBack}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <div className="flex-1">
          <h1 className="text-2xl font-semibold">{macro.name}</h1>
          <p className="text-muted-foreground">{macro.description}</p>
        </div>
        <Badge variant="outline">{macro.category}</Badge>
      </div>

      {/* AI Explanation */}
      {explanation && (
        <Alert>
          <CheckCircle className="h-4 w-4" />
          <AlertDescription>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="font-medium">AI Analysis:</span>
                {confidence && (
                  <Badge variant={confidence > 0.8 ? "default" : "secondary"}>
                    {Math.round(confidence * 100)}% confidence
                  </Badge>
                )}
              </div>
              <p>{explanation}</p>
            </div>
          </AlertDescription>
        </Alert>
      )}

      {/* Android Mode Compatibility Warning */}
      {unsupportedStepsInAndroid.length > 0 && (
        <Alert className="border-amber-200 bg-amber-50 dark:bg-amber-900/20">
          <AlertTriangle className="h-4 w-4 text-amber-600" />
          <AlertDescription>
            <div className="space-y-2">
              <div className="font-medium text-amber-900 dark:text-amber-100">
                Limited Android Native Mode Support
              </div>
              <p className="text-sm text-amber-800 dark:text-amber-200">
                This macro contains <strong>{unsupportedStepsInAndroid.length}</strong> step(s) that cannot run in Android native mode:
              </p>
              <ul className="text-sm text-amber-800 dark:text-amber-200 list-disc list-inside space-y-1">
                {unsupportedStepsInAndroid.slice(0, 3).map((step, i) => (
                  <li key={i}>{step}</li>
                ))}
                {unsupportedStepsInAndroid.length > 3 && (
                  <li>+{unsupportedStepsInAndroid.length - 3} more...</li>
                )}
              </ul>
              <p className="text-xs text-amber-700 dark:text-amber-300 mt-2">
                💡 Use <strong>Demo</strong> mode to preview, or <strong>Web/Hybrid</strong> mode for partial functionality.
              </p>
            </div>
          </AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Macro Steps */}
        <Card>
          <CardHeader>
            <CardTitle>Macro Steps</CardTitle>
            <CardDescription>
              This macro will execute the following steps in order
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {macro.steps.map((step, index) => {
              const isUnsupported = unsupportedStepsInAndroid.includes(step.title);
              return (
              <div key={step.id} className={`p-4 rounded-lg border ${getStepColor(step.type)} ${isUnsupported ? 'border-amber-400 dark:border-amber-600 relative' : ''}`}>
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 rounded-full bg-white/50 flex items-center justify-center">
                      <span className="text-lg">{getStepIcon(step.icon)}</span>
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs uppercase tracking-wider font-medium">
                        {step.type}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        Step {index + 1}
                      </span>
                      {isUnsupported && (
                        <Badge variant="outline" className="text-xs bg-amber-100 dark:bg-amber-900/30 border-amber-400 dark:border-amber-600 text-amber-800 dark:text-amber-200">
                          <AlertTriangle className="w-3 h-3 mr-1" />
                          Not supported in Android
                        </Badge>
                      )}
                    </div>
                    <h4 className="font-medium">{step.title}</h4>
                    <p className="text-sm opacity-90">{step.description}</p>
                    {Object.keys(step.settings).length > 0 && (
                      <div className="mt-2 text-xs">
                        <details className="cursor-pointer">
                          <summary className="font-medium">Settings</summary>
                          <pre className="mt-1 p-2 bg-white/30 rounded text-xs overflow-auto">
                            {JSON.stringify(step.settings, null, 2)}
                          </pre>
                        </details>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              );
            })}
          </CardContent>
        </Card>

        {/* Settings & Permissions */}
        <div className="space-y-6">
          {/* Macro Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5" />
                Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <label className="font-medium">Enable Macro</label>
                  <p className="text-sm text-muted-foreground">
                    Activate this macro to run automatically
                  </p>
                </div>
                <Switch checked={isEnabled} onCheckedChange={setIsEnabled} />
              </div>
              
              <Separator />
              
              <div className="space-y-2">
                <label className="font-medium">Category</label>
                <Badge variant="secondary">{macro.category}</Badge>
              </div>
            </CardContent>
          </Card>

          {/* Required Permissions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  Required Permissions
                </div>
                <Badge variant={allPermissionsGranted ? "default" : "secondary"}>
                  {macro.permissions.length - pendingPermissions.length} / {macro.permissions.length} granted
                </Badge>
              </CardTitle>
              <CardDescription>
                This macro needs the following system permissions to function. Click on any permission to configure it.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {!allPermissionsGranted && (
                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    {pendingPermissions.length} permission(s) need to be granted before this macro can run properly.
                  </AlertDescription>
                </Alert>
              )}
              
              {macro.permissions.map((permission) => {
                const status = getPermissionStatus(permission);
                return (
                  <button
                    key={permission}
                    onClick={() => handlePermissionClick(permission)}
                    className="w-full flex items-start gap-3 p-3 border rounded-lg hover:border-primary/50 hover:bg-accent/50 transition-colors cursor-pointer group"
                  >
                    <div className="flex-shrink-0 mt-0.5">
                      {status === 'granted' ? (
                        <CheckCircle className="w-4 h-4 text-green-500" />
                      ) : status === 'denied' ? (
                        <AlertTriangle className="w-4 h-4 text-red-500" />
                      ) : (
                        <AlertTriangle className="w-4 h-4 text-amber-500" />
                      )}
                    </div>
                    <div className="flex-1 text-left">
                      <div className="flex items-center gap-2">
                        <div className="font-medium text-sm">{permission}</div>
                        <Badge variant={
                          status === 'granted' ? 'default' : 
                          status === 'denied' ? 'destructive' : 'secondary'
                        } className="text-xs">
                          {status === 'granted' ? 'Granted' : 
                           status === 'denied' ? 'Denied' : 'Not Set'}
                        </Badge>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {mockPermissions[permission] || 'System permission required'}
                      </div>
                    </div>
                    <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                  </button>
                );
              })}
            </CardContent>
          </Card>

          {/* Test Macro */}
          <Card>
            <CardHeader>
              <CardTitle>Test Macro</CardTitle>
              <CardDescription>
                Run a test to verify the macro works correctly
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button 
                onClick={handleTest} 
                disabled={isTesting || pendingPermissions.length > 0}
                variant="outline"
                className="w-full"
              >
                {isTesting ? (
                  <>
                    <Settings className="w-4 h-4 mr-2 animate-spin" />
                    Testing Macro...
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 mr-2" />
                    Run Test
                  </>
                )}
              </Button>

              {testResult && (
                <Alert variant={testResult === 'success' ? 'default' : 'destructive'}>
                  <AlertDescription>
                    {testResult === 'success' ? (
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4" />
                        Test completed successfully! Macro is ready to use.
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4" />
                        Test failed. {pendingPermissions.length > 0 
                          ? `Please grant ${pendingPermissions.length} pending permission(s) first.`
                          : 'Please check permissions and settings.'}
                      </div>
                    )}
                  </AlertDescription>
                </Alert>
              )}
              
              {pendingPermissions.length > 0 && (
                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    Grant all required permissions above before testing this macro.
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Save Actions */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-4">
            <Button onClick={onSave} size="lg" className="flex-1">
              <Save className="w-4 h-4 mr-2" />
              Save Macro
            </Button>
            <Button variant="outline" size="lg" onClick={() => {
              // Update macro enabled state
              macro.isEnabled = isEnabled;
              onSave();
            }}>
              Save & {isEnabled ? 'Enable' : 'Keep Disabled'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Permission Manager Dialog */}
      {selectedPermission && (
        <PermissionManager
          permission={selectedPermission}
          isOpen={!!selectedPermission}
          onClose={() => setSelectedPermission(null)}
          onPermissionChange={handlePermissionChange}
          currentStatus={getPermissionStatus(selectedPermission)}
        />
      )}
    </div>
  );
}