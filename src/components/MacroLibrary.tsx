import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Switch } from './ui/switch';
import { Tabs, TabsList, TabsTrigger } from './ui/tabs';
import { Macro } from '../App';
import { Search, Filter, Play, Edit, Trash2, MoreVertical, Eye, Library, TrendingUp, Calendar, Target, Settings, Zap, Moon, Battery, Briefcase, Home, Car, MessageSquare, Shield, Gamepad2, PlayCircle, PowerOff, Layers, Square } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu';
import { mockCategories } from './data/mockData';

interface MacroLibraryProps {
  macros: Macro[];
  runningMacroIds: Set<string>;
  onRunMacro: (macro: Macro) => void;
  onStopMacro?: (macroId: string) => void;
  onDeleteMacro: (id: string) => Promise<boolean>;
  onToggleMacro: (id: string) => Promise<boolean>;
}

export function MacroLibrary({ macros, runningMacroIds, onRunMacro, onStopMacro, onDeleteMacro, onToggleMacro }: MacroLibraryProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('name');
  const [statusFilter, setStatusFilter] = useState<'all' | 'running' | 'inactive'>('all');

  const filteredMacros = macros
    .filter(macro => {
      const matchesSearch = macro.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          macro.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || macro.category === selectedCategory;
      const matchesStatus = 
        statusFilter === 'all' ? true :
        statusFilter === 'running' ? runningMacroIds.has(macro.id) :
        statusFilter === 'inactive' ? !macro.isEnabled : true;
      return matchesSearch && matchesCategory && matchesStatus;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'category':
          return a.category.localeCompare(b.category);
        case 'runs':
          return b.runCount - a.runCount;
        case 'created':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        default:
          return 0;
      }
    });

  const toggleMacroEnabled = async (macroId: string) => {
    await onToggleMacro(macroId);
  };

  const deleteMacro = async (macroId: string) => {
    await onDeleteMacro(macroId);
  };

  const getCategoryColor = (category: string) => {
    const colorMap: Record<string, string> = {
      'Sleep & Rest': 'from-purple-500 to-indigo-600',
      'Battery & Power': 'from-green-500 to-emerald-600',
      'Productivity': 'from-blue-500 to-cyan-600',
      'Home Automation': 'from-yellow-500 to-orange-600',
      'Transportation': 'from-red-500 to-pink-600',
      'Communication': 'from-indigo-500 to-purple-600',
      'Security': 'from-rose-500 to-red-600',
      'Entertainment': 'from-pink-500 to-rose-600'
    };
    return colorMap[category] || 'from-gray-500 to-gray-600';
  };

  const getCategoryIcon = (category: string) => {
    const iconMap: Record<string, React.ComponentType<any>> = {
      'Sleep & Rest': Moon,
      'Battery & Power': Battery,
      'Productivity': Briefcase,
      'Home Automation': Home,
      'Transportation': Car,
      'Communication': MessageSquare,
      'Security': Shield,
      'Entertainment': Gamepad2
    };
    return iconMap[category] || Zap;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-indigo-50 dark:from-slate-900 dark:via-purple-900 dark:to-indigo-900 overflow-x-hidden">
      {/* Header */}
      <div className="relative overflow-hidden px-4 pt-6 pb-4">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 via-indigo-600/10 to-cyan-600/10 animate-pulse-slow"></div>
        <div className="relative text-center w-full max-w-sm mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-full border shadow-sm mb-3">
            <Library className="w-3 h-3 text-purple-600" />
            <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
              Macro Collection
            </span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
            Your Macro Library
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            Manage, organize, and run your automation macros
          </p>
        </div>
      </div>

      <div className="w-full max-w-sm mx-auto px-4 pb-6 pt-4 space-y-4">
        {/* Status Filter Tabs */}
        <Tabs value={statusFilter} onValueChange={(value) => setStatusFilter(value as 'all' | 'running' | 'inactive')} className="w-full">
          <TabsList className="grid w-full grid-cols-3 h-11 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-slate-200 dark:border-slate-700 rounded-xl p-1">
            <TabsTrigger 
              value="all" 
              className="flex items-center gap-1.5 data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-indigo-600 data-[state=active]:text-white transition-all duration-200 rounded-lg"
            >
              <Layers className="w-3.5 h-3.5" />
              <span className="text-xs font-medium">All</span>
              <Badge variant="secondary" className="ml-1 h-4 px-1 text-[10px]">
                {macros.length}
              </Badge>
            </TabsTrigger>
            <TabsTrigger 
              value="running" 
              className="flex items-center gap-1.5 data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-500 data-[state=active]:to-green-600 data-[state=active]:text-white transition-all duration-200 rounded-lg"
            >
              <PlayCircle className="w-3.5 h-3.5" />
              <span className="text-xs font-medium">Running</span>
              <Badge variant="secondary" className="ml-1 h-4 px-1 text-[10px]">
                {runningMacroIds.size}
              </Badge>
            </TabsTrigger>
            <TabsTrigger 
              value="inactive" 
              className="flex items-center gap-1.5 data-[state=active]:bg-gradient-to-r data-[state=active]:from-slate-500 data-[state=active]:to-slate-600 data-[state=active]:text-white transition-all duration-200 rounded-lg"
            >
              <PowerOff className="w-3.5 h-3.5" />
              <span className="text-xs font-medium">Inactive</span>
              <Badge variant="secondary" className="ml-1 h-4 px-1 text-[10px]">
                {macros.filter(m => !m.isEnabled).length}
              </Badge>
            </TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Search and Filters */}
        <Card className="border-0 shadow-xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
          <CardContent className="p-4 space-y-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Search your macros..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-10 border-2 border-slate-200 dark:border-slate-700 focus:border-purple-400 transition-colors w-full"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="h-10 border-2 border-slate-200 dark:border-slate-700 focus:border-purple-400">
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {mockCategories.map(category => {
                    const Icon = getCategoryIcon(category);
                    return (
                      <SelectItem key={category} value={category}>
                        <div className="flex items-center gap-2">
                          <Icon className="w-3 h-3" />
                          <span className="text-xs truncate">{category}</span>
                        </div>
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="h-10 border-2 border-slate-200 dark:border-slate-700 focus:border-purple-400">
                  <SelectValue placeholder="Sort by..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="name">Name A-Z</SelectItem>
                  <SelectItem value="category">Category</SelectItem>
                  <SelectItem value="runs">Most Used</SelectItem>
                  <SelectItem value="created">Recently Created</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-center gap-2 p-3 bg-slate-100 dark:bg-slate-700 rounded-lg">
              <Filter className="h-4 w-4 text-slate-500" />
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                {filteredMacros.length} of {macros.length}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Macro List */}
        <div className="space-y-3">
          {filteredMacros.map((macro) => {
            const Icon = getCategoryIcon(macro.category);
            return (
              <Card key={macro.id} className="group relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
                <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${getCategoryColor(macro.category)}`}></div>
                
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                      <div className="p-2 bg-slate-100 dark:bg-slate-700 rounded-lg flex-shrink-0">
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-slate-900 dark:text-white text-sm leading-tight mb-1 break-words">
                          {macro.name}
                        </h4>
                        <div className="flex items-center gap-2 mb-2 flex-wrap">
                          {runningMacroIds.has(macro.id) && (
                            <Badge className="text-xs bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white animate-pulse">
                              <PlayCircle className="w-3 h-3 mr-1" />
                              Running
                            </Badge>
                          )}
                          <Badge 
                            variant={macro.isEnabled ? "default" : "secondary"} 
                            className={`text-xs ${macro.isEnabled ? 'bg-emerald-500 hover:bg-emerald-600' : ''}`}
                          >
                            {macro.isEnabled ? "Active" : "Inactive"}
                          </Badge>
                          <Badge variant="outline" className="border-slate-300 dark:border-slate-600 text-xs">
                            {macro.category}
                          </Badge>
                        </div>
                        <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-2 break-words">
                          {macro.description}
                        </p>
                        <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-500 flex-wrap">
                          <span className="flex items-center gap-1">
                            <Target className="w-3 h-3" />
                            {macro.steps.length}
                          </span>
                          <span className="flex items-center gap-1">
                            <TrendingUp className="w-3 h-3" />
                            {macro.runCount}
                          </span>
                          {macro.lastRun && (
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {macro.lastRun}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => onRunMacro(macro)}>
                          <Play className="w-4 h-4 mr-2" />
                          Run Macro
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Eye className="w-4 h-4 mr-2" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Edit className="w-4 h-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          className="text-destructive"
                          onClick={() => deleteMacro(macro.id)}
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-slate-200 dark:border-slate-700">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2">
                        <Settings className="w-4 h-4 text-slate-400" />
                        <Switch
                          checked={macro.isEnabled}
                          onCheckedChange={() => toggleMacroEnabled(macro.id)}
                          size="sm"
                        />
                      </div>
                      <span className="text-xs text-slate-600 dark:text-slate-400">
                        {macro.isEnabled ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                    
                    {runningMacroIds.has(macro.id) ? (
                      <Button 
                        size="sm" 
                        onClick={() => onStopMacro?.(macro.id)}
                        className="flex-shrink-0 bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 text-white h-8 px-3"
                      >
                        <Square className="w-3 h-3 mr-1 fill-current" />
                        Stop
                      </Button>
                    ) : (
                      <Button 
                        size="sm" 
                        onClick={() => onRunMacro(macro)}
                        disabled={!macro.isEnabled}
                        className={`flex-shrink-0 ${macro.isEnabled 
                          ? 'bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white h-8 px-3' 
                          : 'h-8 px-3'}`}
                      >
                        <Play className="w-3 h-3 mr-1" />
                        Run
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Empty State */}
        {filteredMacros.length === 0 && (
          <Card className="border-0 shadow-xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
            <CardContent className="py-12 text-center">
              <div className="w-full max-w-xs mx-auto">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-purple-100 to-indigo-100 dark:from-purple-900/30 dark:to-indigo-900/30 flex items-center justify-center">
                  <Search className="w-8 h-8 text-purple-500" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                  No macros found
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-4 leading-relaxed">
                  Try adjusting your search terms or category filters
                </p>
                <div className="flex flex-col gap-2">
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setSearchTerm('');
                      setSelectedCategory('all');
                    }}
                    className="border-2 hover:border-purple-300 w-full"
                    size="sm"
                  >
                    Clear All Filters
                  </Button>
                  <Button 
                    className="bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white w-full"
                    size="sm"
                  >
                    <Zap className="w-4 h-4 mr-2" />
                    Create New Macro
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}