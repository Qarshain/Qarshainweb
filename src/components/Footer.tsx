import { Separator } from "@/components/ui/separator";
import { useLanguage } from "@/contexts/LanguageContext";

const Footer = () => {
  const { language, t } = useLanguage();
  const isRtl = language === 'ar';
  
  return (
    <footer className="bg-foreground text-background py-16">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8 mb-12">
          <div className="space-y-4">
            <div className={`flex items-center ${isRtl ? 'space-x-3 space-x-reverse' : 'space-x-3'}`}>
              <img 
                src="/lovable-uploads/77a5bec9-d868-4103-b96b-c932ab5016f5.png" 
                alt="Logo" 
                className="h-10 w-10 object-contain"
              />
              <span className="text-xl font-bold">قرشين</span>
            </div>
            <p className={`text-background/80 leading-relaxed ${!isRtl ? 'text-left' : ''}`}>
              {t('footer.description')}
            </p>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4 text-gold">{t('footer.services')}</h3>
            <ul className="space-y-2 text-background/80">
              <li><a href="#" className="hover:text-gold-light transition-colors">{t('footer.personalLoans')}</a></li>
              <li><a href="#" className="hover:text-gold-light transition-colors">{t('footer.businessLoans')}</a></li>
              <li><a href="#" className="hover:text-gold-light transition-colors">{t('footer.investment')}</a></li>
              <li><a href="#" className="hover:text-gold-light transition-colors">{t('footer.portfolioManagement')}</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4 text-gold">{t('footer.company')}</h3>
            <ul className="space-y-2 text-background/80">
              <li><a href="#" className="hover:text-gold-light transition-colors">{t('footer.aboutUs')}</a></li>
              <li><a href="#" className="hover:text-gold-light transition-colors">{t('footer.team')}</a></li>
              <li><a href="#" className="hover:text-gold-light transition-colors">{t('footer.careers')}</a></li>
              <li><a href="#" className="hover:text-gold-light transition-colors">{t('footer.news')}</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4 text-gold">{t('footer.support')}</h3>
            <ul className="space-y-2 text-background/80">
              <li><a href="#" className="hover:text-gold-light transition-colors">{t('footer.helpCenter')}</a></li>
              <li><a href="#" className="hover:text-gold-light transition-colors">{t('footer.faq')}</a></li>
              <li><a href="#" className="hover:text-gold-light transition-colors">{t('footer.contactUs')}</a></li>
              <li><a href="#" className="hover:text-gold-light transition-colors">{t('footer.privacyPolicy')}</a></li>
            </ul>
          </div>
        </div>
        
        <Separator className="bg-background/20 mb-8" />
        
        <div className={`flex flex-col md:flex-row justify-between items-center text-background/80 ${!isRtl ? 'md:text-left' : ''}`}>
          <p>{t('footer.copyright')}</p>
          <div className={`flex ${isRtl ? 'space-x-6 space-x-reverse' : 'space-x-6'} mt-4 md:mt-0`}>
            <a href="#" className="hover:text-gold-light transition-colors">{t('footer.terms')}</a>
            <a href="#" className="hover:text-gold-light transition-colors">{t('footer.privacyPolicy')}</a>
            <a href="#" className="hover:text-gold-light transition-colors">{t('footer.cookies')}</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;