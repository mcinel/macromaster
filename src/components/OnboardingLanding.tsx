import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Logo, AppIcon } from './Logo';
import { 
  ArrowRight, 
  Sparkles, 
  Zap, 
  Shield, 
  Smartphone, 
  Brain, 
  Target,
  CheckCircle,
  Play,
  Settings,
  Moon,
  Battery,
  Wifi,
  Volume2,
  Bell,
  Home,
  Car,
  Calendar,
  MessageSquare
} from 'lucide-react';

interface OnboardingLandingProps {
  onComplete: () => void;
}

export function OnboardingLanding({ onComplete }: OnboardingLandingProps) {
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    {
      id: 'welcome',
      title: 'Welcome to MacroMaster',
      description: 'Your AI-powered Android automation companion'
    },
    {
      id: 'features',
      title: 'Powerful Features',
      description: 'Discover what makes MacroMaster special'
    },
    {
      id: 'examples',
      title: 'Smart Automation',
      description: 'See real-world automation examples'
    },
    {
      id: 'ready',
      title: 'Ready to Start',
      description: 'Let\'s create your first macro'
    }
  ];

  const features = [
    {
      icon: Brain,
      title: 'AI-Powered Creation',
      description: 'Describe your automation in plain English and let AI build it for you',
      gradient: 'from-purple-500 to-indigo-600'
    },
    {
      icon: Shield,
      title: 'Smart Permissions',
      description: 'Intelligent permission management with detailed explanations',
      gradient: 'from-emerald-500 to-cyan-600'
    },
    {
      icon: Target,
      title: 'Precise Control',
      description: 'Fine-tune every aspect of your automation with advanced settings',
      gradient: 'from-orange-500 to-red-600'
    },
    {
      icon: Zap,
      title: 'Real-time Execution',
      description: 'Monitor and control your macros with live status updates',
      gradient: 'from-blue-500 to-purple-600'
    }
  ];

  const examples = [
    {
      icon: Moon,
      title: 'Silent Night',
      description: 'Automatically enable silent mode and dim screen at bedtime',
      category: 'Sleep & Rest',
      gradient: 'from-purple-500 to-indigo-600'
    },
    {
      icon: Battery,
      title: 'Power Saver',
      description: 'Turn off WiFi and reduce brightness when battery is low',
      category: 'Battery & Power',
      gradient: 'from-emerald-500 to-green-600'
    },
    {
      icon: Car,
      title: 'Driving Mode',
      description: 'Enable hands-free mode and launch navigation when driving',
      category: 'Transportation',
      gradient: 'from-blue-500 to-cyan-600'
    },
    {
      icon: Home,
      title: 'Home Arrival',
      description: 'Turn on lights and adjust temperature when you arrive home',
      category: 'Smart Home',
      gradient: 'from-amber-500 to-orange-600'
    }
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete();
    }
  };

  const handleSkip = () => {
    onComplete();
  };

  const renderWelcomeStep = () => (
    <div className="text-center space-y-8">
      <div className="space-y-6">
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 via-purple-500/20 to-pink-500/20 rounded-full blur-3xl"></div>
          <div className="relative">
            <Logo size="xxl" variant="gradient" showText={true} />
          </div>
        </div>
        
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-full border shadow-sm">
            <Sparkles className="w-4 h-4 text-indigo-600" />
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
              AI-Powered Android Automation
            </span>
          </div>
          
          <h2 className="text-slate-600 dark:text-slate-400 leading-relaxed text-[16px]">
            Create powerful automation macros with simple natural language commands
          </h2>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Card className="p-4 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 border-indigo-200 dark:border-indigo-800">
          <div className="text-center space-y-2">
            <Settings className="w-8 h-8 mx-auto text-indigo-600" />
            <p className="text-sm font-medium text-slate-900 dark:text-white">Easy Setup</p>
            <p className="text-xs text-slate-600 dark:text-slate-400">No coding required</p>
          </div>
        </Card>
        
        <Card className="p-4 bg-gradient-to-br from-emerald-50 to-cyan-50 dark:from-emerald-900/20 dark:to-cyan-900/20 border-emerald-200 dark:border-emerald-800">
          <div className="text-center space-y-2">
            <Smartphone className="w-8 h-8 mx-auto text-emerald-600" />
            <p className="text-sm font-medium text-slate-900 dark:text-white">Full Control</p>
            <p className="text-xs text-slate-600 dark:text-slate-400">Complete Android access</p>
          </div>
        </Card>
      </div>
    </div>
  );

  const renderFeaturesStep = () => (
    <div className="space-y-6">
      <div className="text-center space-y-3">
        <div className="p-3 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl inline-block">
          <Zap className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
          Powerful Features
        </h2>
        <p className="text-slate-600 dark:text-slate-400">
          Everything you need for advanced Android automation
        </p>
      </div>

      <div className="space-y-4">
        {features.map((feature, index) => (
          <Card key={index} className="p-4 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-0 shadow-lg">
            <div className="flex items-start gap-4">
              <div className={`p-3 bg-gradient-to-r ${feature.gradient} rounded-xl flex-shrink-0`}>
                <feature.icon className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-slate-900 dark:text-white mb-1">
                  {feature.title}
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderExamplesStep = () => (
    <div className="space-y-6">
      <div className="text-center space-y-3">
        <div className="p-3 bg-gradient-to-r from-emerald-500 to-cyan-600 rounded-2xl inline-block">
          <Target className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
          Smart Automation
        </h2>
        <p className="text-slate-600 dark:text-slate-400">
          Real-world automation examples you can create
        </p>
      </div>

      <div className="space-y-4">
        {examples.map((example, index) => (
          <Card key={index} className="p-4 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="flex items-start gap-4">
              <div className={`p-3 bg-gradient-to-r ${example.gradient} rounded-xl flex-shrink-0`}>
                <example.icon className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold text-slate-900 dark:text-white">
                    {example.title}
                  </h3>
                  <Badge variant="outline" className="text-xs">
                    {example.category}
                  </Badge>
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  {example.description}
                </p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderReadyStep = () => (
    <div className="text-center space-y-8">
      <div className="space-y-6">
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 via-cyan-500/20 to-blue-500/20 rounded-full blur-3xl"></div>
          <div className="relative p-6 bg-gradient-to-r from-emerald-500 to-cyan-600 rounded-3xl inline-block">
            <CheckCircle className="w-16 h-16 text-white" />
          </div>
        </div>
        
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            You're All Set!
          </h2>
          <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
            Ready to create your first AI-powered automation macro? Let's get started!
          </p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <Card className="p-4 bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 border-purple-200 dark:border-purple-800">
          <div className="text-center space-y-2">
            <Home className="w-6 h-6 mx-auto text-purple-600" />
            <p className="text-xs font-medium text-slate-900 dark:text-white">Dashboard</p>
          </div>
        </Card>
        
        <Card className="p-4 bg-gradient-to-br from-emerald-50 to-cyan-50 dark:from-emerald-900/20 dark:to-cyan-900/20 border-emerald-200 dark:border-emerald-800">
          <div className="text-center space-y-2">
            <Brain className="w-6 h-6 mx-auto text-emerald-600" />
            <p className="text-xs font-medium text-slate-900 dark:text-white">AI Creator</p>
          </div>
        </Card>
        
        <Card className="p-4 bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 border-orange-200 dark:border-orange-800">
          <div className="text-center space-y-2">
            <Play className="w-6 h-6 mx-auto text-orange-600" />
            <p className="text-xs font-medium text-slate-900 dark:text-white">Execute</p>
          </div>
        </Card>
      </div>
    </div>
  );

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 0: return renderWelcomeStep();
      case 1: return renderFeaturesStep();
      case 2: return renderExamplesStep();
      case 3: return renderReadyStep();
      default: return renderWelcomeStep();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50 to-purple-50 dark:from-slate-900 dark:via-indigo-900 dark:to-purple-900 overflow-x-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-20 h-20 bg-indigo-500/10 rounded-full blur-xl"></div>
        <div className="absolute top-40 right-10 w-32 h-32 bg-purple-500/10 rounded-full blur-xl"></div>
        <div className="absolute bottom-40 left-20 w-24 h-24 bg-cyan-500/10 rounded-full blur-xl"></div>
        <div className="absolute bottom-20 right-20 w-16 h-16 bg-pink-500/10 rounded-full blur-xl"></div>
      </div>

      <div className="relative w-full max-w-sm mx-auto px-4 py-8 min-h-screen flex flex-col">
        {/* Progress indicator */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex space-x-2">
            {steps.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index <= currentStep 
                    ? 'bg-gradient-to-r from-indigo-500 to-purple-600' 
                    : 'bg-slate-300 dark:bg-slate-600'
                }`}
              />
            ))}
          </div>
          
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleSkip}
            className="text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
          >
            Skip
          </Button>
        </div>

        {/* Main content */}
        <div className="flex-1 flex flex-col justify-center">
          <div className="space-y-8">
            {renderCurrentStep()}
          </div>
        </div>

        {/* Navigation buttons */}
        <div className="pt-8 space-y-4">
          <Button 
            onClick={handleNext}
            className="w-full h-14 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white shadow-lg"
            size="lg"
          >
            <span className="flex items-center gap-2">
              {currentStep === steps.length - 1 ? 'Get Started' : 'Continue'}
              <ArrowRight className="w-5 h-5" />
            </span>
          </Button>

          {currentStep > 0 && (
            <Button 
              variant="outline" 
              onClick={() => setCurrentStep(currentStep - 1)}
              className="w-full"
            >
              Back
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}