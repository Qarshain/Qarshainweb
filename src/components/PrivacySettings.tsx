import React, { useState } from 'react';
import { useConsent } from '@/contexts/ConsentContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Shield, BarChart3, Megaphone, Settings, Info } from 'lucide-react';

export const PrivacySettings: React.FC = () => {
  const { consent, updateConsent, resetConsent } = useConsent();
  const [isOpen, setIsOpen] = useState(false);

  const handleToggleAnalytics = (checked: boolean) => {
    updateConsent({ analytics: checked });
  };

  const handleToggleMarketing = (checked: boolean) => {
    updateConsent({ marketing: checked });
  };

  const handleReset = () => {
    resetConsent();
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
          <Settings className="h-4 w-4 mr-2" />
          Privacy Settings
        </Button>
      </DialogTrigger>
      
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Privacy & Cookie Preferences
          </DialogTitle>
          <DialogDescription>
            Manage your privacy settings and cookie preferences for Garshain.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Cookie Categories */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Cookie Categories</h3>
            
            {/* Necessary Cookies */}
            <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
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
            <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
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
            <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
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

          {/* Current Status */}
          <div className="p-4 bg-muted/30 rounded-lg">
            <h4 className="font-medium mb-2">Current Status</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Analytics Tracking:</span>
                <span className={consent.analytics ? 'text-green-600' : 'text-red-600'}>
                  {consent.analytics ? 'Enabled' : 'Disabled'}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Marketing Tracking:</span>
                <span className={consent.marketing ? 'text-green-600' : 'text-red-600'}>
                  {consent.marketing ? 'Enabled' : 'Disabled'}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Necessary Cookies:</span>
                <span className="text-green-600">Always Enabled</span>
              </div>
            </div>
          </div>

          {/* Information */}
          <div className="p-4 bg-blue-50 rounded-lg">
            <div className="flex items-start gap-2">
              <Info className="h-4 w-4 text-blue-600 mt-0.5" />
              <div className="text-sm text-blue-800">
                <p className="font-medium mb-1">What happens when you change these settings?</p>
                <p>
                  Changes take effect immediately. If you disable analytics cookies, 
                  we'll stop collecting data about your usage. If you disable marketing cookies, 
                  you may see less personalized content.
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <Button
              variant="outline"
              onClick={handleReset}
              className="flex-1"
            >
              Reset All Preferences
            </Button>
            <Button
              onClick={() => setIsOpen(false)}
              className="flex-1"
            >
              Save & Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

