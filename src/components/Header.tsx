import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { Globe } from "lucide-react";

const Header = () => {
  const { language, setLanguage, t } = useLanguage();
  const isRtl = language === 'ar';
  
  return (
    <header className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 w-full border-b border-border/40">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className={`flex items-center ${isRtl ? 'space-x-3 space-x-reverse' : 'space-x-3'}`}>
          <img 
            src="/lovable-uploads/77a5bec9-d868-4103-b96b-c932ab5016f5.png" 
            alt="Logo" 
            className="h-10 w-10 object-contain"
          />
          <span className="text-xl font-bold text-foreground">قرشين</span>
        </div>
        
        <nav className={`hidden md:flex items-center ${isRtl ? 'space-x-8 space-x-reverse' : 'space-x-8'}`}>
          <a href="#home" className="text-foreground hover:text-primary transition-colors">{t('nav.home')}</a>
          <a href="#how-it-works" className="text-foreground hover:text-primary transition-colors">{t('nav.howItWorks')}</a>
          <a href="#features" className="text-foreground hover:text-primary transition-colors">{t('nav.features')}</a>
          <a href="#contact" className="text-foreground hover:text-primary transition-colors">{t('nav.contact')}</a>
        </nav>
        
        <div className={`flex items-center ${isRtl ? 'space-x-4 space-x-reverse' : 'space-x-4'}`}>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => setLanguage(language === 'ar' ? 'en' : 'ar')}
            className="p-2"
          >
            <Globe className="h-4 w-4" />
            <span className={`${isRtl ? 'mr-2' : 'ml-2'} text-xs`}>
              {language === 'ar' ? 'EN' : 'عر'}
            </span>
          </Button>
          <Button variant="ghost">{t('nav.login')}</Button>
          <Button variant="golden">{t('nav.getStarted')}</Button>
        </div>
      </div>
    </header>
  );
};

export default Header;