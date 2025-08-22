import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'ar' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  restoreLanguage: () => void;
  checkLanguageConsistency: () => void;
}

const translations = {
  ar: {
    // Header
    'nav.home': 'الرئيسية',
    'nav.howItWorks': 'كيف يعمل',
    'nav.features': 'المميزات',
    'nav.contact': 'اتصل بنا',
    'nav.login': 'تسجيل الدخول',
    'nav.getStarted': 'ابدأ الآن',
    
    // Hero
    'hero.title1': 'منصة الإقراض',
    'hero.title2': 'النظير للنظير',
    'hero.subtitle': 'اربط المستثمرين مع المقترضين في بيئة آمنة وشفافة. احصل على التمويل الذي تحتاجه أو استثمر أموالك بعوائد مجزية.',
    'hero.startLending': 'ابدأ الإقراض',
    'hero.requestLoan': 'طلب قرض',
    'hero.activeUsers': 'مستخدم نشط',
    'hero.repaymentRate': 'معدل السداد',
    'hero.averageReturn': 'عائد متوسط',
    'hero.highReturns': 'عوائد مرتفعة',
    'hero.highReturnsDesc': 'استثمر بذكاء واحصل على عوائد تنافسية',
    'hero.highSecurity': 'أمان عالي',
    'hero.highSecurityDesc': 'حماية متطورة لأموالك ومعلوماتك',
    'hero.trustedCommunity': 'مجتمع موثوق',
    'hero.trustedCommunityDesc': 'انضم إلى آلاف المستخدمين الموثوقين',
    
    // Features
    'features.title': 'لماذا تختار',
    'features.subtitle': 'نقدم أفضل تجربة إقراض واستثمار مع ضمانات الأمان والشفافية',
    'features.security': 'أمان متقدم',
    'features.securityDesc': 'تشفير من الدرجة المصرفية وحماية شاملة للبيانات',
    'features.returns': 'عوائد مجزية',
    'features.returnsDesc': 'احصل على عوائد تنافسية تصل إلى 15% سنوياً',
    'features.processing': 'معالجة سريعة',
    'features.processingDesc': 'موافقة فورية وتحويل خلال 24 ساعة',
    'features.assessment': 'تقييم شامل',
    'features.assessmentDesc': 'نظام تقييم ائتماني متطور لضمان الجودة',
    'features.flexibility': 'مرونة في السداد',
    'features.flexibilityDesc': 'خطط سداد مرنة تناسب احتياجاتك',
    'features.transparency': 'شفافية كاملة',
    'features.transparencyDesc': 'تتبع كامل لجميع المعاملات والاستثمارات',
    
    // How It Works
    'howItWorks.title': 'كيف يعمل قرشين؟',
    'howItWorks.subtitle': 'عملية بسيطة وآمنة للجميع',
    'howItWorks.forBorrowers': 'للمقترضين',
    'howItWorks.forInvestors': 'للمستثمرين',
    'howItWorks.step1Borrower': 'قدم طلبك',
    'howItWorks.step1BorrowerDesc': 'أكمل طلب القرض بمعلوماتك المالية',
    'howItWorks.step2Borrower': 'تقييم فوري',
    'howItWorks.step2BorrowerDesc': 'نظامنا يقيم طلبك ويحدد معدل الفائدة',
    'howItWorks.step3Borrower': 'احصل على التمويل',
    'howItWorks.step3BorrowerDesc': 'تم! استلم أموالك خلال 24 ساعة',
    'howItWorks.step1Investor': 'إنشاء حساب',
    'howItWorks.step1InvestorDesc': 'سجل واكمل عملية التحقق السريعة',
    'howItWorks.step2Investor': 'اختر استثماراتك',
    'howItWorks.step2InvestorDesc': 'تصفح الفرص وانتقي ما يناسبك',
    'howItWorks.step3Investor': 'اربح عوائد',
    'howItWorks.step3InvestorDesc': 'راقب نمو استثماراتك واحصل على العوائد',
    
    // Footer
    'footer.description': 'منصة الإقراض النظير للنظير الرائدة في المنطقة. نربط المستثمرين مع المقترضين في بيئة آمنة وشفافة.',
    'footer.services': 'الخدمات',
    'footer.personalLoans': 'القروض الشخصية',
    'footer.businessLoans': 'قروض الأعمال',
    'footer.investment': 'الاستثمار',
    'footer.portfolioManagement': 'إدارة المحافظ',
    'footer.company': 'الشركة',
    'footer.aboutUs': 'من نحن',
    'footer.team': 'الفريق',
    'footer.careers': 'الوظائف',
    'footer.news': 'الأخبار',
    'footer.support': 'الدعم',
    'footer.helpCenter': 'مركز المساعدة',
    'footer.faq': 'الأسئلة الشائعة',
    'footer.contactUs': 'اتصل بنا',
    'footer.privacyPolicy': 'سياسة الخصوصية',
    'footer.copyright': '© 2024 قرشين. جميع الحقوق محفوظة.',
    'footer.terms': 'الشروط والأحكام',
    'footer.cookies': 'ملفات تعريف الارتباط',
  },
  en: {
    // Header
    'nav.home': 'Home',
    'nav.howItWorks': 'How It Works',
    'nav.features': 'Features',
    'nav.contact': 'Contact',
    'nav.login': 'Login',
    'nav.getStarted': 'Get Started',
    
    // Hero
    'hero.title1': 'Peer-to-Peer',
    'hero.title2': 'Lending Platform',
    'hero.subtitle': 'Connect investors with borrowers in a secure and transparent environment. Get the funding you need or invest your money with attractive returns.',
    'hero.startLending': 'Start Lending',
    'hero.requestLoan': 'Request Loan',
    'hero.activeUsers': 'Active Users',
    'hero.repaymentRate': 'Repayment Rate',
    'hero.averageReturn': 'Average Return',
    'hero.highReturns': 'High Returns',
    'hero.highReturnsDesc': 'Invest smartly and get competitive returns',
    'hero.highSecurity': 'High Security',
    'hero.highSecurityDesc': 'Advanced protection for your money and information',
    'hero.trustedCommunity': 'Trusted Community',
    'hero.trustedCommunityDesc': 'Join thousands of trusted users',
    
    // Features
    'features.title': 'Why Choose',
    'features.subtitle': 'We provide the best lending and investment experience with security and transparency guarantees',
    'features.security': 'Advanced Security',
    'features.securityDesc': 'Bank-grade encryption and comprehensive data protection',
    'features.returns': 'Attractive Returns',
    'features.returnsDesc': 'Get competitive returns up to 15% annually',
    'features.processing': 'Fast Processing',
    'features.processingDesc': 'Instant approval and transfer within 24 hours',
    'features.assessment': 'Comprehensive Assessment',
    'features.assessmentDesc': 'Advanced credit scoring system to ensure quality',
    'features.flexibility': 'Payment Flexibility',
    'features.flexibilityDesc': 'Flexible repayment plans that suit your needs',
    'features.transparency': 'Complete Transparency',
    'features.transparencyDesc': 'Full tracking of all transactions and investments',
    
    // How It Works
    'howItWorks.title': 'How Does Garshain Work?',
    'howItWorks.subtitle': 'A simple and secure process for everyone',
    'howItWorks.forBorrowers': 'For Borrowers',
    'howItWorks.forInvestors': 'For Investors',
    'howItWorks.step1Borrower': 'Submit Application',
    'howItWorks.step1BorrowerDesc': 'Complete loan application with your financial information',
    'howItWorks.step2Borrower': 'Instant Assessment',
    'howItWorks.step2BorrowerDesc': 'Our system evaluates your application and determines interest rate',
    'howItWorks.step3Borrower': 'Get Funding',
    'howItWorks.step3BorrowerDesc': 'Done! Receive your money within 24 hours',
    'howItWorks.step1Investor': 'Create Account',
    'howItWorks.step1InvestorDesc': 'Register and complete quick verification process',
    'howItWorks.step2Investor': 'Choose Investments',
    'howItWorks.step2InvestorDesc': 'Browse opportunities and select what suits you',
    'howItWorks.step3Investor': 'Earn Returns',
    'howItWorks.step3InvestorDesc': 'Monitor your investment growth and receive returns',
    
    // Footer
    'footer.description': 'The leading peer-to-peer lending platform in the region. We connect investors with borrowers in a secure and transparent environment.',
    'footer.services': 'Services',
    'footer.personalLoans': 'Personal Loans',
    'footer.businessLoans': 'Business Loans',
    'footer.investment': 'Investment',
    'footer.portfolioManagement': 'Portfolio Management',
    'footer.company': 'Company',
    'footer.aboutUs': 'About Us',
    'footer.team': 'Team',
    'footer.careers': 'Careers',
    'footer.news': 'News',
    'footer.support': 'Support',
    'footer.helpCenter': 'Help Center',
    'footer.faq': 'FAQ',
    'footer.contactUs': 'Contact Us',
    'footer.privacyPolicy': 'Privacy Policy',
    'footer.copyright': '© 2024 Garshain. All rights reserved.',
    'footer.terms': 'Terms & Conditions',
    'footer.cookies': 'Cookies',
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Initialize language from localStorage or default to 'ar'
  const [language, setLanguage] = useState<Language>(() => {
    const savedLanguage = localStorage.getItem('preferred-language');
    return (savedLanguage as Language) || 'ar';
  });

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  // Update localStorage when language changes
  const handleLanguageChange = (newLanguage: Language) => {
    console.log(`🌍 Language changing from ${language} to ${newLanguage}`);
    setLanguage(newLanguage);
    localStorage.setItem('preferred-language', newLanguage);
    console.log(`💾 Language preference saved to localStorage: ${newLanguage}`);
  };

  useEffect(() => {
    // Update document direction and language
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
    console.log(`📄 Document updated: dir=${document.documentElement.dir}, lang=${document.documentElement.lang}`);
  }, [language]);

  // Ensure language is synchronized on app initialization
  useEffect(() => {
    const savedLanguage = localStorage.getItem('preferred-language');
    console.log(`🔄 App initialization - Saved language from localStorage: ${savedLanguage}`);
    if (savedLanguage && savedLanguage !== language) {
      console.log(`🔄 Restoring language from localStorage: ${savedLanguage}`);
      setLanguage(savedLanguage as Language);
    }
  }, []);

  // Function to restore language from localStorage
  const restoreLanguage = () => {
    const savedLanguage = localStorage.getItem('preferred-language');
    console.log(`🔄 Manual language restore - Saved language: ${savedLanguage}`);
    if (savedLanguage) {
      setLanguage(savedLanguage as Language);
    }
  };

  // Function to check and fix language consistency issues
  const checkLanguageConsistency = () => {
    const savedLanguage = localStorage.getItem('preferred-language');
    if (savedLanguage && savedLanguage !== language) {
      console.log(`🔄 Language consistency issue detected. Attempting to fix.`);
      setLanguage(savedLanguage as Language);
      localStorage.setItem('preferred-language', savedLanguage);
      console.log(`💾 Language preference fixed in localStorage: ${savedLanguage}`);
    }
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleLanguageChange, t, restoreLanguage, checkLanguageConsistency }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};