# Garshain Consent Mode Implementation

This document explains the consent mode implementation for Google Analytics in the Garshain project, ensuring compliance with privacy regulations like GDPR.

## Overview

The consent mode system provides users with control over their data collection preferences while maintaining compliance with privacy regulations. It integrates seamlessly with Google Analytics 4 and provides a user-friendly interface for managing consent preferences.

## Features

- **Consent Banner**: Initial consent collection when users first visit
- **Privacy Settings**: Ongoing consent management through footer link
- **Google Analytics Integration**: Automatic consent mode updates
- **Local Storage**: Persistent consent preferences
- **Multi-language Support**: Works with existing language system

## Components

### 1. ConsentContext (`src/contexts/ConsentContext.tsx`)
Manages the global consent state and provides methods for updating preferences.

**Key Features:**
- Manages analytics, marketing, and necessary cookie preferences
- Persists preferences in localStorage
- Provides consent status to other components

**Usage:**
```tsx
import { useConsent } from '@/contexts/ConsentContext';

const { consent, updateConsent, hasConsented } = useConsent();
```

### 2. ConsentBanner (`src/components/ConsentBanner.tsx`)
The initial consent banner displayed to new users.

**Features:**
- Three consent categories (Necessary, Analytics, Marketing)
- Accept all/necessary only options
- Expandable details section
- Responsive design

### 3. PrivacySettings (`src/components/PrivacySettings.tsx`)
Dialog component for updating consent preferences after initial setup.

**Features:**
- Accessible via footer link
- Real-time consent updates
- Reset functionality
- Current status display

### 4. GoogleAnalytics (`src/components/GoogleAnalytics.tsx`)
Handles Google Analytics script loading and consent mode configuration.

**Features:**
- Dynamic script loading
- Consent mode initialization
- Automatic consent updates
- Debug mode support

## Configuration

### Analytics Config (`src/config/analytics.ts`)
```typescript
CONSENT_MODE: {
  DEFAULT_CONSENT: {
    analytics_storage: 'denied',
    ad_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied',
    functionality_storage: 'denied',
    personalization_storage: 'denied',
    security_storage: 'granted', // Always granted
  },
  UPDATE_DELAY: 500,
}
```

### Environment Variables
```bash
# .env file
VITE_GA_MEASUREMENT_ID=G-JFXMMEV7FX
VITE_ENABLE_GA=true
VITE_ENABLE_CLARITY=true
```

## Implementation Details

### Consent Flow
1. **First Visit**: User sees consent banner
2. **User Choice**: User selects preferences (Accept All, Necessary Only, or Custom)
3. **Storage**: Preferences saved to localStorage
4. **Analytics**: Google Analytics consent mode updated accordingly
5. **Ongoing**: Users can update preferences via footer Privacy Settings

### Google Analytics Consent Mode
The system implements Google Analytics 4 consent mode with the following features:

- **Default State**: All tracking disabled until consent given
- **Dynamic Updates**: Consent changes applied immediately
- **Advanced Mode**: Full control over individual consent types
- **Event Tracking**: Consent updates tracked (when analytics enabled)

### Data Flow
```
User Interaction → ConsentContext → Analytics Library → Google Analytics
     ↓                ↓              ↓              ↓
Consent Banner → State Update → Consent Mode → GA Consent
```

## Usage Examples

### Tracking with Consent Check
```tsx
import { useAnalytics } from '@/hooks/useAnalytics';

const { trackEvent, hasConsent } = useAnalytics();

// Only track if consent granted
if (hasConsent) {
  trackEvent('button_click', 'engagement', 'cta_button');
}
```

### Updating Consent
```tsx
import { useConsent } from '@/contexts/ConsentContext';

const { updateConsent } = useConsent();

// Update specific preference
updateConsent({ analytics: true, marketing: false });
```

## Privacy Compliance

### GDPR Compliance
- **Explicit Consent**: Users must actively choose preferences
- **Granular Control**: Separate controls for different cookie types
- **Easy Withdrawal**: Users can change preferences anytime
- **Transparency**: Clear information about data usage

### Cookie Categories
1. **Necessary**: Always enabled, essential for functionality
2. **Analytics**: User behavior tracking (Google Analytics)
3. **Marketing**: Personalized content and advertising

## Testing

### Development Testing
1. Clear localStorage to test initial banner
2. Check browser console for consent mode logs
3. Verify GA events only fire with consent
4. Test consent preference changes

### Production Verification
1. Verify consent banner appears for new users
2. Check Google Analytics consent mode implementation
3. Test privacy settings accessibility
4. Verify consent persistence across sessions

## Troubleshooting

### Common Issues

**Consent Banner Not Showing**
- Check localStorage for existing consent
- Verify ConsentProvider is properly wrapped
- Check console for errors

**Analytics Not Tracking**
- Verify consent.analytics is true
- Check Google Analytics script loading
- Verify consent mode configuration

**Consent Updates Not Working**
- Check updateConsentMode function
- Verify GA script is loaded
- Check console for consent update logs

### Debug Mode
Enable debug mode in analytics config:
```typescript
DEBUG: import.meta.env.DEV || false
```

## Future Enhancements

- **Cookie Management**: More granular cookie control
- **Regional Compliance**: Additional privacy regulation support
- **Analytics Dashboard**: Consent statistics and insights
- **A/B Testing**: Consent banner optimization
- **Integration**: Additional analytics platforms

## Support

For questions or issues with the consent mode implementation:

1. Check the console logs for detailed information
2. Verify all components are properly imported
3. Ensure ConsentProvider wraps the application
4. Check Google Analytics configuration

## Resources

- [Google Analytics Consent Mode Documentation](https://developers.google.com/tag-platform/security/guides/consent)
- [GDPR Compliance Guidelines](https://gdpr.eu/)
- [Cookie Consent Best Practices](https://www.cookielaw.org/)

