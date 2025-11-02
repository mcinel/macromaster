import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Alert, AlertDescription } from './ui/alert';
import { realExecutor } from '../utils/real-executor';
import { androidBridge } from '../utils/android-bridge';
import { RefreshCw, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

/**
 * ExecutionModeDebugger Component
 * 
 * This component helps debug and verify execution mode functionality.
 * It displays current settings, tests execution modes, and shows results.
 */
export function ExecutionModeDebugger() {
  const [currentMode, setCurrentMode] = useState<string>('demo');
  const [androidAvailable, setAndroidAvailable] = useState(false);
  const [testResults, setTestResults] = useState<any[]>([]);

  const loadCurrentMode = () => {
    const savedSettings = localStorage.getItem('automation-app-settings');
    if (savedSettings) {
      const settings = JSON.parse(savedSettings);
      setCurrentMode(settings.executionMode || 'demo');
    }
    setAndroidAvailable(androidBridge.isAvailable());
  };

  useEffect(() => {
    loadCurrentMode();
  }, []);

  const runTest = async (actionType: string, actionName: string) => {
    console.log(`🧪 Testing ${actionName} in ${currentMode} mode`);
    
    // Set the executor to current mode
    realExecutor.setMode(currentMode as any);
    
    const testStep = {
      id: `test_${Date.now()}`,
      type: 'action' as const,
      title: actionName,
      description: `Test ${actionName}`,
      order: 1,
      parameters: {
        level: 50,
        message: 'Test notification',
        duration: 200
      }
    };

    try {
      const result = await realExecutor.executeStep(testStep);
      console.log(`🧪 Test result for ${actionName}:`, result);
      
      setTestResults(prev => [{
        action: actionName,
        mode: currentMode,
        success: result.success,
        message: result.message,
        timestamp: new Date().toISOString()
      }, ...prev.slice(0, 9)]); // Keep last 10 results

      return result;
    } catch (error) {
      console.error(`🧪 Test error for ${actionName}:`, error);
      setTestResults(prev => [{
        action: actionName,
        mode: currentMode,
        success: false,
        message: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      }, ...prev.slice(0, 9)]);
    }
  };

  const getStorageInfo = () => {
    const settings = localStorage.getItem('automation-app-settings');
    return settings ? JSON.parse(settings) : {};
  };

  const getModeColor = (mode: string) => {
    switch (mode) {
      case 'demo': return 'bg-purple-100 text-purple-800 border-purple-300';
      case 'web': return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'hybrid': return 'bg-green-100 text-green-800 border-green-300';
      case 'android': return 'bg-orange-100 text-orange-800 border-orange-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getModeIcon = (mode: string) => {
    switch (mode) {
      case 'demo': return '🎭';
      case 'web': return '🌐';
      case 'hybrid': return '⚡';
      case 'android': return '📱';
      default: return '❓';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-purple-50 dark:from-slate-900 dark:to-purple-900 p-4">
      <div className="max-w-2xl mx-auto space-y-4">
        {/* Header */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              🔧 Execution Mode Debugger
              <Button size="sm" variant="outline" onClick={loadCurrentMode}>
                <RefreshCw className="w-4 h-4" />
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Current Mode */}
            <div>
              <label className="text-sm font-medium mb-2 block">Current Execution Mode</label>
              <Badge className={`text-sm px-4 py-2 ${getModeColor(currentMode)}`}>
                {getModeIcon(currentMode)} {currentMode.toUpperCase()}
              </Badge>
            </div>

            {/* Android Bridge Status */}
            <div>
              <label className="text-sm font-medium mb-2 block">Android Bridge</label>
              <Badge variant={androidAvailable ? "default" : "secondary"}>
                {androidAvailable ? <CheckCircle className="w-4 h-4 mr-1" /> : <XCircle className="w-4 h-4 mr-1" />}
                {androidAvailable ? 'Available' : 'Not Available'}
              </Badge>
            </div>

            {/* LocalStorage Info */}
            <div>
              <label className="text-sm font-medium mb-2 block">LocalStorage Settings</label>
              <pre className="text-xs bg-slate-100 dark:bg-slate-800 p-3 rounded overflow-auto max-h-40">
                {JSON.stringify(getStorageInfo(), null, 2)}
              </pre>
            </div>
          </CardContent>
        </Card>

        {/* Test Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Test Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="grid grid-cols-2 gap-2">
              <Button onClick={() => runTest('show_notification', 'Send Notification')} size="sm">
                🔔 Notification
              </Button>
              <Button onClick={() => runTest('vibrate', 'Vibrate Device')} size="sm">
                📳 Vibrate
              </Button>
              <Button onClick={() => runTest('set_volume', 'Set Volume')} size="sm">
                🔊 Set Volume
              </Button>
              <Button onClick={() => runTest('set_brightness', 'Set Brightness')} size="sm">
                ☀️ Brightness
              </Button>
              <Button onClick={() => runTest('toggle_wifi', 'Toggle WiFi')} size="sm">
                📶 WiFi
              </Button>
              <Button onClick={() => runTest('toggle_bluetooth', 'Toggle Bluetooth')} size="sm">
                🔵 Bluetooth
              </Button>
            </div>
            
            <Alert>
              <AlertCircle className="w-4 h-4" />
              <AlertDescription className="text-xs">
                {currentMode === 'demo' && 'Demo mode: All actions will be simulated'}
                {currentMode === 'web' && 'Web mode: Only Notification and Vibrate will work'}
                {currentMode === 'hybrid' && !androidAvailable && 'Hybrid mode: Falling back to Web APIs (Android bridge not available)'}
                {currentMode === 'hybrid' && androidAvailable && 'Hybrid mode: Using Android bridge'}
                {currentMode === 'android' && !androidAvailable && 'Android mode: Will fail (bridge not available)'}
                {currentMode === 'android' && androidAvailable && 'Android mode: Full native execution'}
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>

        {/* Test Results */}
        {testResults.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Test Results
                <Button size="sm" variant="outline" onClick={() => setTestResults([])}>
                  Clear
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {testResults.map((result, index) => (
                  <div 
                    key={index}
                    className={`p-3 rounded border ${
                      result.success 
                        ? 'bg-green-50 border-green-200 dark:bg-green-900/20' 
                        : 'bg-red-50 border-red-200 dark:bg-red-900/20'
                    }`}
                  >
                    <div className="flex items-start gap-2">
                      {result.success ? (
                        <CheckCircle className="w-4 h-4 text-green-600 mt-0.5" />
                      ) : (
                        <XCircle className="w-4 h-4 text-red-600 mt-0.5" />
                      )}
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-sm">{result.action}</span>
                          <Badge className={`text-xs ${getModeColor(result.mode)}`}>
                            {getModeIcon(result.mode)}
                          </Badge>
                        </div>
                        <p className="text-xs text-slate-600 dark:text-slate-400">{result.message}</p>
                        <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                          {new Date(result.timestamp).toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Instructions */}
        <Card>
          <CardHeader>
            <CardTitle>How to Use</CardTitle>
          </CardHeader>
          <CardContent className="text-sm space-y-2">
            <ol className="list-decimal list-inside space-y-1">
              <li>Go to Settings and change the Execution Mode</li>
              <li>Return here and click the refresh button</li>
              <li>Click any test action button</li>
              <li>Check the console (F12) for detailed logs</li>
              <li>View results below</li>
            </ol>
            <p className="text-xs text-slate-500 mt-4">
              💡 Tip: Open browser console (F12) to see emoji indicators like 🚀, 📝, ⚡, 📱, 🌐
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
