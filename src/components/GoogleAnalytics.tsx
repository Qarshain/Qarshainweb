import { useEffect } from 'react';
import { useConsent } from '@/contexts/ConsentContext';
import { ANALYTICS_CONFIG } from '@/config/analytics';

export const GoogleAnalytics: React.FC = () => {
  const { consent, hasConsented } = useConsent();

  useEffect(() => {
    // Only load GA if it's enabled
    if (!ANALYTICS_CONFIG.ENABLE_GOOGLE_ANALYTICS) {
      return;
    }

    // Check if GA script is already loaded
    if (window.gtag) {
      return;
    }

    // Load Google Analytics script
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${ANALYTICS_CONFIG.GOOGLE_ANALYTICS_ID}`;
    document.head.appendChild(script);

    // Initialize gtag function
    window.dataLayer = window.dataLayer || [];
    window.gtag = function() {
      window.dataLayer.push(arguments);
    };

    // Set initial consent state
    window.gtag('consent', 'default', ANALYTICS_CONFIG.CONSENT_MODE.DEFAULT_CONSENT);

    // Initialize GA with consent mode
    window.gtag('config', ANALYTICS_CONFIG.GOOGLE_ANALYTICS_ID, {
      consent_mode: 'advanced',
      debug_mode: ANALYTICS_CONFIG.DEBUG,
    });

    // Update consent when user makes choice
    if (hasConsented) {
      const consentSettings = {
        analytics_storage: consent.analytics ? 'granted' : 'denied',
        ad_storage: consent.marketing ? 'granted' : 'denied',
        ad_user_data: consent.marketing ? 'granted' : 'denied',
        ad_personalization: consent.marketing ? 'granted' : 'denied',
        functionality_storage: consent.analytics ? 'granted' : 'denied',
        personalization_storage: consent.analytics ? 'granted' : 'denied',
        security_storage: 'granted',
      };

      window.gtag('consent', 'update', consentSettings);
    }

    console.log('✅ Google Analytics: Script loaded with consent mode');

    return () => {
      // Cleanup if needed
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, [consent.analytics, consent.marketing, hasConsented]);

  // Update consent mode when preferences change
  useEffect(() => {
    if (window.gtag && hasConsented) {
      const consentSettings = {
        analytics_storage: consent.analytics ? 'granted' : 'denied',
        ad_storage: consent.marketing ? 'granted' : 'denied',
        ad_user_data: consent.marketing ? 'granted' : 'denied',
        ad_personalization: consent.marketing ? 'granted' : 'denied',
        functionality_storage: consent.analytics ? 'granted' : 'denied',
        personalization_storage: consent.analytics ? 'granted' : 'denied',
        security_storage: 'granted',
      };

      window.gtag('consent', 'update', consentSettings);
      
      // Track consent update if analytics is enabled
      if (consent.analytics) {
        window.gtag('event', 'consent_update', {
          event_category: 'privacy',
          event_label: `analytics:${consent.analytics}, marketing:${consent.marketing}`,
        });
      }

      console.log('✅ Google Analytics: Consent mode updated:', consentSettings);
    }
  }, [consent.analytics, consent.marketing, hasConsented]);

  // Don't render anything visible
  return null;
};

