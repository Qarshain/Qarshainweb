import React, { useState } from 'react';
import { useConsent } from '@/contexts/ConsentContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { X, Shield, BarChart3, Megaphone, Info } from 'lucide-react';

export const ConsentBanner: React.FC = () => {
  const { consent, updateConsent, showBanner, hideBanner } = useConsent();
  const [showDetails, setShowDetails] = useState(false);

  if (!showBanner) return null;

  const handleAcceptAll = () => {
    updateConsent({
      analytics: true,
      marketing: true,
    });
  };

  const handleAcceptNecessary = () => {
    updateConsent({
      analytics: false,
      marketing: false,
    });
  };

  const handleSavePreferences = () => {
    updateConsent(consent);
  };

  const handleToggleAnalytics = (checked: boolean) => {
    updateConsent({ analytics: checked });
  };

  const handleToggleMarketing = (checked: boolean) => {
    updateConsent({ marketing: checked });
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-t">
      <Card className="max-w-4xl mx-auto">
        <CardHeader className="pb-4">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Shield className="h-5 w-5 text-primary" />
              </div>
              <div>
                <CardTitle className="text-lg">Privacy & Cookie Preferences</CardTitle>
                <CardDescription>
                  We use cookies and similar technologies to provide, protect, and improve our services.
                </CardDescription>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={hideBanner}
              className="h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Cookie Categories */}
          <div className="space-y-3">
            {/* Necessary Cookies */}
            <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Shield className="h-4 w-4 text-green-600" />
                </div>
                <div>
                  <Label className="font-medium">Necessary Cookies</Label>
                  <p className="text-sm text-muted-foreground">
                    Essential for the website to function properly
                  </p>
                </div>
              </div>
              <Switch checked={true} disabled />
            </div>

            {/* Analytics Cookies */}
            <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <BarChart3 className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <Label className="font-medium">Analytics Cookies</Label>
                  <p className="text-sm text-muted-foreground">
                    Help us understand how visitors interact with our website
                  </p>
                </div>
              </div>
              <Switch
                checked={consent.analytics}
                onCheckedChange={handleToggleAnalytics}
              />
            </div>

            {/* Marketing Cookies */}
            <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Megaphone className="h-4 w-4 text-purple-600" />
                </div>
                <div>
                  <Label className="font-medium">Marketing Cookies</Label>
                  <p className="text-sm text-muted-foreground">
                    Used to deliver personalized content and advertisements
                  </p>
                </div>
              </div>
              <Switch
                checked={consent.marketing}
                onCheckedChange={handleToggleMarketing}
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <Button
              variant="outline"
              onClick={handleAcceptNecessary}
              className="flex-1"
            >
              Accept Necessary Only
            </Button>
            <Button
              variant="outline"
              onClick={handleSavePreferences}
              className="flex-1"
            >
              Save Preferences
            </Button>
            <Button
              onClick={handleAcceptAll}
              className="flex-1"
            >
              Accept All
            </Button>
          </div>

          {/* Additional Information */}
          <div className="pt-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowDetails(!showDetails)}
              className="text-muted-foreground hover:text-foreground"
            >
              <Info className="h-4 w-4 mr-2" />
              {showDetails ? 'Hide' : 'Show'} Details
            </Button>
            
            {showDetails && (
              <div className="mt-3 p-3 bg-muted/50 rounded-lg text-sm text-muted-foreground space-y-2">
                <p>
                  <strong>Necessary Cookies:</strong> These cookies are essential for the website to function and cannot be switched off. They are usually only set in response to actions made by you which amount to a request for services, such as setting your privacy preferences, logging in or filling in forms.
                </p>
                <p>
                  <strong>Analytics Cookies:</strong> These cookies allow us to count visits and traffic sources so we can measure and improve the performance of our site. They help us to know which pages are the most and least popular and see how visitors move around the site.
                </p>
                <p>
                  <strong>Marketing Cookies:</strong> These cookies may be set through our site by our advertising partners. They may be used by those companies to build a profile of your interests and show you relevant adverts on other sites.
                </p>
                <p className="text-xs pt-2">
                  You can change your cookie preferences at any time by clicking the "Privacy Settings" link in our footer.
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
