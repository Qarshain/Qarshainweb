import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { Globe, Home, TrendingUp, Shield, Users, FileText, Wallet, CreditCard, User, LogOut, Bell, Menu, X, Settings, ChevronDown } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import NotificationCenter from "./NotificationCenter";
import { useState, useEffect, useRef } from "react";

const Header = () => {
  const { language, setLanguage, t } = useLanguage();
  const isRtl = language === 'ar';
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout, userType } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false);
  const accountMenuRef = useRef<HTMLDivElement>(null);
  
  const isActiveRoute = (path: string) => location.pathname === path;
  
  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
  const closeMobileMenu = () => setIsMobileMenuOpen(false);
  
  const toggleAccountMenu = () => setIsAccountMenuOpen(!isAccountMenuOpen);
  const closeAccountMenu = () => setIsAccountMenuOpen(false);

  const handleNavigation = (path: string) => {
    navigate(path);
    closeMobileMenu();
    closeAccountMenu();
  };

  // Handle clicking outside the account menu to close it
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (accountMenuRef.current && !accountMenuRef.current.contains(event.target as Node)) {
        closeAccountMenu();
      }
    };

    if (isAccountMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isAccountMenuOpen]);
  
  return (
    <header className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 w-full border-b border-border/40 shadow-sm">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo Section */}
        <div className={`flex items-center ${isRtl ? 'space-x-3 space-x-reverse' : 'space-x-3'}`}>
          <div className="relative group cursor-pointer" onClick={() => navigate('/')}>
            <img 
              src="/lovable-uploads/77a5bec9-d868-4103-b96b-c932ab5016f5.png" 
              alt="Logo" 
              className="h-10 w-10 object-contain transition-transform group-hover:scale-110"
            />
            <span className="text-xl font-bold text-foreground group-hover:text-[hsl(45,85%,55%)] transition-colors">
              {isRtl ? 'قرشين' : 'Garshain'}
            </span>
          </div>
        </div>
        
        {/* Desktop Navigation */}
        <nav className={`hidden lg:flex items-center ${isRtl ? 'space-x-8 space-x-reverse' : 'space-x-8'}`}>
          {/* Main Navigation Tabs */}
          <div className="flex items-center space-x-1">
            <a 
              href="#features" 
              className={`px-4 py-2 rounded-lg transition-all duration-200 flex items-center space-x-2 ${
                isRtl ? 'space-x-reverse' : ''
              } ${
                location.hash === '#features' 
                  ? 'bg-primary/10 text-primary border border-primary/20' 
                  : 'text-foreground hover:text-primary hover:bg-primary/5'
              }`}
            >
              <Shield className="h-4 w-4" />
              <span>{t('nav.features')}</span>
            </a>
            
            <a 
              href="#strategic-opportunities" 
              className={`px-4 py-2 rounded-lg transition-all duration-200 flex items-center space-x-2 ${
                isRtl ? 'space-x-reverse' : ''
              } ${
                location.hash === '#strategic-opportunities' 
                  ? 'bg-primary/10 text-primary border border-primary/20' 
                  : 'text-foreground hover:text-primary hover:bg-primary/5'
              }`}
            >
              <TrendingUp className="h-4 w-4" />
              <span>{isRtl ? 'الممول حديثاً' : 'Recently Funded'}</span>
            </a>
            
            <a 
              href="#how-it-works" 
              className={`px-4 py-2 rounded-lg transition-all duration-200 flex items-center space-x-2 ${
                isRtl ? 'space-x-reverse' : ''
              } ${
                location.hash === '#how-it-works' 
                  ? 'bg-primary/10 text-primary border border-primary/20' 
                  : 'text-foreground hover:text-primary hover:bg-primary/5'
              }`}
            >
              <TrendingUp className="h-4 w-4" />
              <span>{t('nav.howItWorks')}</span>
            </a>
            
            <a 
              href="#contact" 
              className={`px-4 py-2 rounded-lg transition-all duration-200 flex items-center space-x-2 ${
                isRtl ? 'space-x-reverse' : ''
              } ${
                location.hash === '#contact' 
                  ? 'bg-primary/10 text-primary border border-primary/20' 
                  : 'text-foreground hover:text-primary hover:bg-primary/5'
              }`}
            >
              <Users className="h-4 w-4" />
              <span>{t('nav.contact')}</span>
            </a>
          </div>
        </nav>
        
        {/* Right Section */}
        <div className={`flex items-center ${isRtl ? 'space-x-4 space-x-reverse' : 'space-x-4'}`}>
          {/* User Menu */}
          {user ? (
            <>
              {/* Top Right Icons - Language, Notification, and Profile */}
              <div className="flex items-center space-x-2">
                {/* Language Toggle */}
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => setLanguage(language === 'ar' ? 'en' : 'ar')}
                  className="p-2 hover:bg-primary/10 transition-colors"
                >
                  <Globe className="h-4 w-4" />
                  <span className={`${isRtl ? 'mr-2' : 'ml-2'} text-xs font-medium`}>
                    {language === 'ar' ? 'EN' : 'عر'}
                  </span>
                </Button>
                
                {/* Notification Center */}
                <NotificationCenter />
                
                {/* Profile Icon with Account Menu */}
                <div className="relative" ref={accountMenuRef}>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={toggleAccountMenu}
                    className="p-2 hover:bg-primary/5 transition-colors relative"
                  >
                    <User className="h-5 w-5" />
                    <ChevronDown className={`h-3 w-3 ml-1 transition-transform ${isAccountMenuOpen ? 'rotate-180' : ''}`} />
                    {/* Notification dot for profile */}
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></div>
                  </Button>
                  
                  {/* Account Dropdown Menu */}
                  {isAccountMenuOpen && (
                    <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                      <div className="py-2">
                        <Button 
                          variant="ghost" 
                          onClick={() => handleNavigation('/dashboard')}
                          className={`w-full justify-start px-4 py-2 rounded-none hover:bg-gray-50 ${
                            isActiveRoute('/dashboard') 
                              ? 'bg-primary/10 text-primary border-r-2 border-primary' 
                              : 'text-gray-700'
                          }`}
                        >
                          <TrendingUp className="h-4 w-4 mr-3" />
                          {isRtl ? 'لوحة التحكم' : 'Dashboard'}
                        </Button>
                        
                        <Button 
                          variant="ghost" 
                          onClick={() => handleNavigation('/wallet')}
                          className={`w-full justify-start px-4 py-2 rounded-none hover:bg-gray-50 ${
                            isActiveRoute('/wallet') 
                              ? 'bg-primary/10 text-primary border-r-2 border-primary' 
                              : 'text-gray-700'
                          }`}
                        >
                          <Wallet className="h-4 w-4 mr-3" />
                          {isRtl ? 'المحفظة' : 'Wallet'}
                        </Button>
                        
                        <Button 
                          variant="ghost" 
                          onClick={() => handleNavigation('/transactions')}
                          className={`w-full justify-start px-4 py-2 rounded-none hover:bg-gray-50 ${
                            isActiveRoute('/transactions') 
                              ? 'bg-primary/10 text-primary border-r-2 border-primary' 
                              : 'text-gray-700'
                          }`}
                        >
                          <CreditCard className="h-4 w-4 mr-3" />
                          {isRtl ? 'المعاملات' : 'Transactions'}
                        </Button>
                        
                        {/* Admin Dashboard Link */}
                        {user?.email === "saharaldhaheri@gmail.com" && (
                          <>
                            <Button 
                              variant="ghost" 
                              onClick={() => handleNavigation('/admin/opportunities')}
                              className={`w-full justify-start px-4 py-2 rounded-none hover:bg-gray-50 ${
                                isActiveRoute('/admin/opportunities') 
                                  ? 'bg-red-50 text-red-600 border-r-2 border-red-500' 
                                  : 'text-gray-700 hover:text-red-600'
                              }`}
                            >
                              <Settings className="h-4 w-4 mr-3" />
                              {isRtl ? 'الإدارة' : 'Admin'}
                            </Button>
                            
                            <Button 
                              variant="ghost" 
                              onClick={() => handleNavigation('/email-test')}
                              className={`w-full justify-start px-4 py-2 rounded-none hover:bg-gray-50 ${
                                isActiveRoute('/email-test') 
                                  ? 'bg-blue-50 text-blue-600 border-r-2 border-blue-500' 
                                  : 'text-gray-700 hover:text-blue-600'
                              }`}
                            >
                              <FileText className="h-4 w-4 mr-3" />
                              {isRtl ? 'اختبار البريد' : 'Email Test'}
                            </Button>
                          </>
                        )}
                        
                        <div className="border-t border-gray-200 my-1"></div>
                        
                        <Button 
                          variant="ghost" 
                          onClick={() => {
                            logout();
                            closeAccountMenu();
                          }}
                          className="w-full justify-start px-4 py-2 rounded-none hover:bg-red-50 hover:text-red-600 text-gray-700"
                        >
                          <LogOut className="h-4 w-4 mr-3" />
                          {isRtl ? 'تسجيل الخروج' : 'Logout'}
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Mobile Menu Button */}
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={toggleMobileMenu}
                className="lg:hidden p-2"
              >
                {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </>
          ) : (
            <>
              {/* Language Toggle for non-authenticated users */}
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setLanguage(language === 'ar' ? 'en' : 'ar')}
                className="p-2 hover:bg-primary/10 transition-colors"
              >
                <Globe className="h-4 w-4" />
                <span className={`${isRtl ? 'mr-2' : 'ml-2'} text-xs font-medium`}>
                  {language === 'ar' ? 'EN' : 'عر'}
                </span>
              </Button>
              
              <Button 
                variant="ghost" 
                onClick={() => navigate('/login')}
                className="px-4 py-2 rounded-lg hover:bg-primary/5 transition-colors"
              >
                {t('nav.login')}
              </Button>
              <Button 
                variant="outline" 
                className="bg-gradient-to-r from-[hsl(45,85%,55%)] to-[hsl(42,90%,40%)] hover:from-[hsl(42,90%,40%)] hover:to-[hsl(45,85%,55%)] text-white border-0 shadow-lg hover:shadow-xl transition-all duration-200"
                onClick={() => navigate('/signup')}
              >
                {t('nav.getStarted')}
              </Button>
            </>
          )}
        </div>
      </div>
      
      {/* Mobile Menu */}
      {isMobileMenuOpen && user && (
        <div className="lg:hidden border-t border-border/40 bg-background/95 backdrop-blur">
          <div className="container mx-auto px-4 py-4">
            <div className="grid grid-cols-2 gap-3">
              <Button 
                variant="ghost" 
                onClick={() => handleNavigation('/dashboard')}
                className={`justify-start px-4 py-3 rounded-lg transition-all duration-200 ${
                  isActiveRoute('/dashboard') 
                    ? 'bg-primary/10 text-primary border border-primary/20' 
                    : 'hover:bg-primary/5'
                }`}
              >
                <TrendingUp className="h-4 w-4 mr-3" />
                {isRtl ? 'لوحة التحكم' : 'Dashboard'}
              </Button>
              
              <Button 
                variant="ghost" 
                onClick={() => handleNavigation('/wallet')}
                className={`justify-start px-4 py-3 rounded-lg transition-all duration-200 ${
                  isActiveRoute('/wallet') 
                    ? 'bg-primary/10 text-primary border border-primary/20' 
                    : 'hover:bg-primary/5'
                }`}
              >
                <Wallet className="h-4 w-4 mr-3" />
                {isRtl ? 'المحفظة' : 'Wallet'}
              </Button>
              
              <Button 
                variant="ghost" 
                onClick={() => handleNavigation('/transactions')}
                className={`justify-start px-4 py-3 rounded-lg transition-all duration-200 ${
                  isActiveRoute('/transactions') 
                    ? 'bg-primary/10 text-primary border border-primary/20' 
                    : 'hover:bg-primary/5'
                }`}
              >
                <CreditCard className="h-4 w-4 mr-3" />
                {isRtl ? 'المعاملات' : 'Transactions'}
              </Button>
              
              <Button 
                variant="ghost" 
                onClick={() => handleNavigation('/profile')}
                className={`justify-start px-4 py-3 rounded-lg transition-all duration-200 ${
                  isActiveRoute('/profile') 
                    ? 'bg-primary/10 text-primary border border-primary/20' 
                    : 'hover:bg-primary/5'
                }`}
              >
                <User className="h-4 w-4 mr-3" />
                {isRtl ? 'الملف الشخصي' : 'Profile'}
              </Button>
              
              {/* Admin Dashboard Link */}
              {user?.email === "saharaldhaheri@gmail.com" && (
                <>
                  <Button 
                    variant="ghost" 
                    onClick={() => handleNavigation('/admin/opportunities')}
                    className={`justify-start px-4 py-3 rounded-lg transition-all duration-200 ${
                      isActiveRoute('/admin/opportunities') 
                        ? 'bg-red-50 text-red-600 border border-red-200' 
                        : 'hover:bg-red-50 hover:text-red-600'
                    }`}
                  >
                    <Settings className="h-4 w-4 mr-3" />
                    {isRtl ? 'الإدارة' : 'Admin'}
                  </Button>
                  
                  <Button 
                    variant="ghost" 
                    onClick={() => handleNavigation('/email-test')}
                    className={`justify-start px-4 py-3 rounded-lg transition-all duration-200 ${
                      isActiveRoute('/email-test') 
                        ? 'bg-blue-50 text-blue-600 border border-blue-200' 
                        : 'hover:bg-blue-50 hover:text-blue-600'
                    }`}
                  >
                    <FileText className="h-4 w-4 mr-3" />
                    {isRtl ? 'اختبار البريد' : 'Email Test'}
                  </Button>
                </>
              )}
              
              <Button 
                variant="ghost" 
                onClick={logout}
                className="justify-start px-4 py-3 rounded-lg hover:bg-red-50 hover:text-red-600 transition-all duration-200 col-span-2"
              >
                <LogOut className="h-4 w-4 mr-3" />
                {isRtl ? 'تسجيل الخروج' : 'Logout'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;