import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface ConsentPreferences {
  analytics: boolean;
  marketing: boolean;
  necessary: boolean; // Always true, cannot be disabled
}

interface ConsentContextType {
  consent: ConsentPreferences;
  hasConsented: boolean;
  updateConsent: (preferences: Partial<ConsentPreferences>) => void;
  showBanner: boolean;
  hideBanner: () => void;
  resetConsent: () => void;
}

const defaultConsent: ConsentPreferences = {
  analytics: false,
  marketing: false,
  necessary: true,
};

const ConsentContext = createContext<ConsentContextType | undefined>(undefined);

export const useConsent = () => {
  const context = useContext(ConsentContext);
  if (!context) {
    throw new Error('useConsent must be used within a ConsentProvider');
  }
  return context;
};

interface ConsentProviderProps {
  children: ReactNode;
}

export const ConsentProvider: React.FC<ConsentProviderProps> = ({ children }) => {
  const [consent, setConsent] = useState<ConsentPreferences>(defaultConsent);
  const [showBanner, setShowBanner] = useState(false);
  const [hasConsented, setHasConsented] = useState(false);

  // Load consent from localStorage on mount
  useEffect(() => {
    const savedConsent = localStorage.getItem('garshain-consent');
    if (savedConsent) {
      try {
        const parsed = JSON.parse(savedConsent);
        setConsent(parsed);
        setHasConsented(true);
        setShowBanner(false);
      } catch (error) {
        console.error('Error parsing saved consent:', error);
        setShowBanner(true);
      }
    } else {
      setShowBanner(true);
    }
  }, []);

  // Save consent to localStorage whenever it changes
  useEffect(() => {
    if (hasConsented) {
      localStorage.setItem('garshain-consent', JSON.stringify(consent));
    }
  }, [consent, hasConsented]);

  const updateConsent = (preferences: Partial<ConsentPreferences>) => {
    const newConsent = { ...consent, ...preferences };
    setConsent(newConsent);
    setHasConsented(true);
    setShowBanner(false);
  };

  const hideBanner = () => {
    setShowBanner(false);
  };

  const resetConsent = () => {
    localStorage.removeItem('garshain-consent');
    setConsent(defaultConsent);
    setHasConsented(false);
    setShowBanner(true);
  };

  const value: ConsentContextType = {
    consent,
    hasConsented,
    updateConsent,
    showBanner,
    hideBanner,
    resetConsent,
  };

  return (
    <ConsentContext.Provider value={value}>
      {children}
    </ConsentContext.Provider>
  );
};
