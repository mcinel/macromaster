import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Alert, AlertDescription } from './ui/alert';
import { Macro, MacroStep } from '../App';
import { Play, Pause, Square, CheckCircle, AlertCircle, Clock, Zap, Shield, Smartphone, Wifi, Battery, Volume2, Sun, Bell, Settings, AlertTriangle } from 'lucide-react';
import { toast } from "sonner@2.0.3";
import { apiClient } from '../utils/api-client';
import { realExecutor } from '../utils/real-executor';
import { getUnsupportedStepsForAndroid } from '../utils/shared-constants';

interface MacroRunnerProps {
  macro: Macro | null;
  onRecordRun?: (id: string) => Promise<void>;
  onExecutionStart?: (macroId: string) => void;
  onExecutionEnd?: (macroId: string) => void;
  onSetCancelCallback?: (callback: (() => Promise<void>) | null) => void;
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

interface PermissionInfo {
  name: string;
  displayName: string;
  description: string;
  category: string;
  dangerLevel: 'normal' | 'dangerous' | 'signature';
  granted?: boolean;
}

export function MacroRunner({ macro, onRecordRun, onExecutionStart, onExecutionEnd, onSetCancelCallback }: MacroRunnerProps) {
  const [execution, setExecution] = useState<MacroExecution | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [executionId, setExecutionId] = useState<string | null>(null);
  const [permissions, setPermissions] = useState<PermissionInfo[]>([]);
  const [missingPermissions, setMissingPermissions] = useState<PermissionInfo[]>([]);
  const [allPermissionsGranted, setAllPermissionsGranted] = useState(false);
  const [deviceCapabilities, setDeviceCapabilities] = useState<any>(null);
  const [currentExecutionMode, setCurrentExecutionMode] = useState<string>('demo');
  const [unsupportedSteps, setUnsupportedSteps] = useState<string[]>([]);

  // Poll for execution updates
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    // Only poll for server executions (demo_exec_* or server executions)
    // Skip local executions (local_exec_*)
    if (executionId && isRunning && !executionId.startsWith('local_exec_')) {
      console.log('🔄 MacroRunner: Starting polling for execution:', executionId);
      
      interval = setInterval(async () => {
        try {
          const executionData = await apiClient.getExecutionStatus(executionId);
          setExecution(executionData);
          
          // Update running state based on execution status
          if (['completed', 'failed', 'cancelled'].includes(executionData.status)) {
            setIsRunning(false);
            clearInterval(interval);
            console.log('✅ MacroRunner: Execution finished:', executionData.status);
            
            // Notify parent that execution ended
            if (onExecutionEnd && macro?.id) {
              onExecutionEnd(macro.id);
            }
            
            if (executionData.status === 'completed') {
              toast.success('Macro execution completed successfully!');
            } else if (executionData.status === 'failed') {
              toast.error(`Macro execution failed: ${executionData.error || 'Unknown error'}`);
            } else if (executionData.status === 'cancelled') {
              toast.info('Macro execution was cancelled');
            }
          }
        } catch (error) {
          console.error('❌ Error polling execution status:', error);
          // Don't stop polling on error - the execution might still be running
        }
      }, 1000);
    }
    
    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [executionId, isRunning]);

  // Load device capabilities and permissions on mount
  useEffect(() => {
    loadDeviceCapabilities();
    loadPermissions();
    
    // Load current execution mode
    const savedSettings = localStorage.getItem('automation-app-settings');
    if (savedSettings) {
      const settings = JSON.parse(savedSettings);
      setCurrentExecutionMode(settings.executionMode || 'demo');
    }
  }, []);

  // Check macro permissions when macro changes
  useEffect(() => {
    if (macro) {
      checkMacroPermissions();
    }
  }, [macro]);

  // Set/clear cancel callback when execution state changes
  useEffect(() => {
    if (isRunning && onSetCancelCallback) {
      onSetCancelCallback(cancelExecution);
    } else if (!isRunning && onSetCancelCallback) {
      onSetCancelCallback(null);
    }
  }, [isRunning, onSetCancelCallback]);

  // Check for unsupported steps in Android mode
  useEffect(() => {
    if (macro && currentExecutionMode === 'android') {
      const unsupported = getUnsupportedStepsForAndroid(macro.steps);
      setUnsupportedSteps(unsupported);
      
      if (unsupported.length > 0) {
        console.warn('⚠️ Unsupported steps in Android mode:', unsupported);
      }
    } else {
      setUnsupportedSteps([]);
    }
  }, [macro, currentExecutionMode]);

  const loadDeviceCapabilities = async () => {
    try {
      const capabilities = await apiClient.getDeviceCapabilities();
      setDeviceCapabilities(capabilities);
    } catch (error) {
      console.error('Error loading device capabilities:', error);
    }
  };

  const loadPermissions = async () => {
    try {
      const data = await apiClient.getPermissions();
      setPermissions(data.permissions);
    } catch (error) {
      console.error('Error loading permissions:', error);
    }
  };

  const checkMacroPermissions = async () => {
    if (!macro) return;
    
    try {
      const result = await apiClient.checkMacroPermissions(macro);
      setAllPermissionsGranted(result.allGranted);
      setMissingPermissions(result.missing);
    } catch (error) {
      console.error('Error checking macro permissions:', error);
    }
  };

  const requestPermissions = async () => {
    if (!macro || missingPermissions.length === 0) return;
    
    try {
      const permissionNames = missingPermissions.map(p => p.name);
      const result = await apiClient.requestMultiplePermissions(permissionNames);
      const grantedCount = Object.values(result.results).filter(Boolean).length;
      
      if (grantedCount > 0) {
        toast.success(`${grantedCount} permission(s) granted successfully!`);
        await checkMacroPermissions(); // Recheck permissions
      } else {
        toast.error('No permissions were granted. Please enable them in Android settings.');
      }
    } catch (error) {
      console.error('Error requesting permissions:', error);
      toast.error('Failed to request permissions');
    }
  };

  const runMacro = async () => {
    if (!macro || isRunning || !allPermissionsGranted) return;

    try {
      // Get execution mode from settings
      const savedSettings = localStorage.getItem('automation-app-settings');
      const executionMode = savedSettings ? (JSON.parse(savedSettings).executionMode || 'demo') : 'demo';
      realExecutor.setMode(executionMode);
      
      // Update visual indicator
      setCurrentExecutionMode(executionMode);
      
      console.log('🎯 MacroRunner: Executing macro in mode:', executionMode);

      // For demo mode, use server execution (existing behavior)
      if (executionMode === 'demo') {
        const result = await apiClient.executeMacro(macro);
        setExecutionId(result.executionId);
        setIsRunning(true);
        setExecution(null);
        
        // Notify parent that execution started
        if (onExecutionStart && macro.id) {
          onExecutionStart(macro.id);
        }
        
        toast.success('Macro execution started in demo mode!');
        
        if (onRecordRun && macro.id) {
          await onRecordRun(macro.id);
        }
        return;
      }

      // For real execution modes (web, hybrid, android), execute locally
      const execId = `local_exec_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      setExecutionId(execId);
      setIsRunning(true);
      
      // Notify parent that execution started
      if (onExecutionStart && macro.id) {
        onExecutionStart(macro.id);
      }
      
      const execution: MacroExecution = {
        id: execId,
        macroId: macro.id || '',
        status: 'running',
        currentStep: 0,
        totalSteps: macro.steps.length,
        progress: 0,
        log: [`Started ${executionMode} execution at ${new Date().toISOString()}`],
        startTime: new Date().toISOString()
      };
      setExecution(execution);

      toast.success(`Macro execution started in ${executionMode} mode!`, {
        description: executionMode === 'web' ? 'Using browser APIs' : 
                     executionMode === 'android' ? 'Using Android native APIs' :
                     'Using best available APIs'
      });

      // Execute each step
      for (let i = 0; i < macro.steps.length; i++) {
        const step = macro.steps[i];
        
        execution.currentStep = i + 1;
        execution.progress = ((i + 1) / macro.steps.length) * 100;
        execution.log.push(`Executing step ${i + 1}: ${step.title}`);
        setExecution({ ...execution });

        try {
          console.log(`📌 MacroRunner: About to execute step ${i + 1}:`, {
            title: step.title,
            type: step.type,
            mode: executionMode,
            executorMode: realExecutor.getMode()
          });
          
          const result = await realExecutor.executeStep(step);
          
          console.log(`📌 MacroRunner: Step ${i + 1} result:`, result);
          
          if (result.success) {
            execution.log.push(`✓ ${step.title}: ${result.message}`);
          } else {
            execution.log.push(`✗ ${step.title}: ${result.message}`);
            toast.warning(`Step ${i + 1} failed`, { description: result.message });
          }
        } catch (error) {
          const errorMsg = error instanceof Error ? error.message : String(error);
          execution.log.push(`✗ ${step.title}: Error - ${errorMsg}`);
          toast.error(`Step ${i + 1} error`, { description: errorMsg });
        }

        setExecution({ ...execution });
        
        // Small delay between steps
        await new Promise(resolve => setTimeout(resolve, 500));
      }

      // Mark as completed
      execution.status = 'completed';
      execution.endTime = new Date().toISOString();
      execution.log.push(`Completed ${executionMode} execution at ${execution.endTime}`);
      setExecution({ ...execution });
      setIsRunning(false);
      
      // Notify parent that execution ended
      if (onExecutionEnd && macro.id) {
        onExecutionEnd(macro.id);
      }
      
      toast.success('Macro execution completed!');
      
      if (onRecordRun && macro.id) {
        await onRecordRun(macro.id);
      }

    } catch (error) {
      console.error('Error starting macro execution:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      
      setIsRunning(false);
      
      // Notify parent that execution ended (with error)
      if (onExecutionEnd && macro.id) {
        onExecutionEnd(macro.id);
      }
      
      if (errorMessage.includes('Missing required permissions')) {
        toast.error('Missing required permissions');
        await checkMacroPermissions();
      } else {
        toast.error(`Failed to start macro: ${errorMessage}`);
      }
    }
  };

  const cancelExecution = async () => {
    if (!executionId) return;
    
    try {
      // Check if it's a local execution
      if (executionId.startsWith('local_exec_')) {
        // Local execution - just update state
        if (execution) {
          execution.status = 'cancelled';
          execution.endTime = new Date().toISOString();
          execution.log.push(`Execution cancelled at ${execution.endTime}`);
          setExecution({ ...execution });
        }
        setIsRunning(false);
        
        // Notify parent that execution ended (cancelled)
        if (onExecutionEnd && macro?.id) {
          onExecutionEnd(macro.id);
        }
        
        toast.info('Macro execution cancelled');
      } else {
        // Server execution - call API
        await apiClient.cancelExecution(executionId);
        setIsRunning(false);
        
        // Notify parent that execution ended (cancelled)
        if (onExecutionEnd && macro?.id) {
          onExecutionEnd(macro.id);
        }
        toast.info('Macro execution cancelled');
      }
    } catch (error) {
      console.error('Error cancelling execution:', error);
      toast.error('Failed to cancel execution');
    }
  };

  const resetExecution = () => {
    setExecution(null);
    setExecutionId(null);
    setIsRunning(false);
  };

  const getActionIcon = (stepTitle: string) => {
    const title = stepTitle.toLowerCase();
    if (title.includes('volume') || title.includes('audio')) return Volume2;
    if (title.includes('brightness') || title.includes('screen')) return Sun;
    if (title.includes('wifi')) return Wifi;
    if (title.includes('battery')) return Battery;
    if (title.includes('notification') || title.includes('disturb')) return Bell;
    return Settings;
  };

  if (!macro) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-orange-50 dark:from-slate-900 dark:to-orange-900 overflow-x-hidden">
        {/* Header */}
        <div className="relative overflow-hidden px-4 pt-6 pb-4">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 via-indigo-600/10 to-cyan-600/10 animate-pulse-slow"></div>
          <div className="relative text-center w-full max-w-sm mx-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-full border shadow-sm mb-3">
              <Smartphone className="w-3 h-3 text-orange-600" />
              <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
                Android Execution
              </span>
            </div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
              Run Your Macros
            </h1>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Execute your automation macros with real-time monitoring
            </p>
          </div>
        </div>
        
        <div className="w-full max-w-sm mx-auto px-4 pt-4">
          <Card className="border-0 shadow-xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
            <CardContent className="py-12 text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-orange-100 to-red-100 dark:from-orange-900/30 dark:to-red-900/30 flex items-center justify-center">
                <Play className="w-8 h-8 text-orange-500" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                No Macro Selected
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Select a macro from the Dashboard or Library to run it here
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-orange-50 dark:from-slate-900 dark:to-orange-900 overflow-x-hidden">
      {/* Header */}
      <div className="relative overflow-hidden px-4 pt-6 pb-4">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 via-indigo-600/10 to-cyan-600/10 animate-pulse-slow"></div>
        <div className="relative text-center w-full max-w-sm mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-full border shadow-sm mb-3">
            <Smartphone className="w-3 h-3 text-orange-600" />
            <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
              Android Execution
            </span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
            {macro.name}
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-3">
            {macro.description}
          </p>
          <div className="flex items-center justify-center gap-2 flex-wrap">
            <Badge variant="outline" className="text-xs">{macro.category}</Badge>
            <Badge variant={macro.isEnabled ? "default" : "secondary"} className="text-xs">
              {macro.isEnabled ? "Enabled" : "Disabled"}
            </Badge>
            <Badge 
              variant="outline" 
              className={`text-xs ${
                currentExecutionMode === 'demo' ? 'bg-purple-50 dark:bg-purple-900/20 border-purple-300' :
                currentExecutionMode === 'web' ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-300' :
                currentExecutionMode === 'hybrid' ? 'bg-green-50 dark:bg-green-900/20 border-green-300' :
                'bg-orange-50 dark:bg-orange-900/20 border-orange-300'
              }`}
            >
              {currentExecutionMode === 'demo' ? '🎭 Demo' :
               currentExecutionMode === 'web' ? '🌐 Web' :
               currentExecutionMode === 'hybrid' ? '⚡ Hybrid' :
               '📱 Android'}
            </Badge>
          </div>
        </div>
      </div>

      <div className="w-full max-w-sm mx-auto px-4 pb-6 pt-4 space-y-4">

        {/* Device Status */}
        {deviceCapabilities && (
          <Card className="border-0 shadow-xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg">
                  <Smartphone className="w-4 h-4 text-white" />
                </div>
                <div>
                  <CardTitle className="text-lg">Device Status</CardTitle>
                  <CardDescription className="text-sm">Android execution environment</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="text-slate-600 dark:text-slate-400">Android:</span>
                  <div className="font-medium">{deviceCapabilities.android?.version}</div>
                </div>
                <div>
                  <span className="text-slate-600 dark:text-slate-400">API Level:</span>
                  <div className="font-medium">{deviceCapabilities.android?.apiLevel}</div>
                </div>
              </div>
              <div className="text-sm">
                <span className="text-slate-600 dark:text-slate-400">Supported Actions:</span>
                <div className="font-medium">{deviceCapabilities.supportedActions?.length || 0}</div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Permission Status */}
        <Card className="border-0 shadow-xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <div className={`p-2 rounded-lg ${allPermissionsGranted 
                ? 'bg-gradient-to-r from-emerald-500 to-green-600' 
                : 'bg-gradient-to-r from-amber-500 to-orange-600'}`}>
                <Shield className="w-4 h-4 text-white" />
              </div>
              <div>
                <CardTitle className="text-lg">Permissions</CardTitle>
                <CardDescription className="text-sm">
                  {allPermissionsGranted ? 'All permissions granted' : `${missingPermissions.length} permission(s) needed`}
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {!allPermissionsGranted && missingPermissions.length > 0 && (
              <>
                <Alert className="border-amber-200 bg-amber-50 dark:bg-amber-900/20">
                  <AlertCircle className="h-4 w-4 text-amber-600" />
                  <AlertDescription className="text-sm">
                    This macro requires additional permissions to function properly.
                  </AlertDescription>
                </Alert>
                
                <div className="space-y-2">
                  {missingPermissions.slice(0, 3).map((permission) => (
                    <div key={permission.name} className="p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                      <div className="font-medium text-sm text-slate-900 dark:text-white">
                        {permission.displayName}
                      </div>
                      <div className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                        {permission.description}
                      </div>
                      <Badge 
                        variant={permission.dangerLevel === 'dangerous' ? 'destructive' : 'secondary'} 
                        className="text-xs mt-2"
                      >
                        {permission.dangerLevel}
                      </Badge>
                    </div>
                  ))}
                  {missingPermissions.length > 3 && (
                    <div className="text-xs text-slate-500 text-center">
                      +{missingPermissions.length - 3} more permissions
                    </div>
                  )}
                </div>
                
                <Button 
                  onClick={requestPermissions}
                  className="w-full bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white"
                  size="sm"
                >
                  Grant Permissions
                </Button>
              </>
            )}
            
            {allPermissionsGranted && (
              <div className="flex items-center gap-2 text-sm text-emerald-600 dark:text-emerald-400">
                <CheckCircle className="w-4 h-4" />
                <span>All required permissions granted</span>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Android Mode Unsupported Actions Warning */}
        {currentExecutionMode === 'android' && unsupportedSteps.length > 0 && (
          <Card className="border-0 shadow-xl bg-red-50/80 dark:bg-red-900/20 backdrop-blur-sm border-red-200 dark:border-red-800">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-gradient-to-r from-red-500 to-rose-600 rounded-lg">
                  <AlertTriangle className="w-4 h-4 text-white" />
                </div>
                <div>
                  <CardTitle className="text-lg text-red-900 dark:text-red-100">Unsupported Actions in Android Mode</CardTitle>
                  <CardDescription className="text-sm text-red-700 dark:text-red-300">
                    Some actions cannot run in Android native mode
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <Alert className="border-red-200 bg-red-50 dark:bg-red-900/30 dark:border-red-800">
                <AlertTriangle className="h-4 w-4 text-red-600 dark:text-red-400" />
                <AlertDescription className="text-sm text-red-800 dark:text-red-200">
                  The following steps are not supported in Android native mode. Switch to Demo, Web, or Hybrid mode to test this macro.
                </AlertDescription>
              </Alert>
              
              <div className="space-y-2">
                {unsupportedSteps.map((stepTitle, index) => (
                  <div key={index} className="p-3 bg-red-100 dark:bg-red-900/30 rounded-lg border border-red-200 dark:border-red-800">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-red-600 dark:text-red-400 flex-shrink-0" />
                      <div className="font-medium text-sm text-red-900 dark:text-red-100">
                        {stepTitle}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="text-xs text-red-700 dark:text-red-300 bg-red-100/50 dark:bg-red-900/20 p-3 rounded-lg">
                <strong>Note:</strong> Time triggers and audio control actions require system-level access that is not available through web-based Android bridges. Use Demo mode to preview functionality or Web/Hybrid mode for partial execution.
              </div>
            </CardContent>
          </Card>
        )}

        {/* Execution Controls */}
        <Card className="border-0 shadow-xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
          <CardContent className="p-4">
            {!isRunning ? (
              <div className="flex gap-2">
                <Button 
                  onClick={runMacro} 
                  disabled={!macro.isEnabled || !allPermissionsGranted || (currentExecutionMode === 'android' && unsupportedSteps.length > 0)}
                  className="flex-1 bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white"
                >
                  <Play className="w-4 h-4 mr-2" />
                  {currentExecutionMode === 'android' && unsupportedSteps.length > 0 ? 'Cannot Run in Android Mode' : 'Run Macro'}
                </Button>
                
                {execution && (
                  <Button onClick={resetExecution} variant="outline">
                    Reset
                  </Button>
                )}
              </div>
            ) : (
              <Button 
                onClick={cancelExecution} 
                className="w-full bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 text-white"
              >
                <Square className="w-4 h-4 mr-2 fill-current" />
                Stop Macro
              </Button>
            )}
          </CardContent>
        </Card>

        {/* Execution Status */}
        {execution && (
          <Card className="border-0 shadow-xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-lg">
                  <Zap className="w-4 h-4 text-white" />
                </div>
                <div>
                  <CardTitle className="text-lg">Execution Status</CardTitle>
                  <CardDescription className="text-sm capitalize">
                    {execution.status}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Progress</span>
                  <span>{execution.currentStep} of {execution.totalSteps} steps</span>
                </div>
                <Progress value={execution.progress} className="h-2" />
              </div>
              
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="text-slate-600 dark:text-slate-400">Status:</span>
                  <div className="font-medium capitalize">{execution.status}</div>
                </div>
                <div>
                  <span className="text-slate-600 dark:text-slate-400">Duration:</span>
                  <div className="font-medium">
                    {execution.endTime 
                      ? `${((new Date(execution.endTime).getTime() - new Date(execution.startTime).getTime()) / 1000).toFixed(1)}s`
                      : `${((Date.now() - new Date(execution.startTime).getTime()) / 1000).toFixed(1)}s`
                    }
                  </div>
                </div>
              </div>

              {execution.error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription className="text-sm">
                    {execution.error}
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        )}

        {/* Execution Log */}
        {execution && execution.log.length > 0 && (
          <Card className="border-0 shadow-xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Execution Log</CardTitle>
              <CardDescription className="text-sm">
                Real-time execution details
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="max-h-48 overflow-y-auto space-y-2">
                {execution.log.map((logEntry, index) => (
                  <div key={index} className="text-sm p-2 bg-slate-50 dark:bg-slate-700/50 rounded">
                    <div className="flex items-start gap-2">
                      <Clock className="w-3 h-3 mt-0.5 text-slate-400 flex-shrink-0" />
                      <span className="leading-relaxed break-words">{logEntry}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Macro Steps Preview */}
        <Card className="border-0 shadow-xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Macro Steps</CardTitle>
            <CardDescription className="text-sm">
              {macro.steps.length} step(s) will be executed
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {macro.steps.map((step, index) => {
              const StepIcon = getActionIcon(step.title);
              const isCurrentStep = execution && execution.currentStep === index + 1;
              const isCompleted = execution && execution.currentStep > index + 1;
              
              return (
                <div 
                  key={step.id} 
                  className={`p-3 rounded-lg border-2 transition-all ${
                    isCurrentStep ? 'border-blue-300 bg-blue-50 dark:bg-blue-900/20' :
                    isCompleted ? 'border-green-300 bg-green-50 dark:bg-green-900/20' :
                    'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-700/50'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`p-1.5 rounded-lg ${
                      isCurrentStep ? 'bg-blue-500' :
                      isCompleted ? 'bg-green-500' :
                      'bg-slate-400'
                    }`}>
                      <StepIcon className="w-3 h-3 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant="outline" className="text-xs uppercase">
                          {step.type}
                        </Badge>
                        <span className="text-xs text-slate-500">Step {index + 1}</span>
                      </div>
                      <h4 className="font-medium text-sm text-slate-900 dark:text-white break-words">
                        {step.title}
                      </h4>
                      <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed break-words">
                        {step.description}
                      </p>
                    </div>
                    {isCurrentStep && <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse flex-shrink-0 mt-1" />}
                    {isCompleted && <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-1" />}
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}