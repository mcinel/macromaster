import { Hono } from 'npm:hono';
import { cors } from 'npm:hono/cors';
import { logger } from 'npm:hono/logger';
import * as kv from './kv_store.tsx';
import { androidExecutor } from './android-executor.tsx';
import { permissionManager, ANDROID_PERMISSIONS } from './permissions.tsx';

const app = new Hono();

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Health check endpoint
app.get("/make-server-c7d9e72f/health", (c) => {
  return c.json({ status: "ok" });
});

// Main endpoint
app.get('/make-server-c7d9e72f/', (c) => {
  return c.json({ message: 'MacroMaster Android Execution Server' });
});

// Permission management routes
app.get('/make-server-c7d9e72f/permissions', (c) => {
  return c.json({
    permissions: permissionManager.getAllPermissions(),
    granted: permissionManager.getGrantedPermissions()
  });
});

app.post('/make-server-c7d9e72f/permissions/request', async (c) => {
  try {
    const { permission } = await c.req.json();
    
    if (!permission) {
      return c.json({ error: 'Permission name is required' }, 400);
    }
    
    const result = await permissionManager.requestPermission(permission);
    return c.json(result);
    
  } catch (error) {
    console.error('Error requesting permission:', error);
    return c.json({ error: 'Failed to request permission' }, 500);
  }
});

app.post('/make-server-c7d9e72f/permissions/request-multiple', async (c) => {
  try {
    const { permissions } = await c.req.json();
    
    if (!permissions || !Array.isArray(permissions)) {
      return c.json({ error: 'Permissions array is required' }, 400);
    }
    
    const results = await permissionManager.requestMultiplePermissions(permissions);
    return c.json({ results });
    
  } catch (error) {
    console.error('Error requesting multiple permissions:', error);
    return c.json({ error: 'Failed to request permissions' }, 500);
  }
});

app.post('/make-server-c7d9e72f/permissions/check-macro', async (c) => {
  try {
    const { macro } = await c.req.json();
    
    if (!macro) {
      return c.json({ error: 'Macro is required' }, 400);
    }
    
    const result = await permissionManager.checkMacroPermissions(macro);
    return c.json(result);
    
  } catch (error) {
    console.error('Error checking macro permissions:', error);
    return c.json({ error: 'Failed to check macro permissions' }, 500);
  }
});

// Macro execution routes
app.post('/make-server-c7d9e72f/macro/execute', async (c) => {
  try {
    const { macro, executionMode = 'demo' } = await c.req.json();
    
    if (!macro) {
      return c.json({ error: 'Macro is required' }, 400);
    }
    
    console.log(`Executing macro in ${executionMode} mode`);
    
    // Set execution mode on the executor
    androidExecutor.setMode(executionMode);
    
    // Check permissions first (skip for demo mode)
    if (executionMode !== 'demo') {
      const permissionCheck = await permissionManager.checkMacroPermissions(macro);
      if (!permissionCheck.allGranted) {
        return c.json({ 
          error: 'Missing required permissions',
          missingPermissions: permissionCheck.missing
        }, 403);
      }
    }
    
    // Start execution
    const executionId = await androidExecutor.startMacroExecution(macro.id, macro.steps);
    
    return c.json({ 
      success: true,
      executionId,
      message: `Macro execution started in ${executionMode} mode`
    });
    
  } catch (error) {
    console.error('Error starting macro execution:', error);
    return c.json({ error: 'Failed to start macro execution' }, 500);
  }
});

app.get('/make-server-c7d9e72f/macro/execution/:executionId', async (c) => {
  try {
    const executionId = c.req.param('executionId');
    
    if (!executionId) {
      return c.json({ error: 'Execution ID is required' }, 400);
    }
    
    const execution = await androidExecutor.getExecutionStatus(executionId);
    
    if (!execution) {
      return c.json({ error: 'Execution not found' }, 404);
    }
    
    return c.json(execution);
    
  } catch (error) {
    console.error('Error getting execution status:', error);
    return c.json({ error: 'Failed to get execution status' }, 500);
  }
});

app.post('/make-server-c7d9e72f/macro/execution/:executionId/cancel', async (c) => {
  try {
    const executionId = c.req.param('executionId');
    
    if (!executionId) {
      return c.json({ error: 'Execution ID is required' }, 400);
    }
    
    const cancelled = await androidExecutor.cancelExecution(executionId);
    
    if (!cancelled) {
      return c.json({ error: 'Execution not found or already completed' }, 404);
    }
    
    return c.json({ success: true, message: 'Execution cancelled' });
    
  } catch (error) {
    console.error('Error cancelling execution:', error);
    return c.json({ error: 'Failed to cancel execution' }, 500);
  }
});

// Individual action execution (for testing)
app.post('/make-server-c7d9e72f/action/execute', async (c) => {
  try {
    const { action } = await c.req.json();
    
    if (!action) {
      return c.json({ error: 'Action is required' }, 400);
    }
    
    const result = await androidExecutor.executeAction(action);
    return c.json(result);
    
  } catch (error) {
    console.error('Error executing action:', error);
    return c.json({ error: 'Failed to execute action' }, 500);
  }
});

// Device capabilities check
app.get('/make-server-c7d9e72f/device/capabilities', (c) => {
  return c.json({
    android: {
      version: '13',
      apiLevel: 33,
      brand: 'Android',
      model: 'Simulator'
    },
    supportedActions: [
      'set_volume',
      'set_brightness',
      'toggle_wifi',
      'toggle_bluetooth',
      'set_do_not_disturb',
      'send_notification',
      'launch_app',
      'close_app',
      'set_ringer_mode',
      'toggle_location',
      'set_alarm',
      'send_sms',
      'make_call',
      'control_media',
      'toggle_flashlight',
      'set_wallpaper'
    ],
    limitations: [
      'Some actions require root access or system-level permissions',
      'Signature permissions require special app configuration',
      'Location and camera permissions require user consent'
    ]
  });
});

// AI prompt enhancement endpoint
app.post('/make-server-c7d9e72f/ai/enhance-prompt', async (c) => {
  try {
    const { prompt } = await c.req.json();
    
    if (!prompt || prompt.trim().length === 0) {
      return c.json({ error: 'Prompt is required' }, 400);
    }
    
    const apiKey = Deno.env.get('OPENAI_API_KEY');
    if (!apiKey) {
      return c.json({ error: 'OpenAI API key not configured' }, 500);
    }
    
    const systemPrompt = `You are an expert assistant for Android automation apps. Your role is to enhance user prompts for creating automation macros by making them more comprehensive, specific, and actionable.

Guidelines:
1. Make the prompt more specific and detailed
2. Include relevant triggers, conditions, and actions
3. Consider Android-specific capabilities and limitations
4. Suggest appropriate permissions that might be needed
5. Make the automation more robust and user-friendly
6. Keep the enhanced prompt concise but comprehensive
7. Focus on practical Android automation scenarios

Input prompt: "${prompt}"

Please provide an enhanced version that is more detailed, specific, and comprehensive for Android automation. Return only the enhanced prompt text, no explanations or additional formatting.`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: systemPrompt
          }
        ],
        max_tokens: 400,
        temperature: 0.8,
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('OpenAI API error:', errorData);
      return c.json({ error: 'Failed to enhance prompt with AI' }, 500);
    }

    const data = await response.json();
    const enhancedPrompt = data.choices?.[0]?.message?.content?.trim();

    if (!enhancedPrompt) {
      return c.json({ error: 'No enhanced prompt received from AI' }, 500);
    }

    return c.json({
      originalPrompt: prompt,
      enhancedPrompt: enhancedPrompt,
      success: true
    });

  } catch (error) {
    console.error('Error enhancing prompt with AI:', error);
    return c.json({ error: 'Failed to enhance prompt' }, 500);
  }
});

// Macro storage management routes
// Get all macros
app.get('/make-server-c7d9e72f/macros', async (c) => {
  try {
    console.log('Fetching all macros...');
    const macros = await kv.getByPrefix('macro:');
    console.log(`Retrieved ${macros.length} macros from storage`);
    return c.json({ macros, success: true });
  } catch (error) {
    console.error('Error fetching macros:', error);
    return c.json({ 
      error: 'Failed to fetch macros',
      details: error instanceof Error ? error.message : String(error)
    }, 500);
  }
});

// Get a single macro by ID
app.get('/make-server-c7d9e72f/macros/:id', async (c) => {
  try {
    const id = c.req.param('id');
    const macro = await kv.get(`macro:${id}`);
    
    if (!macro) {
      return c.json({ error: 'Macro not found' }, 404);
    }
    
    return c.json({ macro, success: true });
  } catch (error) {
    console.error('Error fetching macro:', error);
    return c.json({ error: 'Failed to fetch macro' }, 500);
  }
});

// Create a new macro
app.post('/make-server-c7d9e72f/macros', async (c) => {
  try {
    const macro = await c.req.json();
    
    if (!macro.id || !macro.name) {
      return c.json({ error: 'Macro ID and name are required' }, 400);
    }
    
    // Add timestamps
    const newMacro = {
      ...macro,
      createdAt: macro.createdAt || new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString(),
      runCount: macro.runCount || 0
    };
    
    await kv.set(`macro:${macro.id}`, newMacro);
    
    return c.json({ macro: newMacro, success: true });
  } catch (error) {
    console.error('Error creating macro:', error);
    return c.json({ error: 'Failed to create macro' }, 500);
  }
});

// Update an existing macro
app.put('/make-server-c7d9e72f/macros/:id', async (c) => {
  try {
    const id = c.req.param('id');
    const updates = await c.req.json();
    
    const existing = await kv.get(`macro:${id}`);
    
    if (!existing) {
      return c.json({ error: 'Macro not found' }, 404);
    }
    
    const updatedMacro = {
      ...existing,
      ...updates,
      id, // Preserve the ID
      updatedAt: new Date().toISOString()
    };
    
    await kv.set(`macro:${id}`, updatedMacro);
    
    return c.json({ macro: updatedMacro, success: true });
  } catch (error) {
    console.error('Error updating macro:', error);
    return c.json({ error: 'Failed to update macro' }, 500);
  }
});

// Delete a macro
app.delete('/make-server-c7d9e72f/macros/:id', async (c) => {
  try {
    const id = c.req.param('id');
    
    const existing = await kv.get(`macro:${id}`);
    
    if (!existing) {
      return c.json({ error: 'Macro not found' }, 404);
    }
    
    await kv.del(`macro:${id}`);
    
    return c.json({ success: true, message: 'Macro deleted' });
  } catch (error) {
    console.error('Error deleting macro:', error);
    return c.json({ error: 'Failed to delete macro' }, 500);
  }
});

// Increment macro run count
app.post('/make-server-c7d9e72f/macros/:id/run', async (c) => {
  try {
    const id = c.req.param('id');
    
    console.log(`Recording run for macro: ${id}`);
    
    const macro = await kv.get(`macro:${id}`);
    
    if (!macro) {
      console.error(`Macro not found in storage: macro:${id}`);
      
      // Check if any macros exist
      const allMacros = await kv.getByPrefix('macro:');
      console.log(`Total macros in storage: ${allMacros.length}`);
      
      return c.json({ 
        error: 'Macro not found',
        details: `Looking for macro:${id}, found ${allMacros.length} total macros`
      }, 404);
    }
    
    const updatedMacro = {
      ...macro,
      runCount: (macro.runCount || 0) + 1,
      lastRun: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString()
    };
    
    await kv.set(`macro:${id}`, updatedMacro);
    
    console.log(`Successfully recorded run for macro: ${id}`);
    
    return c.json({ macro: updatedMacro, success: true });
  } catch (error) {
    console.error('Error updating macro run count:', error);
    return c.json({ 
      error: 'Failed to update macro run count',
      details: error instanceof Error ? error.message : String(error)
    }, 500);
  }
});

// Initialize default macros (useful for first-time users)
app.post('/make-server-c7d9e72f/macros/initialize', async (c) => {
  try {
    const { macros } = await c.req.json();
    
    if (!macros || !Array.isArray(macros)) {
      return c.json({ error: 'Macros array is required' }, 400);
    }
    
    // Only initialize if no macros exist
    const existing = await kv.getByPrefix('macro:');
    
    if (existing.length > 0) {
      return c.json({ 
        success: true, 
        message: 'Macros already initialized',
        count: existing.length 
      });
    }
    
    // Store all default macros
    // mset expects two arrays: keys and values
    const keys = macros.map(macro => `macro:${macro.id}`);
    const values = macros.map(macro => ({
      ...macro,
      createdAt: macro.createdAt || new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString()
    }));
    
    await kv.mset(keys, values);
    
    return c.json({ 
      success: true, 
      message: 'Default macros initialized',
      count: macros.length
    });
  } catch (error) {
    console.error('Error initializing macros:', error);
    return c.json({ error: 'Failed to initialize macros' }, 500);
  }
});

// AI macro generation endpoint
app.post('/make-server-c7d9e72f/ai/generate-macro', async (c) => {
  try {
    const { prompt } = await c.req.json();
    
    if (!prompt || prompt.trim().length === 0) {
      return c.json({ error: 'Prompt is required' }, 400);
    }
    
    const apiKey = Deno.env.get('OPENAI_API_KEY');
    if (!apiKey) {
      return c.json({ error: 'OpenAI API key not configured' }, 500);
    }
    
    const systemPrompt = `You are an expert Android automation macro generator specializing in creating sophisticated, practical automation workflows. Your expertise covers Android system APIs, user behavior patterns, and intelligent automation design.

## AVAILABLE ANDROID ACTIONS & CAPABILITIES:

### Device Control:
- set_volume: Control system/media/alarm/notification volume (0-100)
- set_brightness: Adjust screen brightness (0-100, auto mode)
- toggle_wifi: Enable/disable WiFi with network preference
- toggle_bluetooth: Enable/disable Bluetooth with device pairing
- set_do_not_disturb: Configure DND (silent, vibrate, priority only, custom rules)
- set_ringer_mode: Change ringer (silent, vibrate, normal, custom profiles)
- toggle_location: Enable/disable GPS with accuracy settings
- toggle_flashlight: Control camera flash as flashlight
- set_wallpaper: Change home/lock screen wallpapers

### App & Communication:
- launch_app: Open specific apps with intent data
- close_app: Force close or background apps
- send_notification: Custom notifications with actions/priority
- send_sms: Send text messages with delivery confirmation
- make_call: Initiate calls with number validation
- control_media: Play/pause/skip media with app targeting

### System & Scheduling:
- set_alarm: Create alarms with custom tones/repeat patterns
- create_calendar_event: Schedule events with reminders
- manage_contacts: Add/update contact information
- file_operations: Copy/move/delete files with permissions

### Smart Triggers:
- time_trigger: Specific times, recurring schedules, sunrise/sunset
- battery_trigger: Level thresholds, charging state, power saving
- location_trigger: GPS coordinates, geofences, movement detection
- app_trigger: Launch/close events, usage time limits
- connectivity_trigger: WiFi networks, Bluetooth devices, cellular state
- sensor_trigger: Motion, proximity, ambient light, orientation
- calendar_trigger: Event-based triggers with time offsets
- weather_trigger: Conditions, temperature, alerts

## ANDROID PERMISSIONS (be specific):
- MODIFY_AUDIO_SETTINGS: Volume control
- WRITE_SETTINGS: System settings modification
- CHANGE_WIFI_STATE: WiFi control
- BLUETOOTH_ADMIN: Bluetooth management  
- ACCESS_NOTIFICATION_POLICY: DND configuration
- SEND_SMS: Text messaging
- CALL_PHONE: Making phone calls
- ACCESS_FINE_LOCATION: GPS location
- CAMERA: Camera/flashlight access
- WRITE_EXTERNAL_STORAGE: File operations
- SET_WALLPAPER: Wallpaper changes
- WAKE_LOCK: Keep device awake
- RECEIVE_BOOT_COMPLETED: Auto-start macros

## MACRO CATEGORIES:
Sleep & Rest, Battery & Power, Productivity, Home Automation, Transportation, Communication, Security, Entertainment, Health & Fitness, Work & Business

## DESIGN PRINCIPLES:
1. Create multi-step workflows that solve real problems
2. Include intelligent conditions and error handling
3. Consider user context and behavior patterns  
4. Optimize for battery life and performance
5. Use appropriate Android Material Design icons
6. Provide clear, actionable descriptions
7. Include safety checks for destructive actions

## LUCIDE ICONS (use these exactly):
Clock, Battery, Wifi, Bluetooth, Bell, Volume2, VolumeX, Sun, Moon, Smartphone, Car, Home, Briefcase, Shield, Zap, Settings, Phone, MessageSquare, Calendar, Camera, MapPin, Headphones, Play, Pause, User, Lock, Unlock, Eye, EyeOff

User Request: "${prompt}"

Generate a comprehensive Android automation macro that intelligently addresses this request. Create multiple logical steps with proper triggers, conditions, and actions. Return only valid JSON in this exact format:

{
  "macro": {
    "name": "Descriptive and engaging macro name",
    "description": "Clear explanation of what the macro accomplishes",
    "category": "Most appropriate category from the list",
    "permissions": ["SPECIFIC_ANDROID_PERMISSIONS"],
    "steps": [
      {
        "id": "step1",
        "type": "trigger",
        "title": "Descriptive trigger name",
        "description": "When this trigger condition is met",
        "icon": "ExactLucideIconName",
        "settings": {"detailed": "configuration", "options": "here"}
      },
      {
        "id": "step2",
        "type": "condition", 
        "title": "Optional condition check",
        "description": "Additional logic to validate execution",
        "icon": "ExactLucideIconName", 
        "settings": {"condition": "parameters"}
      },
      {
        "id": "step3",
        "type": "action",
        "title": "Primary action name", 
        "description": "What action is performed",
        "icon": "ExactLucideIconName",
        "settings": {"action": "specific", "parameters": "here"}
      }
    ]
  },
  "explanation": "Detailed technical explanation of how this macro works, why these steps were chosen, and what benefits it provides to the user",
  "confidence": 0.85
}`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: systemPrompt
          }
        ],
        max_tokens: 1500,
        temperature: 0.8,
        response_format: { type: "json_object" }
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('OpenAI API error:', errorData);
      return c.json({ error: 'Failed to generate macro with AI' }, 500);
    }

    const data = await response.json();
    const macroResponse = data.choices?.[0]?.message?.content?.trim();

    if (!macroResponse) {
      return c.json({ error: 'No macro response received from AI' }, 500);
    }

    try {
      const parsedResponse = JSON.parse(macroResponse);
      
      // Add generated ID and timestamp to the macro
      if (parsedResponse.macro) {
        parsedResponse.macro.id = `ai-generated-${Date.now()}`;
        parsedResponse.macro.isEnabled = false;
        parsedResponse.macro.createdAt = new Date().toISOString().split('T')[0];
        parsedResponse.macro.runCount = 0;
      }

      return c.json({
        ...parsedResponse,
        success: true,
        originalPrompt: prompt
      });

    } catch (parseError) {
      console.error('Error parsing AI response:', parseError);
      console.error('Raw AI response:', macroResponse);
      return c.json({ error: 'Invalid response format from AI' }, 500);
    }

  } catch (error) {
    console.error('Error generating macro with AI:', error);
    return c.json({ error: 'Failed to generate macro' }, 500);
  }
});

Deno.serve(app.fetch);