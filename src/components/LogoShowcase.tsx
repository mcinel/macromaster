import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Logo, AppIcon, LogoIcon } from './Logo';

export function LogoShowcase() {
  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-slate-50 via-indigo-50 to-purple-50 dark:from-slate-900 dark:via-indigo-900 dark:to-purple-900">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <Logo size="xl" variant="gradient" showText={true} />
          </div>
          <p className="text-lg text-slate-600 dark:text-slate-400">
            Modern logo system for MacroMaster Android Automation App
          </p>
        </div>

        {/* Logo Variants */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Main Logo Variations */}
          <Card>
            <CardHeader>
              <CardTitle>Logo Variations</CardTitle>
              <CardDescription>Different sizes and styles for various use cases</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              
              {/* Size Variations */}
              <div className="space-y-4">
                <h4 className="font-medium text-sm text-slate-700 dark:text-slate-300">Size Variations</h4>
                <div className="space-y-4 p-4 bg-white dark:bg-slate-800 rounded-lg">
                  <Logo size="sm" showText={true} />
                  <Logo size="md" showText={true} />
                  <Logo size="lg" showText={true} />
                </div>
              </div>

              {/* Color Variations */}
              <div className="space-y-4">
                <h4 className="font-medium text-sm text-slate-700 dark:text-slate-300">Color Variations</h4>
                <div className="grid grid-cols-1 gap-4">
                  <div className="p-4 bg-white dark:bg-slate-800 rounded-lg">
                    <Logo size="md" variant="default" showText={true} />
                  </div>
                  <div className="p-4 bg-slate-900 rounded-lg">
                    <Logo size="md" variant="white" showText={true} />
                  </div>
                  <div className="p-4 bg-gradient-to-r from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-800 rounded-lg">
                    <Logo size="md" variant="gradient" showText={true} />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* App Icons */}
          <Card>
            <CardHeader>
              <CardTitle>App Icons</CardTitle>
              <CardDescription>Perfect for app stores, home screens, and favicons</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              
              {/* App Icon Sizes */}
              <div className="space-y-4">
                <h4 className="font-medium text-sm text-slate-700 dark:text-slate-300">App Icon Sizes</h4>
                <div className="flex items-center gap-4 p-4 bg-white dark:bg-slate-800 rounded-lg">
                  <AppIcon size={32} />
                  <AppIcon size={48} />
                  <AppIcon size={64} />
                  <AppIcon size={96} />
                </div>
              </div>

              {/* Minimal Icons */}
              <div className="space-y-4">
                <h4 className="font-medium text-sm text-slate-700 dark:text-slate-300">Minimal Icons</h4>
                <div className="grid grid-cols-3 gap-4">
                  <div className="p-4 bg-white dark:bg-slate-800 rounded-lg flex justify-center">
                    <LogoIcon size={32} variant="default" />
                  </div>
                  <div className="p-4 bg-slate-900 rounded-lg flex justify-center">
                    <LogoIcon size={32} variant="white" />
                  </div>
                  <div className="p-4 bg-slate-100 dark:bg-slate-700 rounded-lg flex justify-center">
                    <LogoIcon size={32} variant="dark" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Usage Examples */}
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Usage Examples</CardTitle>
              <CardDescription>See how the logo looks in different contexts</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              
              {/* Navigation Header */}
              <div className="space-y-2">
                <h4 className="font-medium text-sm text-slate-700 dark:text-slate-300">Navigation Header</h4>
                <div className="p-4 bg-white dark:bg-slate-800 border rounded-lg">
                  <div className="flex items-center justify-between">
                    <Logo size="sm" showText={true} />
                    <div className="flex gap-2">
                      <div className="w-8 h-8 bg-slate-200 dark:bg-slate-600 rounded-full"></div>
                      <div className="w-8 h-8 bg-slate-200 dark:bg-slate-600 rounded-full"></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Mobile App Header */}
              <div className="space-y-2">
                <h4 className="font-medium text-sm text-slate-700 dark:text-slate-300">Mobile App Header</h4>
                <div className="max-w-sm mx-auto p-4 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl text-white">
                  <div className="text-center">
                    <Logo size="md" variant="white" showText={true} />
                  </div>
                </div>
              </div>

              {/* Login Screen */}
              <div className="space-y-2">
                <h4 className="font-medium text-sm text-slate-700 dark:text-slate-300">Login/Welcome Screen</h4>
                <div className="max-w-sm mx-auto p-8 bg-gradient-to-br from-slate-50 to-indigo-100 dark:from-slate-800 dark:to-indigo-900 rounded-2xl">
                  <div className="text-center space-y-4">
                    <Logo size="xl" variant="gradient" showText={true} />
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      Welcome to the future of Android automation
                    </p>
                  </div>
                </div>
              </div>

              {/* Favicon/Small Icon */}
              <div className="space-y-2">
                <h4 className="font-medium text-sm text-slate-700 dark:text-slate-300">Favicon & Small Icons</h4>
                <div className="flex items-center gap-4 p-4 bg-white dark:bg-slate-800 border rounded-lg">
                  <div className="flex items-center gap-2">
                    <LogoIcon size={16} />
                    <span className="text-sm">Browser Tab</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <LogoIcon size={24} />
                    <span className="text-sm">Navigation Icon</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <AppIcon size={40} />
                    <span className="text-sm">Home Screen</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Design Notes */}
        <Card>
          <CardHeader>
            <CardTitle>Design Philosophy</CardTitle>
            <CardDescription>The thinking behind the MacroMaster logo design</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <LogoIcon size={24} variant="white" />
                </div>
                <h4 className="font-medium">Connectivity</h4>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  The central hub with connecting nodes represents how MacroMaster connects different Android functions into automated workflows.
                </p>
              </div>
              <div className="space-y-2">
                <div className="w-12 h-12 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center">
                  <LogoIcon size={24} variant="white" />
                </div>
                <h4 className="font-medium">AI Intelligence</h4>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Subtle circuit patterns and animated sparkles suggest the AI-powered nature of the automation engine.
                </p>
              </div>
              <div className="space-y-2">
                <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-green-600 rounded-lg flex items-center justify-center">
                  <LogoIcon size={24} variant="white" />
                </div>
                <h4 className="font-medium">Modern Flow</h4>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Clean gradients and flowing connections create a modern, tech-forward aesthetic that feels approachable yet powerful.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}