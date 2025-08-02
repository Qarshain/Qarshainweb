import { Card } from "@/components/ui/card";
import { Shield, TrendingUp, Clock, Users, CreditCard, FileText } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const Features = () => {
  const { t } = useLanguage();
  
  const features = [
    {
      icon: Shield,
      title: t('features.security'),
      description: t('features.securityDesc')
    },
    {
      icon: TrendingUp,
      title: t('features.returns'),
      description: t('features.returnsDesc')
    },
    {
      icon: Clock,
      title: t('features.processing'),
      description: t('features.processingDesc')
    },
    {
      icon: Users,
      title: t('features.assessment'),
      description: t('features.assessmentDesc')
    },
    {
      icon: CreditCard,
      title: t('features.flexibility'),
      description: t('features.flexibilityDesc')
    },
    {
      icon: FileText,
      title: t('features.transparency'),
      description: t('features.transparencyDesc')
    }
  ];

  return (
    <section id="features" className="py-20 bg-cream/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-foreground mb-4">
            {t('features.title')} <span className="text-gold">قرشين؟</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            {t('features.subtitle')}
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="p-6 hover:shadow-elegant transition-all duration-300 hover:scale-105 bg-card/80 backdrop-blur border-border/50">
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="w-16 h-16 bg-gradient-to-br from-gold to-gold-light rounded-2xl flex items-center justify-center">
                  <feature.icon className="h-8 w-8 text-primary-foreground" />
                </div>
                <h3 className="text-xl font-semibold text-foreground">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;