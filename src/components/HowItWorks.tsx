import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, UserPlus, Search, DollarSign, TrendingUp } from "lucide-react";

const HowItWorks = () => {
  const borrowerSteps = [
    {
      icon: UserPlus,
      title: "إنشاء حساب",
      description: "سجل حسابك وأكمل عملية التحقق"
    },
    {
      icon: Search,
      title: "طلب قرض",
      description: "حدد المبلغ والغرض ومدة السداد"
    },
    {
      icon: DollarSign,
      title: "احصل على التمويل",
      description: "تلقَ الأموال بعد الموافقة"
    }
  ];

  const lenderSteps = [
    {
      icon: UserPlus,
      title: "إنشاء حساب",
      description: "سجل كمستثمر وأودع أموالك"
    },
    {
      icon: Search,
      title: "اختر الاستثمار",
      description: "تصفح الفرص المتاحة واختر الأنسب"
    },
    {
      icon: TrendingUp,
      title: "اجن العوائد",
      description: "تابع استثماراتك واحصل على العوائد"
    }
  ];

  return (
    <section id="how-it-works" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-foreground mb-4">
            كيف يعمل <span className="text-gold">قرشين؟</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            عملية بسيطة وآمنة للحصول على التمويل أو الاستثمار
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-16">
          {/* For Borrowers */}
          <div className="space-y-8">
            <div className="text-center">
              <h3 className="text-2xl font-bold text-foreground mb-4">للمقترضين</h3>
              <p className="text-muted-foreground">احصل على التمويل الذي تحتاجه بسهولة</p>
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
                      <div className="text-right">
                        <h4 className="font-semibold text-foreground mb-1">{step.title}</h4>
                        <p className="text-muted-foreground text-sm">{step.description}</p>
                      </div>
                    </div>
                  </Card>
                </div>
              ))}
            </div>
            
            <Button variant="golden" className="w-full">
              طلب قرض الآن
              <ArrowLeft className="mr-2 h-4 w-4 rotate-180" />
            </Button>
          </div>

          {/* For Lenders */}
          <div className="space-y-8">
            <div className="text-center">
              <h3 className="text-2xl font-bold text-foreground mb-4">للمستثمرين</h3>
              <p className="text-muted-foreground">استثمر أموالك واحصل على عوائد مجزية</p>
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
                      <div className="text-right">
                        <h4 className="font-semibold text-foreground mb-1">{step.title}</h4>
                        <p className="text-muted-foreground text-sm">{step.description}</p>
                      </div>
                    </div>
                  </Card>
                </div>
              ))}
            </div>
            
            <Button variant="outline" className="w-full">
              ابدأ الاستثمار
              <ArrowLeft className="mr-2 h-4 w-4 rotate-180" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;