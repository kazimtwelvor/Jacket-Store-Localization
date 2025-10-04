'use client';

import { useEffect } from 'react';
import clarity from '@microsoft/clarity';

const CLARITY_PROJECT_ID = 'tkxwacrc5g';

export function ClarityProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Initialize Clarity only on client side
    if (typeof window !== 'undefined') {
      try {
        // Initialize Clarity with your project ID
        clarity.init(CLARITY_PROJECT_ID);
        
        // Optional: Set custom session data
        clarity.setTag('userId', 'anonymous');
        clarity.setTag('pageTitle', document.title);
        
        console.log('Microsoft Clarity initialized successfully');
      } catch (error) {
        console.error('Failed to initialize Microsoft Clarity:', error);
      }
    }
  }, []);

  return <>{children}</>;
}

// Hook for programmatic Clarity interactions
export function useClarity() {
  const trackEvent = (eventName: string, data?: any) => {
    if (typeof window !== 'undefined' && window.clarity) {
      try {
        clarity.event(eventName, data);
      } catch (error) {
        console.error('Failed to track Clarity event:', error);
      }
    }
  };

  const setCustomTag = (key: string, value: string) => {
    if (typeof window !== 'undefined' && window.clarity) {
      try {
        clarity.setTag(key, value);
      } catch (error) {
        console.error('Failed to set Clarity custom tag:', error);
      }
    }
  };

  const identifyUser = (userId: string, sessionId?: string, pageId?: string, friendlyName?: string) => {
    if (typeof window !== 'undefined' && window.clarity) {
      try {
        clarity.identify(userId, sessionId, pageId, friendlyName);
      } catch (error) {
        console.error('Failed to identify user in Clarity:', error);
      }
    }
  };

  return {
    trackEvent,
    setCustomTag,
    identifyUser,
  };
}
