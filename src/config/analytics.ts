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
  
  // Debug mode
  DEBUG: import.meta.env.DEV || false,
};

// Environment variables to add to your .env file:
// VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX
// VITE_ENABLE_GA=true
// VITE_ENABLE_CLARITY=true
