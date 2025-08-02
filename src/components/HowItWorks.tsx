import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, UserPlus, Search, DollarSign, TrendingUp, FileText, CheckCircle } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const HowItWorks = () => {
  const { language, t } = useLanguage();
  const isRtl = language === 'ar';
  
  const borrowerSteps = [
    {
      icon: FileText,
      title: t('howItWorks.step1Borrower'),
      description: t('howItWorks.step1BorrowerDesc')
    },
    {
      icon: CheckCircle,
      title: t('howItWorks.step2Borrower'),
      description: t('howItWorks.step2BorrowerDesc')
    },
    {
      icon: DollarSign,
      title: t('howItWorks.step3Borrower'),
      description: t('howItWorks.step3BorrowerDesc')
    }
  ];

  const lenderSteps = [
    {
      icon: UserPlus,
      title: t('howItWorks.step1Investor'),
      description: t('howItWorks.step1InvestorDesc')
    },
    {
      icon: Search,
      title: t('howItWorks.step2Investor'),
      description: t('howItWorks.step2InvestorDesc')
    },
    {
      icon: TrendingUp,
      title: t('howItWorks.step3Investor'),
      description: t('howItWorks.step3InvestorDesc')
    }
  ];

  return (
    <section id="how-it-works" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-foreground mb-4">
            {t('howItWorks.title')}
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            {t('howItWorks.subtitle')}
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-16">
          {/* For Borrowers */}
          <div className="space-y-8">
            <div className="text-center">
              <h3 className="text-2xl font-bold text-foreground mb-4">{t('howItWorks.forBorrowers')}</h3>
              <p className="text-muted-foreground">{language === 'ar' ? 'احصل على التمويل الذي تحتاجه بسهولة' : 'Get the funding you need easily'}</p>
            </div>
            
            <div className="space-y-6">
              {borrowerSteps.map((step, index) => (
                <div key={index} className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-gradient-to-br from-gold to-gold-light rounded-xl flex items-center justify-center text-primary-foreground font-bold">
                      {index + 1}
                    </div>
                  </div>
                    <Card className="flex-1 p-4 border-border/50">
                      <div className="flex items-start gap-3">
                        <step.icon className="h-6 w-6 text-gold mt-1" />
                        <div className={isRtl ? 'text-right' : 'text-left'}>
                          <h4 className="font-semibold text-foreground mb-1">{step.title}</h4>
                          <p className="text-muted-foreground text-sm">{step.description}</p>
                        </div>
                      </div>
                    </Card>
                </div>
              ))}
            </div>
            
            <Button variant="golden" className="w-full">
              {language === 'ar' ? 'طلب قرض الآن' : 'Request Loan Now'}
              {isRtl ? (
                <ArrowLeft className="mr-2 h-4 w-4 rotate-180" />
              ) : (
                <ArrowRight className="ml-2 h-4 w-4" />
              )}
            </Button>
          </div>

          {/* For Lenders */}
          <div className="space-y-8">
            <div className="text-center">
              <h3 className="text-2xl font-bold text-foreground mb-4">{t('howItWorks.forInvestors')}</h3>
              <p className="text-muted-foreground">{language === 'ar' ? 'استثمر أموالك واحصل على عوائد مجزية' : 'Invest your money and get attractive returns'}</p>
            </div>
            
            <div className="space-y-6">
              {lenderSteps.map((step, index) => (
                <div key={index} className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-gradient-to-br from-gold to-gold-light rounded-xl flex items-center justify-center text-primary-foreground font-bold">
                      {index + 1}
                    </div>
                  </div>
                    <Card className="flex-1 p-4 border-border/50">
                      <div className="flex items-start gap-3">
                        <step.icon className="h-6 w-6 text-gold mt-1" />
                        <div className={isRtl ? 'text-right' : 'text-left'}>
                          <h4 className="font-semibold text-foreground mb-1">{step.title}</h4>
                          <p className="text-muted-foreground text-sm">{step.description}</p>
                        </div>
                      </div>
                    </Card>
                </div>
              ))}
            </div>
            
            <Button variant="outline" className="w-full">
              {language === 'ar' ? 'ابدأ الاستثمار' : 'Start Investing'}
              {isRtl ? (
                <ArrowLeft className="mr-2 h-4 w-4 rotate-180" />
              ) : (
                <ArrowRight className="ml-2 h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;