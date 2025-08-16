import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, TrendingUp, Shield, Users, AlertCircle } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";

const Hero = () => {
  const { language, t } = useLanguage();
  const { user, userType } = useAuth();
  const isRtl = language === 'ar';
  const navigate = useNavigate();
  
  const handleStartLending = () => {
    navigate('/invest');
  };
  
  return (
    <section className="relative min-h-screen bg-gradient-to-br from-background via-cream to-background overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGRlZnM+CjxwYXR0ZXJuIGlkPSJncmlkIiB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiPgo8cGF0aCBkPSJNIDYwIDAgTCAwIDAgMCA2MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJoc2woNDUgNzUlIDU1JSAvIDAuMDUpIiBzdHJva2Utd2lkdGg9IjEiLz4KPC9wYXR0ZXJuPgo8L2RlZnM+CjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz4KPHN2Zz4=')] opacity-30"></div>
      
      <div className="container mx-auto px-4 pt-20 pb-16 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center min-h-[80vh]">
          {/* Content */}
          <div className="space-y-8 animate-fade-in">
            <div className="space-y-4">
              <h1 className={`text-5xl lg:text-7xl font-bold text-foreground leading-tight ${!isRtl ? 'text-left' : ''}`}>
                {t('hero.title1')}
                <span className="block bg-gradient-to-r from-gold to-gold-light bg-clip-text text-transparent">
                  {t('hero.title2')}
                </span>
              </h1>
              

              <p className={`text-xl text-muted-foreground max-w-xl leading-relaxed ${!isRtl ? 'text-left' : ''}`}>
                {t('hero.subtitle')}
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Button variant="golden" size="lg" className="group" onClick={handleStartLending}>
                {t('hero.startLending')}
                {isRtl ? (
                  <ArrowLeft className="mr-2 h-5 w-5 group-hover:-translate-x-1 transition-transform rotate-180" />
                ) : (
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:-translate-x-1 transition-transform" />
                )}
              </Button>
              <Button variant="outline" size="lg" onClick={() => navigate('/loan-request')}>
                {t('hero.requestLoan')}
              </Button>
            </div>
            
            {/* Stats section removed */}
          </div>
          
          {/* Visual Elements */}
          <div className="relative animate-slide-up">
            <div className="relative bg-gradient-to-br from-gold/10 to-gold-light/5 rounded-3xl p-8 backdrop-blur-sm border border-gold/20">
              <div className="absolute inset-0 bg-gradient-to-br from-gold/5 to-transparent rounded-3xl"></div>
              
              {/* Feature Cards */}
              <div className="relative space-y-6">
                <div className="bg-card rounded-2xl p-6 shadow-elegant border border-border/50">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-gold to-gold-light rounded-xl flex items-center justify-center">
                      <TrendingUp className="h-6 w-6 text-primary-foreground" />
                    </div>
                    <div className={isRtl ? 'text-right' : 'text-left'}>
                      <h3 className="font-semibold text-foreground">{t('hero.highReturns')}</h3>
                      <p className="text-sm text-muted-foreground">{t('hero.highReturnsDesc')}</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-card rounded-2xl p-6 shadow-elegant border border-border/50">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-gold to-gold-light rounded-xl flex items-center justify-center">
                      <Shield className="h-6 w-6 text-primary-foreground" />
                    </div>
                    <div className={isRtl ? 'text-right' : 'text-left'}>
                      <h3 className="font-semibold text-foreground">{t('hero.highSecurity')}</h3>
                      <p className="text-sm text-muted-foreground">{t('hero.highSecurityDesc')}</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-card rounded-2xl p-6 shadow-elegant border border-border/50">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-gold to-gold-light rounded-xl flex items-center justify-center">
                      <Users className="h-6 w-6 text-primary-foreground" />
                    </div>
                    <div className={isRtl ? 'text-right' : 'text-left'}>
                      <h3 className="font-semibold text-foreground">{t('hero.trustedCommunity')}</h3>
                      <p className="text-sm text-muted-foreground">{t('hero.trustedCommunityDesc')}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;