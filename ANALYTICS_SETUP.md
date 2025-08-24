# Google Analytics Setup Guide

## Overview
This application is now configured with Google Analytics 4 (GA4) to track user behavior, page views, and custom events.

## What's Already Set Up

### 1. Google Analytics Tracking Code
- ✅ GA4 tracking code added to `index.html`
- ✅ Measurement ID: `G-JFXMMEV7FX`
- ✅ Automatic page view tracking
- ✅ Route change detection

### 2. Analytics Configuration
- ✅ `src/config/analytics.ts` - Configuration file
- ✅ `src/lib/analytics.ts` - Core analytics functions
- ✅ `src/hooks/useAnalytics.ts` - React hook for easy usage

### 3. Environment Configuration
- ✅ `env.example` - Template for environment variables
- ✅ Configurable analytics enable/disable

## Setup Instructions

### 1. Create Environment File
Copy `env.example` to `.env` in your project root:

```bash
cp env.example .env
```

### 2. Update Environment Variables
Edit `.env` file with your actual values:

```env
# Google Analytics Configuration
VITE_GA_MEASUREMENT_ID=G-JFXMMEV7FX
VITE_ENABLE_GA=true
VITE_ENABLE_CLARITY=true
```

### 3. Verify Google Analytics
1. Go to [Google Analytics](https://analytics.google.com/)
2. Check your GA4 property (ID: G-JFXMMEV7FX)
3. Verify data is being received in Real-Time reports

## Usage Examples

### Basic Event Tracking
```tsx
import { useAnalytics } from '@/hooks/useAnalytics';

function MyComponent() {
  const { trackEvent, trackUserAction } = useAnalytics();

  const handleButtonClick = () => {
    trackEvent('button_click', 'engagement', 'cta_button');
    trackUserAction('cta_interaction', { button: 'cta_button', page: 'home' });
  };

  return <button onClick={handleButtonClick}>Click Me</button>;
}
```

### Loan Event Tracking
```tsx
import { useAnalytics } from '@/hooks/useAnalytics';

function LoanForm() {
  const { trackLoanAction } = useAnalytics();

  const handleLoanSubmit = (loanData: any) => {
    trackLoanAction('loan_requested', {
      amount: loanData.amount,
      purpose: loanData.purpose,
      term: loanData.term
    });
  };

  return <form onSubmit={handleLoanSubmit}>...</form>;
}
```

### Authentication Tracking
```tsx
import { useAnalytics } from '@/hooks/useAnalytics';

function LoginForm() {
  const { trackAuthAction } = useAnalytics();

  const handleLogin = (method: string) => {
    trackAuthAction('login', method);
  };

  return <form onSubmit={() => handleLogin('email')}>...</form>;
}
```

### Investment Tracking
```tsx
import { useAnalytics } from '@/hooks/useAnalytics';

function InvestmentCard() {
  const { trackInvestmentAction } = useAnalytics();

  const handleInvestmentView = () => {
    trackInvestmentAction('investment_viewed', {
      investment_id: 'inv_123',
      amount: 1000,
      risk_level: 'medium'
    });
  };

  return <div onClick={handleInvestmentView}>...</div>;
}
```

## Available Tracking Functions

### Page Views
- `trackPageView(url, title)` - Track custom page views

### Custom Events
- `trackEvent(action, category, label, value)` - Track any custom event
- `trackUserAction(action, details)` - Track user engagement

### Business Events
- `trackLoanAction(action, details)` - Loan-related events
- `trackAuthAction(action, method)` - Authentication events
- `trackInvestmentAction(action, details)` - Investment events

## Event Categories

### Loan Events
- `loan_requested` - User submits loan request
- `loan_approved` - Admin approves loan
- `loan_rejected` - Admin rejects loan
- `investment_made` - User makes investment

### Authentication Events
- `sign_up` - User registration
- `login` - User login
- `logout` - User logout

### Investment Events
- `investment_viewed` - Investment opportunity viewed
- `investment_clicked` - Investment clicked/interacted
- `investment_completed` - Investment completed

## Configuration Options

### Enable/Disable Analytics
```env
VITE_ENABLE_GA=true          # Enable Google Analytics
VITE_ENABLE_CLARITY=true     # Enable Microsoft Clarity
```

### Debug Mode
Analytics automatically runs in debug mode during development (`import.meta.env.DEV`).

## Testing Analytics

### 1. Real-Time Reports
- Go to GA4 → Reports → Realtime
- Navigate through your app
- Verify events appear in real-time

### 2. Debug View
- Use browser developer tools
- Check Network tab for GA requests
- Verify `gtag` function exists globally

### 3. Test Events
- Click buttons, submit forms
- Check GA4 Events report
- Verify custom parameters are captured

## Privacy & Compliance

### GDPR Compliance
- Consider implementing consent management
- Review data collection practices
- Ensure user privacy controls

### Data Retention
- GA4 default retention: 14 months
- Configure retention policies in GA4 settings
- Review data deletion policies

## Troubleshooting

### Common Issues

1. **No data in GA4**
   - Verify Measurement ID is correct
   - Check if ad blockers are blocking GA
   - Ensure tracking code is loaded

2. **Events not firing**
   - Check browser console for errors
   - Verify `useAnalytics` hook is used
   - Check if analytics is enabled

3. **Page views not tracking**
   - Ensure `useAnalytics()` is called in AppRoutes
   - Check React Router integration
   - Verify route changes trigger tracking

### Debug Commands
```javascript
// Check if GA is loaded
console.log('gtag available:', typeof window.gtag !== 'undefined');

// Check analytics config
console.log('Analytics config:', import.meta.env.VITE_GA_MEASUREMENT_ID);

// Test event manually
window.gtag('event', 'test_event', { test: true });
```

## Support

For issues with:
- **Google Analytics**: Check GA4 documentation
- **Implementation**: Review this guide and code examples
- **Configuration**: Verify environment variables and settings

## Next Steps

1. ✅ **Complete Setup**: Verify GA4 is receiving data
2. 🔍 **Custom Events**: Add tracking to key user actions
3. 📊 **Reports**: Set up custom reports in GA4
4. 🎯 **Goals**: Configure conversion goals
5. 📈 **Optimization**: Use data to improve user experience
