import { ANALYTICS_CONFIG } from '@/config/analytics';

// Google Analytics 4 Configuration
declare global {
  interface Window {
    gtag: (...args: any[]) => void;
    dataLayer: any[];
  }
}

// Consent mode types
export type ConsentState = 'granted' | 'denied';

export interface ConsentSettings {
  analytics_storage: ConsentState;
  ad_storage: ConsentState;
  ad_user_data: ConsentState;
  ad_personalization: ConsentState;
  functionality_storage: ConsentState;
  personalization_storage: ConsentState;
  security_storage: ConsentState;
}

// Debug function to check GA status
export const checkGAStatus = () => {
  if (typeof window === 'undefined') {
    console.log('🔍 Analytics: Running on server side');
    return false;
  }

  const hasGtag = typeof window.gtag !== 'undefined';
  const hasDataLayer = Array.isArray(window.dataLayer);
  
  console.log('🔍 Analytics Status Check:', {
    gtag: hasGtag,
    dataLayer: hasDataLayer,
    dataLayerLength: hasDataLayer ? window.dataLayer.length : 0,
    config: ANALYTICS_CONFIG
  });

  return hasGtag && hasDataLayer;
};

// Initialize Google Analytics with consent mode
export const initGA = (measurementId?: string) => {
  const id = measurementId || ANALYTICS_CONFIG.GOOGLE_ANALYTICS_ID;
  
  if (!checkGAStatus()) {
    console.warn('⚠️ Analytics: GA not ready, retrying in 1 second...');
    setTimeout(() => initGA(measurementId), 1000);
    return;
  }

  try {
    // Set default consent state
    window.gtag('consent', 'default', ANALYTICS_CONFIG.CONSENT_MODE.DEFAULT_CONSENT);
    
    // Initialize GA with consent mode
    window.gtag('config', id, {
      page_title: document.title,
      page_location: window.location.href,
      debug_mode: ANALYTICS_CONFIG.DEBUG,
      consent_mode: 'advanced'
    });
    
    console.log('✅ Analytics: GA initialized with consent mode');
  } catch (error) {
    console.error('❌ Analytics: Error initializing GA:', error);
  }
};

// Update consent mode based on user preferences
export const updateConsentMode = (analytics: boolean, marketing: boolean) => {
  if (!checkGAStatus()) {
    console.warn('⚠️ Analytics: Cannot update consent - GA not ready');
    return;
  }

  try {
    const consentSettings: ConsentSettings = {
      analytics_storage: analytics ? 'granted' : 'denied',
      ad_storage: marketing ? 'granted' : 'denied',
      ad_user_data: marketing ? 'granted' : 'denied',
      ad_personalization: marketing ? 'granted' : 'denied',
      functionality_storage: analytics ? 'granted' : 'denied',
      personalization_storage: analytics ? 'granted' : 'denied',
      security_storage: 'granted', // Always granted
    };

    window.gtag('consent', 'update', consentSettings);
    
    console.log('✅ Analytics: Consent mode updated:', consentSettings);
    
    // Track consent update event
    if (analytics) {
      window.gtag('event', 'consent_update', {
        event_category: 'privacy',
        event_label: `analytics:${analytics}, marketing:${marketing}`,
      });
    }
  } catch (error) {
    console.error('❌ Analytics: Error updating consent mode:', error);
  }
};

// Track page views (respects consent)
export const trackPageView = (url: string, title?: string) => {
  if (!checkGAStatus()) {
    console.warn('⚠️ Analytics: Cannot track page view - GA not ready');
    return;
  }

  try {
    window.gtag('config', ANALYTICS_CONFIG.GOOGLE_ANALYTICS_ID, {
      page_path: url,
      page_title: title || document.title,
    });
    console.log('📊 Analytics: Page view tracked:', { url, title });
  } catch (error) {
    console.error('❌ Analytics: Error tracking page view:', error);
  }
};

// Track custom events (respects consent)
export const trackEvent = (action: string, category: string, label?: string, value?: number) => {
  if (!checkGAStatus()) {
    console.warn('⚠️ Analytics: Cannot track event - GA not ready');
    return;
  }

  try {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
    });
    console.log('📊 Analytics: Event tracked:', { action, category, label, value });
  } catch (error) {
    console.error('❌ Analytics: Error tracking event:', error);
  }
};

// Track user engagement (respects consent)
export const trackUserEngagement = (action: string, details?: Record<string, any>) => {
  if (!checkGAStatus()) {
    console.warn('⚠️ Analytics: Cannot track user engagement - GA not ready');
    return;
  }

  try {
    window.gtag('event', action, details);
    console.log('📊 Analytics: User engagement tracked:', { action, details });
  } catch (error) {
    console.error('❌ Analytics: Error tracking user engagement:', error);
  }
};

// Track loan-related events (respects consent)
export const trackLoanEvent = (action: 'loan_requested' | 'loan_approved' | 'loan_rejected' | 'investment_made', details?: Record<string, any>) => {
  trackEvent(action, 'loan', undefined, undefined);
  if (details) {
    trackUserEngagement(action, details);
  }
};

// Track user registration/login (respects consent)
export const trackAuthEvent = (action: 'sign_up' | 'login' | 'logout', method?: string) => {
  trackEvent(action, 'authentication', method);
};

// Track investment events (respects consent)
export const trackInvestmentEvent = (action: 'investment_viewed' | 'investment_clicked' | 'investment_completed', details?: Record<string, any>) => {
  trackEvent(action, 'investment', undefined, undefined);
  if (details) {
    trackUserEngagement(action, details);
  }
};

// Check if analytics consent is granted
export const hasAnalyticsConsent = (): boolean => {
  if (typeof window === 'undefined') return false;
  
  try {
    // Check if gtag exists and consent is set
    if (typeof window.gtag === 'undefined') return false;
    
    // For now, we'll assume consent is granted if gtag exists
    // In a real implementation, you might want to check the actual consent state
    return true;
  } catch (error) {
    console.error('❌ Analytics: Error checking consent:', error);
    return false;
  }
};
