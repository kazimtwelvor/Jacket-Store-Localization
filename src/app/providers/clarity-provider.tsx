'use client';

import { useEffect } from 'react';
import clarity from '@microsoft/clarity';

const CLARITY_PROJECT_ID = 'tkxwacrc5g';

export function ClarityProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Initialize Clarity only on client side
    if (typeof window !== 'undefined') {
      try {
        clarity.init(CLARITY_PROJECT_ID);
        clarity.setTag('userId', 'anonymous');
        clarity.setTag('pageTitle', document.title);
        
      } catch (error) {
      }
    }
  }, []);

  return <>{children}</>;
}

export function useClarity() {
  const trackEvent = (eventName: string, data?: any) => {
    if (typeof window !== 'undefined' && window.clarity) {
      try {
        clarity.event(eventName, data);
      } catch (error) {
      }
    }
  };

  const setCustomTag = (key: string, value: string) => {
    if (typeof window !== 'undefined' && window.clarity) {
      try {
        clarity.setTag(key, value);
      } catch (error) {
      }
    }
  };

  const identifyUser = (userId: string, sessionId?: string, pageId?: string, friendlyName?: string) => {
    if (typeof window !== 'undefined' && window.clarity) {
      try {
        clarity.identify(userId, sessionId, pageId, friendlyName);
      } catch (error) {
      }
    }
  };

  return {
    trackEvent,
    setCustomTag,
    identifyUser,
  };
}
