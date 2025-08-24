import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { formatSAR } from '@/lib/currency';
import { useLanguage } from '@/contexts/LanguageContext';
import { 
  TrendingUp, 
  Users, 
  Clock, 
  Shield, 
  AlertTriangle, 
  DollarSign, 
  Calendar,
  ArrowRight,
  Star,
  Eye
} from 'lucide-react';
import { collection, query, where, orderBy, limit, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';

interface StrategicOpportunity {
  id: string;
  title: string;
  description: string;
  amount: number;
  interestRate: number;
  term: string;
  risk: string;
  borrowerName: string;
  borrowerRating: number;
  fundedAmount: number;
  totalAmount: number;
  daysRemaining: number;
  category: string;
  purpose: string;
  status: 'open' | 'funding' | 'funded' | 'closed';
  investorCount: number;
  sector: string;
}

const StrategicOpportunities = () => {
  const { language } = useLanguage();
  const isAr = language === 'ar';
  const [opportunities, setOpportunities] = useState<StrategicOpportunity[]>([]);
  const [loading, setLoading] = useState(true);

  // Translation keys
  const labels = {
    title: isAr ? "فرص استثمارية استراتيجية" : "Strategic Investment Opportunities",
    subtitle: isAr ? "اكتشف أفضل الفرص الاستثمارية المختارة بعناية لتحقيق عوائد مثالية" : "Discover carefully curated investment opportunities for optimal returns",
    seeMore: isAr ? "عرض المزيد" : "See More",
            expectedROI: isAr ? "العائد المتوقع" : "Expected Return",
    fundingProgress: isAr ? "تقدم التمويل" : "Funding Progress",
    timeLeft: isAr ? "الوقت المتبقي" : "Time Left",
    investors: isAr ? "مستثمر" : "investors",
    investor: isAr ? "مستثمر" : "investor",
    days: isAr ? "أيام" : "days",
    day: isAr ? "يوم" : "day",
    funded: isAr ? "ممول" : "funded",
    riskClass: isAr ? "فئة المخاطر" : "Risk Class",
    lowRisk: isAr ? "مخاطر منخفضة" : "Low Risk",
    mediumRisk: isAr ? "مخاطر متوسطة" : "Medium Risk",
    highRisk: isAr ? "مخاطر عالية" : "High Risk",
    viewDetails: isAr ? "عرض التفاصيل" : "View Details",
    investNow: isAr ? "استثمر الآن" : "Invest Now",
    almostFunded: isAr ? "تقريباً ممول بالكامل" : "Almost Fully Funded",
    hotOpportunity: isAr ? "فرصة ساخنة" : "Hot Opportunity",
    limitedTime: isAr ? "وقت محدود" : "Limited Time"
  };

  // Load strategic opportunities
  useEffect(() => {
    const loadStrategicOpportunities = async () => {
      try {
        setLoading(true);
        
        // Get approved loans that are open for funding
        const loansQuery = query(
          collection(db, "loanRequests"),
          where("status", "==", "approved"),
          orderBy("createdAt", "desc"),
          limit(10) // Get more to filter strategically
        );
        
        const loansSnapshot = await getDocs(loansQuery);
        const allLoans = loansSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as StrategicOpportunity[];

        // Strategic selection: Mix of risk levels and funding progress
        const strategicSelection = selectStrategicOpportunities(allLoans);
        setOpportunities(strategicSelection);
        
      } catch (error) {
        console.error('Error loading strategic opportunities:', error);
        // Fallback to sample data if needed
        setOpportunities(getSampleOpportunities());
      } finally {
        setLoading(false);
      }
    };

    loadStrategicOpportunities();
  }, [language]); // Add language dependency to reload when language changes

  // Strategic opportunity selection algorithm
  const selectStrategicOpportunities = (loans: StrategicOpportunity[]): StrategicOpportunity[] => {
    if (loans.length === 0) return getSampleOpportunities();

    const selected: StrategicOpportunity[] = [];
    
    // 1. Class A (Low Risk) - High borrower rating, low risk
    const classA = loans
      .filter(loan => loan.borrowerRating >= 4.5 && loan.risk === 'low')
      .sort((a, b) => (b.fundedAmount / b.totalAmount) - (a.fundedAmount / a.totalAmount));
    
    if (classA.length > 0) {
      selected.push(classA[0]);
    }

    // 2. Class B (Medium Risk) - Balanced risk-reward
    const classB = loans
      .filter(loan => loan.borrowerRating >= 4.0 && loan.risk === 'medium')
      .sort((a, b) => b.interestRate - a.interestRate);
    
    if (classB.length > 0) {
      selected.push(classB[0]);
    }

    // 3. Class C (Higher Risk) - Higher potential returns
    const classC = loans
      .filter(loan => loan.risk === 'high' && loan.interestRate >= 7)
      .sort((a, b) => b.interestRate - a.interestRate);
    
    if (classC.length > 0) {
      selected.push(classC[0]);
    }

    // Fill remaining slots with high-funding-progress opportunities if needed
    const remainingSlots = 3 - selected.length;
    if (remainingSlots > 0) {
      const highProgress = loans
        .filter(loan => !selected.find(s => s.id === loan.id))
        .sort((a, b) => (b.fundedAmount / b.totalAmount) - (a.fundedAmount / a.totalAmount))
        .slice(0, remainingSlots);
      
      selected.push(...highProgress);
    }

    return selected.slice(0, 3);
  };

  // Sample opportunities for fallback
  const getSampleOpportunities = (): StrategicOpportunity[] => [
    {
      id: 'sample-1',
      title: isAr ? 'توسعة مشروع تجاري صغير' : 'Small Business Expansion',
      description: isAr ? 'تمويل لتوسعة متجر إلكتروني ناجح مع خطة نمو واضحة' : 'Funding for expanding a successful e-commerce store with a clear growth plan',
      amount: 5000,
      interestRate: 5.5,
      term: '12',
      risk: 'low',
      borrowerName: isAr ? 'أحمد محمد' : 'Ahmed Mohammed',
      borrowerRating: 4.8,
      fundedAmount: 4000,
      totalAmount: 5000,
      daysRemaining: 15,
      category: 'Business',
      purpose: 'Business Expansion',
      status: 'funding',
      investorCount: 23,
      sector: 'E-commerce'
    },
    {
      id: 'sample-2',
      title: isAr ? 'تطوير تطبيق تقني' : 'Tech App Development',
      description: isAr ? 'تطوير تطبيق جوال مبتكر مع إمكانات تسويقية عالية' : 'Development of an innovative mobile app with high marketing potential',
      amount: 5000,
      interestRate: 7.0,
      term: '18',
      risk: 'medium',
      borrowerName: isAr ? 'سارة أحمد' : 'Sarah Ahmed',
      borrowerRating: 4.2,
      fundedAmount: 3600,
      totalAmount: 5000,
      daysRemaining: 8,
      category: 'Technology',
      purpose: 'App Development',
      status: 'funding',
      investorCount: 31,
      sector: 'Technology'
    },
    {
      id: 'sample-3',
      title: isAr ? 'مشروع عقاري استثماري' : 'Real Estate Investment',
      description: isAr ? 'شراء وتطوير عقار استثماري في منطقة ناشئة' : 'Purchase and development of investment property in an emerging area',
      amount: 5000,
      interestRate: 8.0,
      term: '24',
      risk: 'high',
      borrowerName: isAr ? 'محمد علي' : 'Mohammed Ali',
      borrowerRating: 4.0,
      fundedAmount: 3500,
      totalAmount: 5000,
      daysRemaining: 12,
      category: 'Real Estate',
      purpose: 'Property Investment',
      status: 'funding',
      investorCount: 45,
      sector: 'Real Estate'
    }
  ];

  const getRiskClassLabel = (risk: string) => {
    switch (risk) {
      case 'low': return { label: 'Class A', color: 'bg-green-100 text-green-800 border-green-200', icon: <Shield className="h-4 w-4" /> };
      case 'medium': return { label: 'Class B', color: 'bg-yellow-100 text-yellow-800 border-yellow-200', icon: <AlertTriangle className="h-4 w-4" /> };
      case 'high': return { label: 'Class C', color: 'bg-red-100 text-red-800 border-red-200', icon: <TrendingUp className="h-4 w-4" /> };
      default: return { label: 'Class B', color: 'bg-gray-100 text-gray-800 border-gray-200', icon: <Shield className="h-4 w-4" /> };
    }
  };

  const getUrgencyBadge = (opportunity: StrategicOpportunity) => {
    const progress = (opportunity.fundedAmount / opportunity.totalAmount) * 100;
    const daysLeft = opportunity.daysRemaining;
    
    if (progress >= 80) {
      return <Badge className="bg-green-100 text-green-800 border-green-200">{labels.almostFunded}</Badge>;
    } else if (daysLeft <= 7) {
      return <Badge className="bg-red-100 text-red-800 border-red-200">{labels.limitedTime}</Badge>;
    } else if (progress >= 60) {
      return <Badge className="bg-orange-100 text-orange-800 border-orange-200">{labels.hotOpportunity}</Badge>;
    }
    return null;
  };

  if (loading) {
    return (
      <section className="py-16 bg-gradient-to-br from-[var(--garshain-cream)] to-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--garshain-gold)] mx-auto mb-4"></div>
            <p className="text-muted-foreground">{isAr ? 'جاري تحميل الفرص...' : 'Loading opportunities...'}</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="strategic-opportunities" className="py-16 bg-gradient-to-br from-[var(--garshain-cream)] to-white">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-[var(--garshain-text)] mb-4">
            {labels.title}
          </h2>
          <p className="text-xl text-[var(--garshain-text)] opacity-70 max-w-3xl mx-auto">
            {labels.subtitle}
          </p>
        </div>

        {/* Strategic Opportunities Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {opportunities.map((opportunity, index) => {
            const riskClass = getRiskClassLabel(opportunity.risk);
            const progress = (opportunity.fundedAmount / opportunity.totalAmount) * 100;
            const urgencyBadge = getUrgencyBadge(opportunity);
            
            return (
              <Card 
                key={opportunity.id} 
                className="group hover:scale-105 hover:shadow-2xl transition-all duration-500 border-2 hover:border-[var(--garshain-gold)] relative overflow-hidden transform-gpu cursor-pointer bg-white/80 backdrop-blur-sm"
                style={{
                  animationDelay: `${index * 200}ms`,
                  animation: 'fadeInUp 0.8s ease-out forwards'
                }}
              >
                {/* Interactive Background Pattern */}
                <div className="absolute inset-0 bg-gradient-to-br from-transparent via-[var(--garshain-gold)]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                {/* Floating Elements */}
                <div className="absolute top-4 right-4 w-2 h-2 bg-[var(--garshain-gold)] rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-bounce transition-all duration-500" />
                <div className="absolute bottom-4 left-4 w-1 h-1 bg-[var(--garshain-gold)] rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-pulse transition-all duration-500" />

                {/* Urgency Badge */}
                {urgencyBadge && (
                  <div className="absolute top-3 right-3 z-10 transform group-hover:scale-110 transition-transform duration-300">
                    {urgencyBadge}
                  </div>
                )}

                {/* Risk Class Badge */}
                <div className="absolute top-3 left-3 z-10 transform group-hover:scale-110 transition-transform duration-300">
                  <Badge className={`${riskClass.color} flex items-center gap-1 shadow-lg`}>
                    {riskClass.icon}
                    {riskClass.label}
                  </Badge>
                </div>

                <CardHeader className="pb-3 pt-16 relative z-10">
                  <CardTitle className="text-xl group-hover:text-[var(--garshain-gold)] transition-all duration-300 font-bold">
                    {opportunity.title}
                  </CardTitle>
                  <p className="text-sm text-muted-foreground line-clamp-2 group-hover:text-[var(--garshain-text)] transition-colors duration-300">
                    {opportunity.description}
                  </p>
                </CardHeader>

                <CardContent className="space-y-4 relative z-10">
                  {/* Key Metrics with Hover Effects */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="text-center p-3 bg-blue-50 rounded-lg group-hover:bg-blue-100 transition-all duration-300 transform group-hover:scale-105 hover:shadow-md">
                      <div className="text-2xl font-bold text-blue-600 group-hover:text-blue-700 transition-colors">
                        {opportunity.interestRate}%
                      </div>
                      <div className="text-xs text-blue-600 font-medium">
                        {labels.expectedROI}
                      </div>
                    </div>
                    <div className="text-center p-3 bg-green-50 rounded-lg group-hover:bg-green-100 transition-all duration-300 transform group-hover:scale-105 hover:shadow-md">
                      <div className="text-2xl font-bold text-green-600 group-hover:text-green-700 transition-colors">
                        {opportunity.investorCount}
                      </div>
                      <div className="text-xs text-green-600 font-medium">
                        {opportunity.investorCount === 1 ? labels.investor : labels.investors}
                      </div>
                    </div>
                  </div>

                  {/* Interactive Funding Progress */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground group-hover:text-[var(--garshain-text)] transition-colors">{labels.fundingProgress}</span>
                      <span className="font-medium text-[var(--garshain-gold)]">{Math.round(progress)}%</span>
                    </div>
                    <div className="relative">
                      <Progress value={progress} className="h-3 group-hover:h-4 transition-all duration-300" />
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-pulse" />
                    </div>
                    <div className="text-sm text-muted-foreground group-hover:text-[var(--garshain-text)] transition-colors">
                      {formatSAR(opportunity.fundedAmount)} {labels.funded} من {formatSAR(opportunity.totalAmount)}
                    </div>
                  </div>

                  {/* Time and Amount with Hover Effects */}
                  <div className="flex justify-between items-center text-sm p-2 rounded-lg group-hover:bg-[var(--garshain-cream)]/50 transition-all duration-300">
                    <div className="flex items-center gap-1 text-muted-foreground group-hover:text-[var(--garshain-text)] transition-colors">
                      <Clock className="h-4 w-4 group-hover:animate-spin transition-all duration-300" />
                      <span>
                        {opportunity.daysRemaining} {opportunity.daysRemaining === 1 ? labels.day : labels.days}
                      </span>
                    </div>
                    <div className="font-medium text-[var(--garshain-gold)] group-hover:scale-110 transition-transform duration-300">
                      {formatSAR(opportunity.amount)}
                    </div>
                  </div>

                  {/* Interactive Action Buttons */}
                  <div className="flex gap-2 pt-2">
                    <Button 
                      asChild 
                      className="flex-1 bg-[var(--garshain-gold)] hover:bg-[var(--garshain-gold)]/90 text-white font-semibold transform hover:scale-105 transition-all duration-300 hover:shadow-lg active:scale-95"
                    >
                      <Link to="/invest">
                        <TrendingUp className="h-4 w-4 mr-2 group-hover:animate-bounce" />
                        {labels.investNow}
                      </Link>
                    </Button>
                    <Button 
                      variant="outline" 
                      asChild 
                      className="flex-1 border-[var(--garshain-gold)] text-[var(--garshain-gold)] hover:bg-[var(--garshain-gold)] hover:text-white transform hover:scale-105 transition-all duration-300 hover:shadow-lg active:scale-95"
                    >
                      <Link to="/invest">
                        <Eye className="h-4 w-4 mr-2 group-hover:animate-pulse" />
                        {labels.viewDetails}
                      </Link>
                    </Button>
                  </div>
                </CardContent>

                {/* Interactive Border Animation */}
                <div className="absolute inset-0 border-2 border-transparent group-hover:border-[var(--garshain-gold)] transition-all duration-500 rounded-lg" />
              </Card>
            );
          })}
        </div>

        {/* See More Button */}
        <div className="text-center">
          <Button asChild size="lg" className="bg-[var(--garshain-gold)] hover:bg-[var(--garshain-gold)]/90 text-[var(--garshain-text)] font-semibold px-8 py-4 text-lg shadow-lg">
            <Link to="/invest">
              {labels.seeMore}
              <ArrowRight className="h-5 w-5 ml-2" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default StrategicOpportunities;
