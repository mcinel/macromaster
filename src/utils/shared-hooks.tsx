import { useState, useEffect } from 'react';
import { Macro } from '../App';
import { toast } from "sonner@2.0.3";

// Custom hook for local storage with automatic JSON parsing
export function useLocalStorage<T>(key: string, defaultValue: T) {
  const [value, setValue] = useState<T>(() => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch {
      return defaultValue;
    }
  });

  const setStoredValue = (newValue: T) => {
    try {
      setValue(newValue);
      localStorage.setItem(key, JSON.stringify(newValue));
    } catch (error) {
      console.error(`Error storing ${key}:`, error);
      toast.error('Failed to save data locally');
    }
  };

  return [value, setStoredValue] as const;
}

// Custom hook for async operations with loading and error states
export function useAsyncOperation<T, P extends any[]>(
  asyncFn: (...params: P) => Promise<T>,
  deps: React.DependencyList = []
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const execute = async (...params: P) => {
    try {
      setLoading(true);
      setError(null);
      const result = await asyncFn(...params);
      setData(result);
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Operation failed';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setData(null);
    setError(null);
    setLoading(false);
  };

  return { data, loading, error, execute, reset };
}

// Custom hook for debouncing values
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
}

// Custom hook for managing macro operations
export function useMacroOperations() {
  const [macros, setMacros] = useLocalStorage<Macro[]>('saved-macros', []);
  
  const addMacro = (macro: Macro) => {
    const updatedMacros = [...macros, { ...macro, id: `macro-${Date.now()}` }];
    setMacros(updatedMacros);
    toast.success('Macro saved successfully!');
  };

  const updateMacro = (id: string, updates: Partial<Macro>) => {
    const updatedMacros = macros.map(macro => 
      macro.id === id ? { ...macro, ...updates } : macro
    );
    setMacros(updatedMacros);
    toast.success('Macro updated successfully!');
  };

  const deleteMacro = (id: string) => {
    const updatedMacros = macros.filter(macro => macro.id !== id);
    setMacros(updatedMacros);
    toast.success('Macro deleted successfully!');
  };

  const toggleMacro = (id: string) => {
    const macro = macros.find(m => m.id === id);
    if (macro) {
      updateMacro(id, { isEnabled: !macro.isEnabled });
      toast.success(macro.isEnabled ? 'Macro disabled' : 'Macro enabled');
    }
  };

  return {
    macros,
    addMacro,
    updateMacro,
    deleteMacro,
    toggleMacro
  };
}

// Custom hook for managing theme
export function useTheme() {
  const [isDark, setIsDark] = useLocalStorage('theme-dark', false);

  const toggleTheme = () => {
    const newValue = !isDark;
    setIsDark(newValue);
    
    if (newValue) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    
    toast.success(newValue ? 'Dark mode enabled' : 'Light mode enabled');
  };

  // Apply theme on mount
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    }
  }, []);

  return { isDark, toggleTheme };
}

// Custom hook for form validation
export function useFormValidation<T>(
  initialValues: T,
  validationRules: Record<keyof T, (value: any) => string | null>
) {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});
  const [touched, setTouched] = useState<Partial<Record<keyof T, boolean>>>({});

  const validateField = (name: keyof T, value: any) => {
    const rule = validationRules[name];
    return rule ? rule(value) : null;
  };

  const setFieldValue = (name: keyof T, value: any) => {
    setValues(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const setFieldTouched = (name: keyof T, isTouched: boolean = true) => {
    setTouched(prev => ({ ...prev, [name]: isTouched }));
    
    // Validate field when it's touched
    if (isTouched) {
      const error = validateField(name, values[name]);
      setErrors(prev => ({ ...prev, [name]: error || undefined }));
    }
  };

  const validateAll = () => {
    const newErrors: Partial<Record<keyof T, string>> = {};
    let isValid = true;

    Object.keys(validationRules).forEach(key => {
      const fieldName = key as keyof T;
      const error = validateField(fieldName, values[fieldName]);
      if (error) {
        newErrors[fieldName] = error;
        isValid = false;
      }
    });

    setErrors(newErrors);
    setTouched(Object.keys(validationRules).reduce((acc, key) => ({ 
      ...acc, 
      [key]: true 
    }), {}));

    return isValid;
  };

  const reset = () => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
  };

  return {
    values,
    errors,
    touched,
    setFieldValue,
    setFieldTouched,
    validateAll,
    reset,
    isValid: Object.keys(errors).length === 0
  };
}