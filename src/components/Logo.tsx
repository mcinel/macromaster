import React from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'xxl';
  variant?: 'default' | 'white' | 'dark' | 'gradient';
  showText?: boolean;
  className?: string;
}

export function Logo({ 
  size = 'md', 
  variant = 'default', 
  showText = true, 
  className = '' 
}: LogoProps) {
  const sizeMap = {
    sm: { icon: 24, text: 'text-lg' },
    md: { icon: 32, text: 'text-xl' },
    lg: { icon: 48, text: 'text-2xl' },
    xl: { icon: 64, text: 'text-3xl' },
    xxl: { icon: 96, text: 'text-4xl' }
  };

  const { icon: iconSize, text: textSize } = sizeMap[size];

  const getColors = () => {
    switch (variant) {
      case 'white':
        return {
          primary: '#ffffff',
          secondary: '#f8fafc',
          accent: '#e2e8f0',
          text: 'text-white'
        };
      case 'dark':
        return {
          primary: '#1e293b',
          secondary: '#334155',
          accent: '#475569',
          text: 'text-slate-900'
        };
      case 'gradient':
        return {
          primary: 'url(#logoGradient1)',
          secondary: 'url(#logoGradient2)',
          accent: 'url(#logoGradient3)',
          text: 'text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600'
        };
      default:
        return {
          primary: '#6366f1',
          secondary: '#8b5cf6',
          accent: '#06b6d4',
          text: 'text-slate-900 dark:text-white'
        };
    }
  };

  const colors = getColors();

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className="relative">
        <svg
          width={iconSize}
          height={iconSize}
          viewBox="0 0 64 64"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="drop-shadow-lg"
        >
          {/* Gradient Definitions */}
          <defs>
            <linearGradient id="logoGradient1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#6366f1" />
              <stop offset="100%" stopColor="#8b5cf6" />
            </linearGradient>
            <linearGradient id="logoGradient2" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#06b6d4" />
              <stop offset="100%" stopColor="#0891b2" />
            </linearGradient>
            <linearGradient id="logoGradient3" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#10b981" />
              <stop offset="100%" stopColor="#059669" />
            </linearGradient>
            <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
              <feMerge> 
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>

          {/* Background Circle */}
          <circle
            cx="32"
            cy="32"
            r="28"
            fill={colors.primary}
            opacity="0.1"
            className="animate-pulse-slow"
          />

          {/* Main Logo Shape - Abstract Automation Flow */}
          {/* Central Processing Node */}
          <circle
            cx="32"
            cy="32"
            r="8"
            fill={colors.primary}
            filter="url(#glow)"
          />
          
          {/* Inner Core */}
          <circle
            cx="32"
            cy="32"
            r="4"
            fill={colors.secondary}
          />

          {/* Connection Nodes */}
          <circle cx="16" cy="20" r="3" fill={colors.accent} opacity="0.8" />
          <circle cx="48" cy="20" r="3" fill={colors.accent} opacity="0.8" />
          <circle cx="16" cy="44" r="3" fill={colors.accent} opacity="0.8" />
          <circle cx="48" cy="44" r="3" fill={colors.accent} opacity="0.8" />

          {/* Connection Lines - Representing Automation Flow */}
          <path
            d="M19 20 L28 28"
            stroke={colors.primary}
            strokeWidth="2"
            strokeLinecap="round"
            opacity="0.7"
          />
          <path
            d="M45 20 L36 28"
            stroke={colors.primary}
            strokeWidth="2"
            strokeLinecap="round"
            opacity="0.7"
          />
          <path
            d="M19 44 L28 36"
            stroke={colors.primary}
            strokeWidth="2"
            strokeLinecap="round"
            opacity="0.7"
          />
          <path
            d="M45 44 L36 36"
            stroke={colors.primary}
            strokeWidth="2"
            strokeLinecap="round"
            opacity="0.7"
          />

          {/* AI Brain Pattern - Subtle Circuit Lines */}
          <path
            d="M8 32 L24 32"
            stroke={colors.secondary}
            strokeWidth="1.5"
            strokeLinecap="round"
            opacity="0.5"
            strokeDasharray="2,2"
          />
          <path
            d="M40 32 L56 32"
            stroke={colors.secondary}
            strokeWidth="1.5"
            strokeLinecap="round"
            opacity="0.5"
            strokeDasharray="2,2"
          />
          <path
            d="M32 8 L32 24"
            stroke={colors.secondary}
            strokeWidth="1.5"
            strokeLinecap="round"
            opacity="0.5"
            strokeDasharray="2,2"
          />
          <path
            d="M32 40 L32 56"
            stroke={colors.secondary}
            strokeWidth="1.5"
            strokeLinecap="round"
            opacity="0.5"
            strokeDasharray="2,2"
          />

          {/* Automation Arrows - Showing Flow Direction */}
          <path
            d="M20 16 L22 18 L20 20"
            stroke={colors.accent}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
          <path
            d="M44 16 L42 18 L44 20"
            stroke={colors.accent}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />

          {/* Sparkle Effects for AI Magic */}
          <circle cx="12" cy="12" r="1" fill={colors.secondary} opacity="0.8">
            <animate 
              attributeName="opacity" 
              values="0.8;0.2;0.8" 
              dur="3s" 
              repeatCount="indefinite"
            />
          </circle>
          <circle cx="52" cy="52" r="1" fill={colors.secondary} opacity="0.8">
            <animate 
              attributeName="opacity" 
              values="0.2;0.8;0.2" 
              dur="3s" 
              repeatCount="indefinite"
            />
          </circle>
          <circle cx="52" cy="12" r="1" fill={colors.accent} opacity="0.6">
            <animate 
              attributeName="opacity" 
              values="0.6;0.1;0.6" 
              dur="2s" 
              repeatCount="indefinite"
            />
          </circle>
        </svg>
      </div>

      {showText && (
        <div className="flex flex-col">
          <span className={`font-bold ${textSize} ${colors.text} leading-tight`}>
            MacroMaster
          </span>
          {size === 'lg' || size === 'xl' || size === 'xxl' ? (
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium tracking-wide">
              AI Automation
            </span>
          ) : null}
        </div>
      )}
    </div>
  );
}

// App Icon Version - Perfect for app stores and home screens
export function AppIcon({ size = 64, className = '' }: { size?: number; className?: string }) {
  return (
    <div className={`relative ${className}`} style={{ width: size, height: size }}>
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 via-purple-600 to-pink-600 rounded-xl shadow-2xl"></div>
      <div className="absolute inset-1 bg-gradient-to-br from-indigo-400 via-purple-500 to-pink-500 rounded-lg"></div>
      <svg
        width={size}
        height={size}
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="relative rounded-xl"
      >
        <rect width="64" height="64" rx="12" fill="url(#appIconGradient)" />
        
        <defs>
          <linearGradient id="appIconGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#6366f1" />
            <stop offset="50%" stopColor="#8b5cf6" />
            <stop offset="100%" stopColor="#ec4899" />
          </linearGradient>
        </defs>

        {/* Central Hub */}
        <circle cx="32" cy="32" r="6" fill="white" opacity="0.9" />
        <circle cx="32" cy="32" r="3" fill="white" />

        {/* Connection Points */}
        <circle cx="18" cy="22" r="2.5" fill="white" opacity="0.8" />
        <circle cx="46" cy="22" r="2.5" fill="white" opacity="0.8" />
        <circle cx="18" cy="42" r="2.5" fill="white" opacity="0.8" />
        <circle cx="46" cy="42" r="2.5" fill="white" opacity="0.8" />

        {/* Connection Lines */}
        <path d="M21 22 L29 30" stroke="white" strokeWidth="2" strokeLinecap="round" opacity="0.7" />
        <path d="M43 22 L35 30" stroke="white" strokeWidth="2" strokeLinecap="round" opacity="0.7" />
        <path d="M21 42 L29 34" stroke="white" strokeWidth="2" strokeLinecap="round" opacity="0.7" />
        <path d="M43 42 L35 34" stroke="white" strokeWidth="2" strokeLinecap="round" opacity="0.7" />

        {/* AI Sparkles */}
        <circle cx="14" cy="14" r="1" fill="white" opacity="0.6" />
        <circle cx="50" cy="14" r="1" fill="white" opacity="0.6" />
        <circle cx="14" cy="50" r="1" fill="white" opacity="0.6" />
        <circle cx="50" cy="50" r="1" fill="white" opacity="0.6" />
      </svg>
    </div>
  );
}

// Minimal Icon for small spaces
export function LogoIcon({ size = 32, variant = 'default' }: { size?: number; variant?: 'default' | 'white' | 'dark' }) {
  const getColor = () => {
    switch (variant) {
      case 'white': return '#ffffff';
      case 'dark': return '#1e293b';
      default: return '#6366f1';
    }
  };

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="16" cy="16" r="4" fill={getColor()} />
      <circle cx="16" cy="16" r="2" fill={variant === 'white' ? '#f8fafc' : '#8b5cf6'} />
      
      <circle cx="8" cy="10" r="1.5" fill={getColor()} opacity="0.7" />
      <circle cx="24" cy="10" r="1.5" fill={getColor()} opacity="0.7" />
      <circle cx="8" cy="22" r="1.5" fill={getColor()} opacity="0.7" />
      <circle cx="24" cy="22" r="1.5" fill={getColor()} opacity="0.7" />
      
      <path d="M9.5 10 L14 14" stroke={getColor()} strokeWidth="1" strokeLinecap="round" opacity="0.6" />
      <path d="M22.5 10 L18 14" stroke={getColor()} strokeWidth="1" strokeLinecap="round" opacity="0.6" />
      <path d="M9.5 22 L14 18" stroke={getColor()} strokeWidth="1" strokeLinecap="round" opacity="0.6" />
      <path d="M22.5 22 L18 18" stroke={getColor()} strokeWidth="1" strokeLinecap="round" opacity="0.6" />
    </svg>
  );
}