import { useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { 
  trackPageView, 
  trackEvent, 
  trackUserEngagement, 
  trackLoanEvent, 
  trackAuthEvent, 
  trackInvestmentEvent,
  checkGAStatus
} from '@/lib/analytics';
import { ANALYTICS_CONFIG } from '@/config/analytics';

export const useAnalytics = () => {
  const location = useLocation();
  const [isReady, setIsReady] = useState(false);

  // Check if GA is ready and retry if needed
  useEffect(() => {
    const checkAndWaitForGA = () => {
      if (checkGAStatus()) {
        setIsReady(true);
        console.log('✅ Analytics: GA is ready');
      } else {
        console.log('⏳ Analytics: GA not ready, retrying in 2 seconds...');
        setTimeout(checkAndWaitForGA, 2000);
      }
    };

    // Start checking after a short delay to allow scripts to load
    setTimeout(checkAndWaitForGA, 1000);
  }, []);

  // Auto-track page views
  useEffect(() => {
    if (ANALYTICS_CONFIG.ENABLE_GOOGLE_ANALYTICS && isReady) {
      trackPageView(location.pathname, document.title);
    }
  }, [location.pathname, isReady]);

  const trackPageViewEvent = useCallback((url: string, title?: string) => {
    if (ANALYTICS_CONFIG.ENABLE_GOOGLE_ANALYTICS && isReady) {
      trackPageView(url, title);
    } else {
      console.warn('⚠️ Analytics: Cannot track page view - GA not ready or disabled');
    }
  }, [isReady]);

  const trackCustomEvent = useCallback((action: string, category: string, label?: string, value?: number) => {
    if (ANALYTICS_CONFIG.ENABLE_GOOGLE_ANALYTICS && isReady) {
      trackEvent(action, category, label, value);
    } else {
      console.warn('⚠️ Analytics: Cannot track event - GA not ready or disabled');
    }
  }, [isReady]);

  const trackUserAction = useCallback((action: string, details?: Record<string, any>) => {
    if (ANALYTICS_CONFIG.ENABLE_GOOGLE_ANALYTICS && isReady) {
      trackUserEngagement(action, details);
    } else {
      console.warn('⚠️ Analytics: Cannot track user action - GA not ready or disabled');
    }
  }, [isReady]);

  const trackLoanAction = useCallback((action: 'loan_requested' | 'loan_approved' | 'loan_rejected' | 'investment_made', details?: Record<string, any>) => {
    if (ANALYTICS_CONFIG.ENABLE_GOOGLE_ANALYTICS && isReady) {
      trackLoanEvent(action, details);
    } else {
      console.warn('⚠️ Analytics: Cannot track loan action - GA not ready or disabled');
    }
  }, [isReady]);

  const trackAuthAction = useCallback((action: 'sign_up' | 'login' | 'logout', method?: string) => {
    if (ANALYTICS_CONFIG.ENABLE_GOOGLE_ANALYTICS && isReady) {
      trackAuthEvent(action, method);
    } else {
      console.warn('⚠️ Analytics: Cannot track auth action - GA not ready or disabled');
    }
  }, [isReady]);

  const trackInvestmentAction = useCallback((action: 'investment_viewed' | 'investment_clicked' | 'investment_completed', details?: Record<string, any>) => {
    if (ANALYTICS_CONFIG.ENABLE_GOOGLE_ANALYTICS && isReady) {
      trackInvestmentEvent(action, details);
    } else {
      console.warn('⚠️ Analytics: Cannot track investment action - GA not ready or disabled');
    }
  }, [isReady]);

  return {
    trackPageView: trackPageViewEvent,
    trackEvent: trackCustomEvent,
    trackUserAction,
    trackLoanAction,
    trackAuthAction,
    trackInvestmentAction,
    isEnabled: ANALYTICS_CONFIG.ENABLE_GOOGLE_ANALYTICS,
    isReady,
  };
};
