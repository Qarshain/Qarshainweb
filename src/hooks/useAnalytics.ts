import { useCallback, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useConsent } from '@/contexts/ConsentContext';
import { 
  trackPageView, 
  trackEvent, 
  trackUserEngagement, 
  trackLoanEvent, 
  trackAuthEvent, 
  trackInvestmentEvent,
  checkGAStatus,
  updateConsentMode
} from '@/lib/analytics';
import { ANALYTICS_CONFIG } from '@/config/analytics';

export const useAnalytics = () => {
  const location = useLocation();
  const { consent, hasConsented } = useConsent();
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

  // Update consent mode when user preferences change
  useEffect(() => {
    if (isReady && hasConsented) {
      // Add a small delay to ensure GA is fully ready
      const timer = setTimeout(() => {
        updateConsentMode(consent.analytics, consent.marketing);
      }, ANALYTICS_CONFIG.CONSENT_MODE.UPDATE_DELAY);

      return () => clearTimeout(timer);
    }
  }, [consent.analytics, consent.marketing, isReady, hasConsented]);

  // Auto-track page views (only if analytics consent is granted)
  useEffect(() => {
    if (ANALYTICS_CONFIG.ENABLE_GOOGLE_ANALYTICS && isReady && consent.analytics) {
      trackPageView(location.pathname, document.title);
    }
  }, [location.pathname, isReady, consent.analytics]);

  const trackPageViewEvent = useCallback((url: string, title?: string) => {
    if (ANALYTICS_CONFIG.ENABLE_GOOGLE_ANALYTICS && isReady && consent.analytics) {
      trackPageView(url, title);
    } else {
      console.warn('⚠️ Analytics: Cannot track page view - GA not ready, disabled, or consent not granted');
    }
  }, [isReady, consent.analytics]);

  const trackCustomEvent = useCallback((action: string, category: string, label?: string, value?: number) => {
    if (ANALYTICS_CONFIG.ENABLE_GOOGLE_ANALYTICS && isReady && consent.analytics) {
      trackEvent(action, category, label, value);
    } else {
      console.warn('⚠️ Analytics: Cannot track event - GA not ready, disabled, or consent not granted');
    }
  }, [isReady, consent.analytics]);

  const trackUserAction = useCallback((action: string, details?: Record<string, any>) => {
    if (ANALYTICS_CONFIG.ENABLE_GOOGLE_ANALYTICS && isReady && consent.analytics) {
      trackUserEngagement(action, details);
    } else {
      console.warn('⚠️ Analytics: Cannot track user action - GA not ready, disabled, or consent not granted');
    }
  }, [isReady, consent.analytics]);

  const trackLoanAction = useCallback((action: 'loan_requested' | 'loan_approved' | 'loan_rejected' | 'investment_made', details?: Record<string, any>) => {
    if (ANALYTICS_CONFIG.ENABLE_GOOGLE_ANALYTICS && isReady && consent.analytics) {
      trackLoanEvent(action, details);
    } else {
      console.warn('⚠️ Analytics: Cannot track loan action - GA not ready, disabled, or consent not granted');
    }
  }, [isReady, consent.analytics]);

  const trackAuthAction = useCallback((action: 'sign_up' | 'login' | 'logout', method?: string) => {
    if (ANALYTICS_CONFIG.ENABLE_GOOGLE_ANALYTICS && isReady && consent.analytics) {
      trackAuthEvent(action, method);
    } else {
      console.warn('⚠️ Analytics: Cannot track auth action - GA not ready, disabled, or consent not granted');
    }
  }, [isReady, consent.analytics]);

  const trackInvestmentAction = useCallback((action: 'investment_viewed' | 'investment_clicked' | 'investment_completed', details?: Record<string, any>) => {
    if (ANALYTICS_CONFIG.ENABLE_GOOGLE_ANALYTICS && isReady && consent.analytics) {
      trackInvestmentEvent(action, details);
    } else {
      console.warn('⚠️ Analytics: Cannot track investment action - GA not ready, disabled, or consent not granted');
    }
  }, [isReady, consent.analytics]);

  return {
    trackPageView: trackPageViewEvent,
    trackEvent: trackCustomEvent,
    trackUserAction,
    trackLoanAction,
    trackAuthAction,
    trackInvestmentAction,
    isEnabled: ANALYTICS_CONFIG.ENABLE_GOOGLE_ANALYTICS && consent.analytics,
    isReady,
    hasConsent: consent.analytics,
    consentPreferences: consent,
  };
};
