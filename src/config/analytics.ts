// Analytics Configuration
export const ANALYTICS_CONFIG = {
  // Google Analytics 4 Measurement ID
  // Replace G-XXXXXXXXXX with your actual GA4 measurement ID
  GOOGLE_ANALYTICS_ID: import.meta.env.VITE_GA_MEASUREMENT_ID || 'G-JFXMMEV7FX',
  
  // Microsoft Clarity Project ID
  CLARITY_PROJECT_ID: 'svs433sg0a',
  
  // Enable/disable analytics
  ENABLE_GOOGLE_ANALYTICS: import.meta.env.VITE_ENABLE_GA !== 'false',
  ENABLE_CLARITY: import.meta.env.VITE_ENABLE_CLARITY !== 'false',
  
  // Consent mode configuration
  CONSENT_MODE: {
    // Default consent state (before user makes choice)
    DEFAULT_CONSENT: {
      analytics_storage: 'denied',
      ad_storage: 'denied',
      ad_user_data: 'denied',
      ad_personalization: 'denied',
      functionality_storage: 'denied',
      personalization_storage: 'denied',
      security_storage: 'granted', // Always granted for security
    },
    
    // Consent mode update delay (ms)
    UPDATE_DELAY: 500,
  },
  
  // Debug mode
  DEBUG: import.meta.env.DEV || false,
};

// Environment variables to add to your .env file:
// VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX
// VITE_ENABLE_GA=true
// VITE_ENABLE_CLARITY=true
