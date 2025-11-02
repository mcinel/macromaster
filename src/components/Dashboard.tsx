import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Macro } from '../App';
import { Clock, Play, Zap, TrendingUp, Target, Sparkles, ArrowRight, Calendar, Moon, Battery, Briefcase, Home } from 'lucide-react';
import { getCategoryColor, CARD_STYLES, BUTTON_STYLES } from '../utils/shared-constants';

interface DashboardProps {
  macros: Macro[];
  onRunMacro: (macro: Macro) => void;
  onCreateMacro?: (template?: Partial<Macro>) => void;
}

export function Dashboard({ macros, onRunMacro, onCreateMacro }: DashboardProps) {
  const recentMacros = macros
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 3);
  const enabledMacros = macros.filter(m => m.isEnabled);
  const totalRuns = macros.reduce((sum, m) => sum + m.runCount, 0);
  const categories = new Set(macros.map(m => m.category)).size;

  const quickActionTemplates = {
    silentNight: {
      name: 'Silent Night Mode',
      description: 'Automatically enable silent mode and reduce brightness during sleep hours',
      category: 'Sleep & Rest',
      permissions: ['AUDIO_SETTINGS', 'BRIGHTNESS_CONTROL', 'NOTIFICATION_ACCESS'],
      steps: [
        {
          id: 'step-1',
          type: 'trigger' as const,
          title: 'Time Trigger',
          description: 'When time is 10:00 PM',
          icon: 'Clock',
          settings: { time: '22:00', days: ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'] }
        },
        {
          id: 'step-2',
          type: 'action' as const,
          title: 'Set Audio Mode',
          description: 'Change audio to Silent',
          icon: 'VolumeX',
          settings: { mode: 'silent' }
        },
        {
          id: 'step-3',
          type: 'action' as const,
          title: 'Reduce Brightness',
          description: 'Set screen brightness to 20%',
          icon: 'Sun',
          settings: { brightness: 20 }
        }
      ]
    },
    wifiBatterySaver: {
      name: 'WiFi Battery Saver',
      description: 'Automatically turn off WiFi when battery is low to save power',
      category: 'Battery & Power',
      permissions: ['BATTERY_STATS', 'WIFI_CONTROL'],
      steps: [
        {
          id: 'step-1',
          type: 'trigger' as const,
          title: 'Battery Level',
          description: 'When battery level is below 15%',
          icon: 'Battery',
          settings: { level: 15, operator: 'below' }
        },
        {
          id: 'step-2',
          type: 'action' as const,
          title: 'Disable WiFi',
          description: 'Turn off WiFi to save power',
          icon: 'Wifi',
          settings: { state: 'off' }
        }
      ]
    },
    workMode: {
      name: 'Work Focus Mode',
      description: 'Enable Do Not Disturb and block distracting apps during work hours',
      category: 'Productivity',
      permissions: ['APP_USAGE_ACCESS', 'DO_NOT_DISTURB', 'NOTIFICATION_ACCESS'],
      steps: [
        {
          id: 'step-1',
          type: 'trigger' as const,
          title: 'Time Range',
          description: 'Between 9 AM and 5 PM on weekdays',
          icon: 'Clock',
          settings: { startTime: '09:00', endTime: '17:00', days: ['mon', 'tue', 'wed', 'thu', 'fri'] }
        },
        {
          id: 'step-2',
          type: 'action' as const,
          title: 'Enable DND',
          description: 'Turn on Do Not Disturb mode',
          icon: 'BellOff',
          settings: { allowCalls: true, allowAlarms: true }
        },
        {
          id: 'step-3',
          type: 'action' as const,
          title: 'Block Apps',
          description: 'Block social media and gaming apps',
          icon: 'Shield',
          settings: { apps: ['social_media', 'games'] }
        }
      ]
    },
    homeAutomation: {
      name: 'Smart Home Control',
      description: 'Turn on lights and adjust temperature when arriving home',
      category: 'Home Automation',
      permissions: ['LOCATION_ACCESS'],
      steps: [
        {
          id: 'step-1',
          type: 'trigger' as const,
          title: 'Location Trigger',
          description: 'When entering home area',
          icon: 'MapPin',
          settings: { location: 'home', radius: 50, action: 'enter' }
        },
        {
          id: 'step-2',
          type: 'action' as const,
          title: 'Turn On Lights',
          description: 'Activate living room lights',
          icon: 'Lightbulb',
          settings: { device: 'living_room_lights', brightness: 80 }
        },
        {
          id: 'step-3',
          type: 'action' as const,
          title: 'Adjust Temperature',
          description: 'Set thermostat to comfort mode',
          icon: 'Thermometer',
          settings: { temperature: 72, mode: 'auto' }
        }
      ]
    }
  };

  const handleQuickAction = (templateKey: keyof typeof quickActionTemplates) => {
    const template = quickActionTemplates[templateKey];
    onCreateMacro?.(template);
  };

  // Use shared function instead of duplicated code

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-900 overflow-x-hidden">
      {/* Hero Section */}
      <div className="relative overflow-hidden px-4 pt-6 pb-4">
        <div className="absolute inset-x-0 top-0 bottom-8 bg-gradient-to-r from-indigo-600/10 via-purple-600/10 to-cyan-600/10 animate-pulse-slow"></div>
        <div className="relative w-full max-w-sm mx-auto">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-full border shadow-sm mb-3">
              <Sparkles className="w-3 h-3 text-indigo-600" />
              <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
                AI-Powered Automation
              </span>
            </div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
              Welcome to MacroMaster
            </h1>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Create powerful automation macros with AI assistance
            </p>
          </div>
        </div>
      </div>

      <div className="w-full max-w-sm mx-auto px-4 pb-6 space-y-4">
        {/* Quick Actions */}
        <Card className="border-0 shadow-xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg">
                <Zap className="w-4 h-4 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <CardTitle className="text-base font-bold text-[15px]">Quick Actions</CardTitle>
                <CardDescription className="text-sm">
                  Get started with popular templates
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button 
              variant="outline" 
              className="group w-full h-auto p-4 justify-start border-2 hover:border-purple-300 hover:shadow-lg transition-all duration-300 bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20"
              onClick={() => handleQuickAction('silentNight')}
            >
              <div className="flex items-center gap-3 w-full min-w-0">
                <Moon className="w-5 h-5 text-purple-600 flex-shrink-0" />
                <div className="text-left flex-1 min-w-0 overflow-hidden">
                  <div className="font-semibold text-slate-900 dark:text-white group-hover:text-purple-700 dark:group-hover:text-purple-300 text-sm leading-tight break-words">
                    Silent at Night
                  </div>
                  <div className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed break-words">
                    Auto-enable silent mode during sleep hours
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-purple-600 group-hover:translate-x-1 transition-all flex-shrink-0" />
              </div>
            </Button>

            <Button 
              variant="outline" 
              className="group w-full h-auto p-4 justify-start border-2 hover:border-emerald-300 hover:shadow-lg transition-all duration-300 bg-gradient-to-r from-emerald-50 to-green-50 dark:from-emerald-900/20 dark:to-green-900/20"
              onClick={() => handleQuickAction('wifiBatterySaver')}
            >
              <div className="flex items-center gap-3 w-full min-w-0">
                <Battery className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                <div className="text-left flex-1 min-w-0 overflow-hidden">
                  <div className="font-semibold text-slate-900 dark:text-white group-hover:text-emerald-700 dark:group-hover:text-emerald-300 text-sm leading-tight break-words">
                    Battery Saver
                  </div>
                  <div className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed break-words">
                    Save power when battery runs low
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-600 group-hover:translate-x-1 transition-all flex-shrink-0" />
              </div>
            </Button>

            <Button 
              variant="outline" 
              className="group w-full h-auto p-4 justify-start border-2 hover:border-blue-300 hover:shadow-lg transition-all duration-300 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20"
              onClick={() => handleQuickAction('workMode')}
            >
              <div className="flex items-center gap-3 w-full min-w-0">
                <Briefcase className="w-5 h-5 text-blue-600 flex-shrink-0" />
                <div className="text-left flex-1 min-w-0 overflow-hidden">
                  <div className="font-semibold text-slate-900 dark:text-white group-hover:text-blue-700 dark:group-hover:text-blue-300 text-sm leading-tight break-words">
                    Focus Mode
                  </div>
                  <div className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed break-words">
                    Block distractions during work
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all flex-shrink-0" />
              </div>
            </Button>

            <Button 
              variant="outline" 
              className="group w-full h-auto p-4 justify-start border-2 hover:border-amber-300 hover:shadow-lg transition-all duration-300 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20"
              onClick={() => handleQuickAction('homeAutomation')}
            >
              <div className="flex items-center gap-3 w-full min-w-0">
                <Home className="w-5 h-5 text-amber-600 flex-shrink-0" />
                <div className="text-left flex-1 min-w-0 overflow-hidden">
                  <div className="font-semibold text-slate-900 dark:text-white group-hover:text-amber-700 dark:group-hover:text-amber-300 text-sm leading-tight break-words">
                    Smart Home
                  </div>
                  <div className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed break-words">
                    Control devices by location
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-amber-600 group-hover:translate-x-1 transition-all flex-shrink-0" />
              </div>
            </Button>
          </CardContent>
        </Card>

        {/* Recent Macros */}
        <Card className="border-0 shadow-xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-lg">
                <Clock className="w-4 h-4 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <CardTitle className="text-base text-[15px] font-bold">Recent Macros</CardTitle>
                <CardDescription className="text-sm">
                  Your most recently created macros
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentMacros.map((macro) => (
              <div key={macro.id} className="group relative overflow-hidden rounded-xl border-2 border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 transition-all duration-300 bg-white dark:bg-slate-800">
                <div className={`absolute inset-0 bg-gradient-to-r ${getCategoryColor(macro.category)} opacity-5 group-hover:opacity-10 transition-opacity`}></div>
                <div className="relative p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-slate-900 dark:text-white text-sm leading-tight mb-1 break-words">
                        {macro.name}
                      </h4>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant={macro.isEnabled ? "default" : "secondary"} className={`text-xs ${macro.isEnabled ? 'bg-emerald-500 hover:bg-emerald-600' : ''}`}>
                          {macro.isEnabled ? "Active" : "Inactive"}
                        </Badge>
                        <Badge variant="outline" className="border-slate-300 dark:border-slate-600 text-xs">
                          {macro.category}
                        </Badge>
                      </div>
                    </div>
                    <Button 
                      onClick={() => onRunMacro(macro)} 
                      disabled={!macro.isEnabled}
                      className={`ml-2 flex-shrink-0 ${macro.isEnabled 
                        ? 'bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white shadow-lg' 
                        : 'bg-slate-200 dark:bg-slate-700'}`}
                      size="sm"
                    >
                      <Play className="w-3 h-3" />
                    </Button>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mb-2 leading-relaxed break-words">
                    {macro.description}
                  </p>
                  <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-500">
                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1">
                        <Target className="w-3 h-3" />
                        {macro.steps.length}
                      </span>
                      <span className="flex items-center gap-1">
                        <TrendingUp className="w-3 h-3" />
                        {macro.runCount}
                      </span>
                    </div>
                    {macro.lastRun && (
                      <span className="flex items-center gap-1 flex-shrink-0">
                        <Calendar className="w-3 h-3" />
                        {macro.lastRun}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}