import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs';
import { MacroCreator } from './components/MacroCreator';
import { MacroLibrary } from './components/MacroLibrary';
import { Dashboard } from './components/Dashboard';
import { MacroRunner } from './components/MacroRunner';
import { Settings as SettingsComponent } from './components/Settings';
import { OnboardingLanding } from './components/OnboardingLanding';
import { Toaster } from './components/ui/sonner';
import { Bot, Home, Library, Play, Settings, Loader2 } from 'lucide-react';
import { toast } from "sonner@2.0.3";
import { macroService } from './utils/macro-service';
import { mockMacros } from './components/data/mockData';

export interface MacroStep {
  id: string;
  type: 'trigger' | 'condition' | 'action';
  title: string;
  description: string;
  settings: Record<string, any>;
  icon: string;
}

export interface Macro {
  id: string;
  name: string;
  description: string;
  category: string;
  steps: MacroStep[];
  permissions: string[];
  isEnabled: boolean;
  createdAt: string;
  lastRun?: string;
  runCount: number;
}

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedMacro, setSelectedMacro] = useState<Macro | null>(null);
  const [macroTemplate, setMacroTemplate] = useState<Partial<Macro> | null>(null);
  const [showOnboarding, setShowOnboarding] = useState(() => {
    return !localStorage.getItem('macromaster-onboarded');
  });
  
  // Centralized macro state - single source of truth
  const [macros, setMacros] = useState<Macro[]>([]);
  const [isLoadingMacros, setIsLoadingMacros] = useState(true);
  const [macrosError, setMacrosError] = useState<string | null>(null);
  const [runningMacroIds, setRunningMacroIds] = useState<Set<string>>(new Set());
  const [cancelExecutionCallback, setCancelExecutionCallback] = useState<(() => Promise<void>) | null>(null);

  // Load macros from server on mount
  useEffect(() => {
    loadMacros();
  }, []);

  const loadMacros = async () => {
    setIsLoadingMacros(true);
    setMacrosError(null);

    const response = await macroService.getAllMacros();

    if (response.success && response.data) {
      if (response.data.length === 0) {
        // Initialize with default macros if none exist
        await initializeDefaultMacros();
      } else {
        setMacros(response.data);
      }
    } else {
      setMacrosError(response.error || 'Failed to load macros');
      toast.error('Failed to load macros', {
        description: response.error || 'Please try again'
      });
    }

    setIsLoadingMacros(false);
  };

  const initializeDefaultMacros = async () => {
    console.log('Initializing default macros...', mockMacros.length, 'macros');
    const response = await macroService.initializeDefaultMacros(mockMacros);

    if (response.success) {
      console.log('Default macros initialized successfully');
      setMacros(mockMacros);
      toast.success('Welcome to MacroMaster!', {
        description: `${response.data?.count || mockMacros.length} default macros loaded`
      });
    } else {
      console.error('Failed to initialize default macros:', response.error);
      setMacrosError(response.error || 'Failed to initialize macros');
      // Fallback to local state - still functional but not persisted
      setMacros(mockMacros);
      toast.warning('Running in offline mode', {
        description: 'Your macros will not persist across sessions'
      });
    }
  };

  const handleCreateMacro = async (macro: Macro) => {
    const response = await macroService.createMacro(macro);

    if (response.success && response.data) {
      setMacros(prev => [...prev, response.data!]);
      toast.success('Macro created successfully', {
        description: macro.name
      });
      return true;
    } else {
      toast.error('Failed to create macro', {
        description: response.error || 'Please try again'
      });
      return false;
    }
  };

  const handleUpdateMacro = async (id: string, updates: Partial<Macro>) => {
    const response = await macroService.updateMacro(id, updates);

    if (response.success && response.data) {
      setMacros(prev => prev.map(m => m.id === id ? response.data! : m));
      
      // Update selected macro if it's the one being updated
      if (selectedMacro?.id === id) {
        setSelectedMacro(response.data);
      }
      
      return true;
    } else {
      toast.error('Failed to update macro', {
        description: response.error || 'Please try again'
      });
      return false;
    }
  };

  const handleDeleteMacro = async (id: string) => {
    const response = await macroService.deleteMacro(id);

    if (response.success) {
      setMacros(prev => prev.filter(m => m.id !== id));
      toast.success('Macro deleted', {
        description: 'Macro has been removed from your library'
      });
      return true;
    } else {
      toast.error('Failed to delete macro', {
        description: response.error || 'Please try again'
      });
      return false;
    }
  };

  const handleToggleMacro = async (id: string) => {
    const macro = macros.find(m => m.id === id);
    if (!macro) return false;

    return await handleUpdateMacro(id, { isEnabled: !macro.isEnabled });
  };

  const handleRecordMacroRun = async (id: string) => {
    // Find the macro in local state first
    const macro = macros.find(m => m.id === id);
    if (!macro) {
      console.error('Macro not found in local state:', id);
      return;
    }

    const response = await macroService.recordMacroRun(id);

    if (response.success && response.data) {
      setMacros(prev => prev.map(m => m.id === id ? response.data! : m));
      
      // Update selected macro if it's the one being run
      if (selectedMacro?.id === id) {
        setSelectedMacro(response.data);
      }
    } else {
      // If server fails, update locally
      const updatedMacro = {
        ...macro,
        runCount: macro.runCount + 1,
        lastRun: new Date().toISOString().split('T')[0]
      };
      setMacros(prev => prev.map(m => m.id === id ? updatedMacro : m));
      
      if (selectedMacro?.id === id) {
        setSelectedMacro(updatedMacro);
      }
    }
  };

  const handleRunMacro = async (macro: Macro) => {
    setSelectedMacro(macro);
    setActiveTab('runner');
    // Don't record the run here - let MacroRunner do it when execution actually starts
  };

  const handleMacroExecutionStart = (macroId: string) => {
    setRunningMacroIds(prev => new Set(prev).add(macroId));
  };

  const handleMacroExecutionEnd = (macroId: string) => {
    setRunningMacroIds(prev => {
      const newSet = new Set(prev);
      newSet.delete(macroId);
      return newSet;
    });
  };

  const handleStopMacro = async (macroId: string) => {
    if (cancelExecutionCallback) {
      await cancelExecutionCallback();
    } else {
      toast.error('Unable to stop macro - no active execution found');
    }
  };

  const handleSetCancelCallback = (callback: (() => Promise<void>) | null) => {
    setCancelExecutionCallback(() => callback);
  };

  const handleLoadTemplate = (template?: Partial<Macro>) => {
    if (template) {
      setMacroTemplate(template);
      toast.success(`Quick Action template loaded: ${template.name}`, {
        description: 'Review and customize your macro template'
      });
    }
    setActiveTab('creator');
  };

  const handleCompleteOnboarding = () => {
    localStorage.setItem('macromaster-onboarded', 'true');
    setShowOnboarding(false);
  };

  if (showOnboarding) {
    return <OnboardingLanding onComplete={handleCompleteOnboarding} />;
  }

  // Loading state
  if (isLoadingMacros) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50 dark:from-slate-900 dark:to-indigo-900 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-purple-600 mx-auto mb-4" />
          <p className="text-slate-600 dark:text-slate-400">Loading your macros...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50 dark:from-slate-900 dark:to-indigo-900 overflow-x-hidden">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-white/20 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md">
          <div className="w-full max-w-2xl mx-auto px-4 py-3">
            <TabsList className="grid w-full grid-cols-5 h-16 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-white/20 dark:border-slate-700/50 rounded-2xl">
              <TabsTrigger 
                value="dashboard" 
                className="flex flex-col items-center gap-1.5 data-[state=active]:text-indigo-600 dark:data-[state=active]:text-indigo-400 transition-all duration-300 rounded-xl"
              >
                <Home className="w-6 h-6" />
                <span className="text-sm font-medium">Home</span>
              </TabsTrigger>
              <TabsTrigger 
                value="creator" 
                className="flex flex-col items-center gap-1.5 data-[state=active]:text-emerald-600 dark:data-[state=active]:text-emerald-400 transition-all duration-300 rounded-xl"
              >
                <Bot className="w-6 h-6" />
                <span className="text-sm font-medium">Create</span>
              </TabsTrigger>
              <TabsTrigger 
                value="library" 
                className="flex flex-col items-center gap-1.5 data-[state=active]:text-purple-600 dark:data-[state=active]:text-purple-400 transition-all duration-300 rounded-xl"
              >
                <Library className="w-6 h-6" />
                <span className="text-sm font-medium">Library</span>
              </TabsTrigger>
              <TabsTrigger 
                value="runner" 
                className="flex flex-col items-center gap-1.5 data-[state=active]:text-orange-600 dark:data-[state=active]:text-orange-400 transition-all duration-300 rounded-xl"
              >
                <Play className="w-6 h-6" />
                <span className="text-sm font-medium">Run</span>
              </TabsTrigger>
              <TabsTrigger 
                value="settings" 
                className="flex flex-col items-center gap-1.5 data-[state=active]:text-slate-700 dark:data-[state=active]:text-slate-300 transition-all duration-300 rounded-xl"
              >
                <Settings className="w-6 h-6" />
                <span className="text-sm font-medium">Settings</span>
              </TabsTrigger>
            </TabsList>
          </div>
        </div>

        <TabsContent value="dashboard" className="mt-0 pb-20">
          <Dashboard 
            macros={macros}
            onRunMacro={handleRunMacro} 
            onCreateMacro={handleLoadTemplate} 
          />
        </TabsContent>

        <TabsContent value="creator" className="mt-0 pb-20">
          <MacroCreator 
            template={macroTemplate} 
            onTemplateUsed={() => setMacroTemplate(null)}
            onCreateMacro={handleCreateMacro}
          />
        </TabsContent>

        <TabsContent value="library" className="mt-0 pb-20">
          <MacroLibrary 
            macros={macros}
            runningMacroIds={runningMacroIds}
            onRunMacro={handleRunMacro}
            onStopMacro={handleStopMacro}
            onDeleteMacro={handleDeleteMacro}
            onToggleMacro={handleToggleMacro}
          />
        </TabsContent>

        <TabsContent value="runner" className="mt-0 pb-20">
          <MacroRunner 
            macro={selectedMacro} 
            onRecordRun={handleRecordMacroRun}
            onExecutionStart={handleMacroExecutionStart}
            onExecutionEnd={handleMacroExecutionEnd}
            onSetCancelCallback={handleSetCancelCallback}
          />
        </TabsContent>

        <TabsContent value="settings" className="mt-0 pb-20">
          <SettingsComponent />
        </TabsContent>
      </Tabs>
      <Toaster />
    </div>
  );
}