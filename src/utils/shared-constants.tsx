// Shared constants and utilities to eliminate redundancy across components
import { LucideIcon } from 'lucide-react';

// Common category color mappings used across multiple components
export const CATEGORY_COLORS: Record<string, string> = {
  'Sleep & Rest': 'from-purple-500 to-indigo-600',
  'Battery & Power': 'from-green-500 to-emerald-600', 
  'Productivity': 'from-blue-500 to-cyan-600',
  'Home Automation': 'from-yellow-500 to-orange-600',
  'Transportation': 'from-red-500 to-pink-600',
  'Communication': 'from-indigo-500 to-purple-600',
  'Security': 'from-rose-500 to-red-600',
  'Entertainment': 'from-pink-500 to-rose-600'
};

// Common card styling classes
export const CARD_STYLES = {
  base: 'border-0 shadow-xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm',
  hover: 'hover:shadow-2xl transition-all duration-300'
};

// Common button styling classes
export const BUTTON_STYLES = {
  primary: 'bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white shadow-lg hover:shadow-xl',
  secondary: 'bg-gradient-to-r from-slate-100 to-slate-200 hover:from-slate-200 hover:to-slate-300 dark:from-slate-700 dark:to-slate-800',
  success: 'bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white',
  danger: 'bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 text-white'
};

// Common hero section background
export const HERO_BACKGROUND = 'bg-gradient-to-r from-purple-600/10 via-indigo-600/10 to-cyan-600/10 animate-pulse-slow';

// Common page background
export const PAGE_BACKGROUND = 'min-h-screen bg-gradient-to-br from-slate-50 to-orange-50 dark:from-slate-900 dark:to-orange-900 overflow-x-hidden';

// Helper functions
export const getCategoryColor = (category: string): string => {
  return CATEGORY_COLORS[category] || 'from-gray-500 to-gray-600';
};

export const formatTimeAgo = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (diffInSeconds < 60) return 'just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  return `${Math.floor(diffInSeconds / 86400)}d ago`;
};

export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + '...';
};

// Common error handling
export const handleAsyncError = (error: unknown, fallbackMessage: string): string => {
  console.error('Async operation failed:', error);
  return error instanceof Error ? error.message : fallbackMessage;
};

// Common loading states
export const createLoadingDelay = (ms: number): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

// Android mode unsupported actions
export const ANDROID_UNSUPPORTED_ACTIONS = {
  triggers: ['Time Trigger', 'Bedtime Trigger', 'Schedule Trigger', 'Timer Trigger', 'Alarm Trigger'],
  actions: ['Set Audio Mode', 'Silent Mode', 'Change Volume', 'Set Volume', 'Audio Mode', 'Media Volume', 'Ring Volume', 'Notification Volume']
};

// Check if a step is supported in Android mode
export const isStepSupportedInAndroidMode = (stepTitle: string, stepType: 'trigger' | 'condition' | 'action'): boolean => {
  if (stepType === 'trigger') {
    return !ANDROID_UNSUPPORTED_ACTIONS.triggers.some(unsupported => 
      stepTitle.toLowerCase().includes(unsupported.toLowerCase())
    );
  }
  if (stepType === 'action') {
    return !ANDROID_UNSUPPORTED_ACTIONS.actions.some(unsupported => 
      stepTitle.toLowerCase().includes(unsupported.toLowerCase())
    );
  }
  return true; // Conditions are always supported
};

// Get unsupported steps in a macro for Android mode
export const getUnsupportedStepsForAndroid = (steps: Array<{ title: string; type: 'trigger' | 'condition' | 'action' }>): string[] => {
  return steps
    .filter(step => !isStepSupportedInAndroidMode(step.title, step.type))
    .map(step => step.title);
};