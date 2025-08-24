import { ANALYTICS_CONFIG } from '@/config/analytics';

// Google Analytics 4 Configuration
declare global {
  interface Window {
    gtag: (...args: any[]) => void;
    dataLayer: any[];
  }
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

// Initialize Google Analytics
export const initGA = (measurementId?: string) => {
  const id = measurementId || ANALYTICS_CONFIG.GOOGLE_ANALYTICS_ID;
  
  if (!checkGAStatus()) {
    console.warn('⚠️ Analytics: GA not ready, retrying in 1 second...');
    setTimeout(() => initGA(measurementId), 1000);
    return;
  }

  try {
    window.gtag('config', id, {
      page_title: document.title,
      page_location: window.location.href,
      debug_mode: ANALYTICS_CONFIG.DEBUG
    });
    console.log('✅ Analytics: GA initialized successfully');
  } catch (error) {
    console.error('❌ Analytics: Error initializing GA:', error);
  }
};

// Track page views
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

// Track custom events
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

// Track user engagement
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

// Track loan-related events
export const trackLoanEvent = (action: 'loan_requested' | 'loan_approved' | 'loan_rejected' | 'investment_made', details?: Record<string, any>) => {
  trackEvent(action, 'loan', undefined, undefined);
  if (details) {
    trackUserEngagement(action, details);
  }
};

// Track user registration/login
export const trackAuthEvent = (action: 'sign_up' | 'login' | 'logout', method?: string) => {
  trackEvent(action, 'authentication', method);
};

// Track investment events
export const trackInvestmentEvent = (action: 'investment_viewed' | 'investment_clicked' | 'investment_completed', details?: Record<string, any>) => {
  trackEvent(action, 'investment', undefined, undefined);
  if (details) {
    trackUserEngagement(action, details);
  }
};
