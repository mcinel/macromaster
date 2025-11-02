import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { Alert, AlertDescription } from './ui/alert';
import { Progress } from './ui/progress';
import { MacroPreview } from './MacroPreview';
import { Macro, MacroStep } from '../App';
import { Bot, Sparkles, Loader2, CheckCircle, AlertCircle, Lightbulb, MessageSquare, Brain, Wand2, ArrowRight, Zap, Moon, Battery, Briefcase, Home, Car, Zap as EnhanceIcon } from 'lucide-react';
import { mockCategories } from './data/mockData';
import { aiClient, MacroGenerationResponse } from '../utils/ai-client';
import { toast } from "sonner@2.0.3";

interface AIResponse {
  macro: Macro;
  explanation: string;
  confidence: number;
}

interface MacroCreatorProps {
  template?: Partial<Macro> | null;
  onTemplateUsed?: () => void;
  onCreateMacro: (macro: Macro) => Promise<boolean>;
}

export function MacroCreator({ template, onTemplateUsed, onCreateMacro }: MacroCreatorProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [generatedMacro, setGeneratedMacro] = useState<Macro | null>(null);
  const [aiResponse, setAiResponse] = useState<AIResponse | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [generationMethod, setGenerationMethod] = useState<'ai' | 'fallback' | null>(null);

  // Auto-populate from template when provided
  React.useEffect(() => {
    if (template) {
      const templateMacro: Macro = {
        id: `template-${Date.now()}`,
        name: template.name || 'New Macro',
        description: template.description || '',
        category: template.category || 'Productivity',
        isEnabled: false,
        createdAt: new Date().toISOString().split('T')[0],
        runCount: 0,
        permissions: template.permissions || [],
        steps: template.steps || []
      };
      
      setGeneratedMacro(templateMacro);
      setAiResponse({
        macro: templateMacro,
        explanation: `Pre-configured macro template: ${template.description}`,
        confidence: 1.0
      });
      setShowPreview(true);
      onTemplateUsed?.();
    }
  }, [template, onTemplateUsed]);

  const simulateAIGeneration = async (userPrompt: string): Promise<AIResponse> => {
    // Basic fallback generation with limited capabilities
    await new Promise(resolve => setTimeout(resolve, 800));

    const lowerPrompt = userPrompt.toLowerCase();
    
    // Limited keyword-based macro generation (fallback only)
    let macro: Macro;
    let explanation: string;
    let confidence: number = 0.6; // Lower confidence for fallback system

    if (lowerPrompt.includes('battery') || lowerPrompt.includes('power')) {
      macro = {
        id: `generated-${Date.now()}`,
        name: 'Smart Battery Manager',
        description: 'AI-generated battery optimization macro with intelligent power saving',
        category: 'Battery & Power',
        isEnabled: false,
        createdAt: new Date().toISOString().split('T')[0],
        runCount: 0,
        permissions: ['BATTERY_STATS', 'WIFI_CONTROL', 'BRIGHTNESS_CONTROL'],
        steps: [
          {
            id: 'gen1',
            type: 'trigger',
            title: 'Battery Level Trigger',
            description: 'When battery level drops below 25%',
            icon: 'Battery',
            settings: { level: 25, operator: 'below' }
          },
          {
            id: 'gen2',
            type: 'action',
            title: 'Optimize Display',
            description: 'Reduce screen brightness to 30%',
            icon: 'Sun',
            settings: { brightness: 30 }
          },
          {
            id: 'gen3',
            type: 'action',
            title: 'Network Optimization',
            description: 'Disable WiFi scanning to save power',
            icon: 'Wifi',
            settings: { scanning: false }
          }
        ]
      };
      explanation = 'Basic battery optimization macro (backup system). For advanced AI-generated macros with intelligent optimization, please try again when connection is restored.';
    } else if (lowerPrompt.includes('sleep') || lowerPrompt.includes('night') || lowerPrompt.includes('bedtime')) {
      macro = {
        id: `generated-${Date.now()}`,
        name: 'Perfect Sleep Mode',
        description: 'AI-crafted bedtime routine for optimal sleep hygiene',
        category: 'Sleep & Rest',
        isEnabled: false,
        createdAt: new Date().toISOString().split('T')[0],
        runCount: 0,
        permissions: ['AUDIO_SETTINGS', 'BRIGHTNESS_CONTROL', 'DO_NOT_DISTURB'],
        steps: [
          {
            id: 'gen1',
            type: 'trigger',
            title: 'Bedtime Trigger',
            description: 'Activates at 10:30 PM daily',
            icon: 'Clock',
            settings: { time: '22:30', days: ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'] }
          },
          {
            id: 'gen2',
            type: 'action',
            title: 'Silent Mode',
            description: 'Enable silent mode for undisturbed sleep',
            icon: 'VolumeX',
            settings: { mode: 'silent' }
          },
          {
            id: 'gen3',
            type: 'action',
            title: 'Sleep-Friendly Display',
            description: 'Minimize screen brightness',
            icon: 'Sun',
            settings: { brightness: 5 }
          },
          {
            id: 'gen4',
            type: 'action',
            title: 'Do Not Disturb',
            description: 'Block notifications while allowing alarms',
            icon: 'Moon',
            settings: { allowAlarms: true }
          }
        ]
      };
      explanation = 'Simple sleep mode macro (backup system). For AI-crafted personalized bedtime routines, please try again with AI generation.';
    } else if (lowerPrompt.includes('work') || lowerPrompt.includes('focus') || lowerPrompt.includes('productivity')) {
      macro = {
        id: `generated-${Date.now()}`,
        name: 'Ultimate Focus Zone',
        description: 'AI-powered productivity enhancement for peak performance',
        category: 'Productivity',
        isEnabled: false,
        createdAt: new Date().toISOString().split('T')[0],
        runCount: 0,
        permissions: ['APP_USAGE_ACCESS', 'NOTIFICATION_ACCESS', 'DO_NOT_DISTURB'],
        steps: [
          {
            id: 'gen1',
            type: 'trigger',
            title: 'Work App Detection',
            description: 'Triggers when opening productivity apps',
            icon: 'Briefcase',
            settings: { apps: ['com.microsoft.office', 'com.google.docs', 'com.slack'] }
          },
          {
            id: 'gen2',
            type: 'action',
            title: 'Distraction Blocker',
            description: 'Block social media and entertainment apps',
            icon: 'Shield',
            settings: { apps: ['com.instagram.android', 'com.twitter.android', 'com.tiktok'] }
          },
          {
            id: 'gen3',
            type: 'action',
            title: 'Priority Notifications',
            description: 'Filter to show only work-related notifications',
            icon: 'Bell',
            settings: { filter: 'work_priority' }
          }
        ]
      };
      explanation = 'Basic productivity macro (backup system). For intelligent focus modes with app detection, please try AI generation again.';
    } else {
      // Generic automation
      macro = {
        id: `generated-${Date.now()}`,
        name: 'Custom Smart Automation',
        description: 'AI-generated automation tailored to your needs',
        category: 'Productivity',
        isEnabled: false,
        createdAt: new Date().toISOString().split('T')[0],
        runCount: 0,
        permissions: ['NOTIFICATION_ACCESS'],
        steps: [
          {
            id: 'gen1',
            type: 'trigger',
            title: 'Smart Trigger',
            description: 'Intelligently detects the right moment',
            icon: 'Zap',
            settings: { custom: true }
          },
          {
            id: 'gen2',
            type: 'action',
            title: 'Adaptive Action',
            description: 'Performs context-aware automation',
            icon: 'Target',
            settings: { custom: true }
          }
        ]
      };
      explanation = 'Generic automation template (backup system). For customized, intelligent macros tailored to your needs, please use AI generation.';
      confidence = 0.5; // Very low confidence for generic fallback
    }

    return { macro, explanation, confidence };
  };

  const handleEnhancePrompt = async () => {
    if (!prompt.trim()) {
      toast.error('Please enter a prompt first');
      return;
    }

    setIsEnhancing(true);
    
    try {
      const response = await aiClient.enhancePrompt(prompt);
      setPrompt(response.enhancedPrompt);
      toast.success('Prompt enhanced successfully!');
    } catch (error) {
      console.error('Failed to enhance prompt:', error);
      toast.error('Failed to enhance prompt. Please try again.');
    } finally {
      setIsEnhancing(false);
    }
  };

  const handleGenerate = async () => {
    if (!prompt.trim()) return;

    setIsGenerating(true);
    setCurrentStep(1);
    setGenerationMethod(null);
    
    try {
      // Step 1: Analyzing prompt
      setCurrentStep(2);
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Step 2: Designing with AI
      setCurrentStep(3);
      await new Promise(resolve => setTimeout(resolve, 1200));
      
      // Step 3: Generate with OpenAI (primary method)
      console.log('Generating macro with OpenAI API...');
      const response: MacroGenerationResponse = await aiClient.generateMacro(prompt);
      
      if (response.success && response.macro) {
        const aiResponse: AIResponse = {
          macro: response.macro,
          explanation: response.explanation,
          confidence: response.confidence
        };
        
        setAiResponse(aiResponse);
        setGeneratedMacro(response.macro);
        setGenerationMethod('ai');
        setCurrentStep(4);
        setTimeout(() => setShowPreview(true), 500);
        
        // Success message emphasizing AI generation
        toast.success('AI-powered macro generated successfully!', {
          description: `Confidence: ${Math.round(response.confidence * 100)}%`
        });
        
        console.log('OpenAI macro generation successful:', response.macro.name);
      } else {
        throw new Error(response.error || 'OpenAI API returned invalid response');
      }
    } catch (error) {
      console.error('OpenAI macro generation failed:', error);
      
      // Show specific error message about AI failure
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      toast.error('AI macro generation failed', {
        description: errorMessage.includes('OpenAI') ? 'OpenAI API issue' : 'Connection error'
      });
      
      // Only use fallback if OpenAI completely fails
      try {
        console.log('Falling back to local macro generation...');
        toast.info('Using backup generation system...');
        
        const fallbackResponse = await simulateAIGeneration(prompt);
        setAiResponse(fallbackResponse);
        setGeneratedMacro(fallbackResponse.macro);
        setGenerationMethod('fallback');
        setCurrentStep(4);
        setTimeout(() => setShowPreview(true), 500);
        
        toast.success('Macro generated with backup system', {
          description: 'Limited features - try again for AI-powered generation'
        });
        
        console.log('Fallback generation successful:', fallbackResponse.macro.name);
      } catch (fallbackError) {
        console.error('Both OpenAI and fallback generation failed:', fallbackError);
        toast.error('Macro generation completely failed', {
          description: 'Please check your connection and try again'
        });
        setCurrentStep(1);
      }
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSaveMacro = async () => {
    if (generatedMacro) {
      const success = await onCreateMacro(generatedMacro);
      
      if (success) {
        // Reset form
        setPrompt('');
        setGeneratedMacro(null);
        setAiResponse(null);
        setShowPreview(false);
        setCurrentStep(1);
        setGenerationMethod(null);
        
        // Clear template if it was used
        if (onTemplateUsed) {
          onTemplateUsed();
        }
      }
    }
  };

  const examplePrompts = [
    {
      text: "Turn on silent mode and dim screen when bedtime",
      icon: Moon,
      category: "Sleep & Rest"
    },
    {
      text: "Save battery by turning off WiFi when battery is low",
      icon: Battery,
      category: "Battery & Power"
    },
    {
      text: "Block social media apps during work hours",
      icon: Briefcase,
      category: "Productivity"
    },
    {
      text: "Turn on home lights when I arrive home after sunset",
      icon: Home,
      category: "Home Automation"
    },
    {
      text: "Auto-reply to messages when I'm driving",
      icon: Car,
      category: "Transportation"
    }
  ];

  const getStepIcon = (step: number) => {
    if (step < currentStep) return <CheckCircle className="w-4 h-4 text-emerald-500" />;
    if (step === currentStep && isGenerating) return <Loader2 className="w-4 h-4 animate-spin text-indigo-500" />;
    if (step === currentStep) return <div className="w-4 h-4 rounded-full bg-indigo-500"></div>;
    return <div className="w-4 h-4 rounded-full bg-slate-300 dark:bg-slate-600"></div>;
  };

  if (showPreview && generatedMacro) {
    return (
      <MacroPreview 
        macro={generatedMacro}
        explanation={aiResponse?.explanation}
        confidence={aiResponse?.confidence}
        onSave={handleSaveMacro}
        onBack={() => setShowPreview(false)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50 to-purple-50 dark:from-slate-900 dark:via-indigo-900 dark:to-purple-900 overflow-x-hidden">
      {/* Header */}
      <div className="relative overflow-hidden px-4 pt-6 pb-4">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 via-indigo-600/10 to-cyan-600/10 animate-pulse-slow"></div>
        <div className="relative text-center w-full max-w-sm mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-full border shadow-sm mb-3">
            <Brain className="w-3 h-3 text-indigo-600" />
            <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
              AI-Powered Creation
            </span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
            Create Your Macro
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            Describe what you want to automate, and our AI will build it for you
          </p>
        </div>
      </div>

      <div className="w-full max-w-sm mx-auto px-4 pb-6 pt-4 space-y-4 overflow-hidden">

        {/* Progress Steps - Only show when generating */}
        {isGenerating && (
          <Card className="border-0 shadow-xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
            <CardContent className="p-4">
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex items-center gap-2">
                    {getStepIcon(1)}
                    <span className={`text-xs ${currentStep >= 1 ? 'text-slate-900 dark:text-white font-medium' : 'text-slate-500'}`}>
                      Analyzing
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {getStepIcon(2)}
                    <span className={`text-xs ${currentStep >= 2 ? 'text-slate-900 dark:text-white font-medium' : 'text-slate-500'}`}>
                      Designing
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {getStepIcon(3)}
                    <span className={`text-xs ${currentStep >= 3 ? 'text-slate-900 dark:text-white font-medium' : 'text-slate-500'}`}>
                      Building
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {getStepIcon(4)}
                    <span className={`text-xs ${currentStep >= 4 ? 'text-slate-900 dark:text-white font-medium' : 'text-slate-500'}`}>
                      Ready!
                    </span>
                  </div>
                </div>
                <Progress value={(currentStep / 4) * 100} className="h-2" />
              </div>
            </CardContent>
          </Card>
        )}

        {/* Main Creation Card */}
        <Card className="border-0 shadow-xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl">
                <MessageSquare className="h-4 w-4 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <CardTitle className="text-lg text-[16px] font-bold">Describe Your Automation</CardTitle>
                <CardDescription className="text-sm">
                  Tell me what you want to automate
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-900 dark:text-white">
                What would you like to automate?
              </label>
              <div className="relative">
                <Textarea
                  placeholder="e.g., 'When I get home after sunset, turn on my smart lights and set the thermostat to 72 degrees'"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  rows={4}
                  className="resize-none text-sm border-2 border-slate-200 dark:border-slate-700 focus:border-indigo-400 transition-colors w-full pr-20"
                />
                <Button
                  onClick={handleEnhancePrompt}
                  disabled={isEnhancing || !prompt.trim() || isGenerating}
                  variant="outline"
                  size="sm"
                  className="absolute top-2 right-2 h-8 px-2 bg-white dark:bg-slate-800 border-indigo-200 hover:border-indigo-300 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-all duration-200"
                >
                  {isEnhancing ? (
                    <Loader2 className="w-3 h-3 animate-spin" />
                  ) : (
                    <EnhanceIcon className="w-3 h-3" />
                  )}
                  <span className="ml-1 text-xs">Enhance</span>
                </Button>
              </div>
              <div className="flex items-start gap-2 text-xs text-slate-500">
                <Lightbulb className="w-3 h-3 mt-0.5 flex-shrink-0" />
                <span className="leading-relaxed">Be specific about triggers and actions for best results. Use the Enhance button to improve your prompt with AI.</span>
              </div>
            </div>

            <Button 
              onClick={handleGenerate}
              disabled={isGenerating || !prompt.trim()}
              className="w-full h-12 text-sm bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-300"
              size="lg"
            >
              {isGenerating ? (
                <>
                  <Brain className="w-4 h-4 mr-2 animate-pulse" />
                  AI is creating your macro...
                </>
              ) : (
                <>
                  <Wand2 className="w-4 h-4 mr-2" />
                  Generate with AI
                </>
              )}
            </Button>

            {aiResponse && !showPreview && (
              <Alert className={`${generationMethod === 'ai' ? 'border-emerald-200 bg-emerald-50 dark:bg-emerald-900/20' : 'border-amber-200 bg-amber-50 dark:bg-amber-900/20'}`}>
                <CheckCircle className={`h-4 w-4 ${generationMethod === 'ai' ? 'text-emerald-600' : 'text-amber-600'}`} />
                <AlertDescription className="text-sm">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className={`font-medium text-xs ${generationMethod === 'ai' ? 'text-emerald-800 dark:text-emerald-200' : 'text-amber-800 dark:text-amber-200'}`}>
                        {generationMethod === 'ai' ? 'AI Generation:' : 'Backup System:'}
                      </span>
                      <Badge 
                        variant={aiResponse.confidence > 0.8 ? "default" : "secondary"}
                        className={`text-xs ${aiResponse.confidence > 0.8 ? 'bg-emerald-500 hover:bg-emerald-600' : 'bg-amber-500 hover:bg-amber-600'}`}
                      >
                        {Math.round(aiResponse.confidence * 100)}%
                      </Badge>
                      {generationMethod === 'ai' && (
                        <Badge variant="outline" className="text-xs border-emerald-300 text-emerald-700">
                          AI-Powered
                        </Badge>
                      )}
                    </div>
                    <p className={`text-xs leading-relaxed ${generationMethod === 'ai' ? 'text-emerald-700 dark:text-emerald-300' : 'text-amber-700 dark:text-amber-300'}`}>
                      {aiResponse.explanation}
                    </p>
                    {generationMethod === 'fallback' && (
                      <p className="text-xs text-amber-600 dark:text-amber-400 mt-2 font-medium">
                        💡 Tip: Try again for AI-powered generation with advanced features
                      </p>
                    )}
                  </div>
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>

        {/* Example Prompts */}
        <Card className="border-0 shadow-xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm overflow-hidden">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-r from-amber-500 to-orange-600 rounded-xl flex-shrink-0">
                <Sparkles className="h-4 w-4 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <CardTitle className="text-lg truncate text-[15px] font-bold">Need Inspiration?</CardTitle>
                <CardDescription className="text-sm leading-relaxed">
                  Try these popular automation ideas
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-3 px-4">
            {examplePrompts.map((example, index) => (
              <Button
                key={index}
                variant="outline"
                className="group w-full h-auto p-3 justify-start text-left border-2 hover:border-indigo-300 hover:shadow-md transition-all duration-300 overflow-hidden"
                onClick={() => setPrompt(example.text)}
              >
                <div className="flex items-start gap-3 w-full min-w-0 overflow-hidden">
                  <div className="p-1.5 bg-slate-100 dark:bg-slate-700 rounded-lg group-hover:scale-110 transition-transform flex-shrink-0">
                    <example.icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0 overflow-hidden">
                    <div className="font-medium text-slate-900 dark:text-white text-sm leading-tight break-words whitespace-normal overflow-hidden">
                      {example.text}
                    </div>
                    <div className="mt-1">
                      <Badge variant="outline" className="text-xs">
                        {example.category}
                      </Badge>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all flex-shrink-0" />
                </div>
              </Button>
            ))}
          </CardContent>
        </Card>

        {/* Categories */}
        <Card className="border-0 shadow-xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-xl">
                <Zap className="h-4 w-4 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <CardTitle className="text-lg text-[15px] font-bold">Popular Categories</CardTitle>
                <CardDescription className="text-sm">
                  Explore different types of automation
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {mockCategories.map((category) => (
                <Badge 
                  key={category} 
                  variant="secondary" 
                  className="cursor-pointer px-3 py-1 text-xs hover:bg-indigo-100 hover:text-indigo-700 dark:hover:bg-indigo-900 dark:hover:text-indigo-300 transition-colors"
                >
                  {category}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}