import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { collection, getDocs, query, where, orderBy, onSnapshot, addDoc, updateDoc, doc } from "firebase/firestore";
import { db } from "../lib/firebase";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { formatSAR } from "@/lib/currency";
import { TrendingUp, Users, Clock, Shield, AlertTriangle, CheckCircle, DollarSign, Calendar, Target, ArrowLeft, Home, Globe, AlertCircle } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface Opportunity {
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
  originalStatus: string; // Added for debugging
}

const InvestList = () => {
  const navigate = useNavigate();
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'low-risk' | 'medium-risk' | 'high-risk'>('all');
  const [sortBy, setSortBy] = useState<'amount' | 'interest' | 'risk' | 'days'>('amount');
  const { language, setLanguage } = useLanguage();
  const isAr = language === 'ar';
  const { user, userType } = useAuth();

  // Check language consistency on page load
  useEffect(() => {
    const savedLanguage = localStorage.getItem('preferred-language');
    if (savedLanguage && savedLanguage !== language) {
      console.log(`🔄 InvestList: Language mismatch detected. Fixing...`);
      setLanguage(savedLanguage as 'ar' | 'en');
    }
  }, [language, setLanguage]);

  // Translation keys
  const labels = {
    title: isAr ? "فرص الاستثمار" : "Investment Opportunities",
    subtitle: isAr ? "اختر من بين مجموعة متنوعة من طلبات القروض للاستثمار" : "Choose from a variety of loan requests to invest in",
    filterAll: isAr ? "الكل" : "All",
    filterLowRisk: isAr ? "مخاطر منخفضة" : "Low Risk",
    filterMediumRisk: isAr ? "مخاطر متوسطة" : "Medium Risk",
    filterHighRisk: isAr ? "مخاطر عالية" : "High Risk",
    sortBy: isAr ? "ترتيب حسب" : "Sort by",
    sortAmount: isAr ? "المبلغ" : "Amount",
            sortInterest: isAr ? "معدل الربح" : "Expected Return",
    sortRisk: isAr ? "المخاطر" : "Risk",
    sortDays: isAr ? "الأيام المتبقية" : "Days Remaining",
    riskLevel: isAr ? "مستوى المخاطر" : "Risk Level",
    borrowerRating: isAr ? "تقييم المقترض" : "Borrower Rating",
    fundedAmount: isAr ? "المبلغ الممول" : "Funded Amount",
    daysRemaining: isAr ? "الأيام المتبقية" : "Days Remaining",
    investNow: isAr ? "استثمر الآن" : "Invest Now",
    viewDetails: isAr ? "عرض التفاصيل" : "View Details",
    category: isAr ? "الفئة" : "Category",
    purpose: isAr ? "الغرض" : "Purpose",
    status: isAr ? "الحالة" : "Status",
    statusOpen: isAr ? "مفتوح" : "Open",
    statusFunding: isAr ? "قيد التمويل" : "Funding",
    statusFunded: isAr ? "ممول" : "Funded",
    statusClosed: isAr ? "مغلق" : "Closed",
    noOpportunities: isAr ? "لا توجد فرص استثمار متاحة حالياً" : "No investment opportunities available at the moment",
    loading: isAr ? "جاري تحميل الفرص..." : "Loading opportunities...",
    interestRate: isAr ? "معدل الربح" : "Expected Return"
  };

  // Manual check of current opportunities state
  const checkCurrentOpportunities = async () => {
    try {
      console.log("🔍 Manual check of current opportunities state...");
      
      // Get all loans regardless of status
      const allLoansQuery = query(collection(db, "loanRequests"));
      const allLoansSnapshot = await getDocs(allLoansQuery);
      
      console.log(`📊 Total loans in system: ${allLoansSnapshot.docs.length}`);
      
      // Count by status
      const statusCounts = {
        pending: 0,
        approved: 0,
        rejected: 0,
        draft: 0,
        other: 0
      };
      
      allLoansSnapshot.docs.forEach(doc => {
        const data = doc.data();
        const status = data.status || 'other';
        if (statusCounts.hasOwnProperty(status)) {
          statusCounts[status]++;
        } else {
          statusCounts.other++;
        }
      });
      
      console.log("📈 Loan status breakdown:", statusCounts);
      
      // Show summary
      alert(`Loan Status Summary:\n\n` +
            `Total Loans: ${allLoansSnapshot.docs.length}\n` +
            `Pending: ${statusCounts.pending}\n` +
            `Approved: ${statusCounts.approved}\n` +
            `Rejected: ${statusCounts.rejected}\n` +
            `Draft: ${statusCounts.draft}\n` +
            `Other: ${statusCounts.other}\n\n` +
            `Expected Opportunities: ${statusCounts.pending + statusCounts.approved}\n` +
            `Current Opportunities: ${opportunities.length}`);
      
    } catch (error) {
      console.error("❌ Error checking opportunities state:", error);
      alert(`Error checking opportunities: ${error.message}`);
    }
  };

  // Calculate total funded amount from investments for a specific loan
  const calculateTotalFundedAmount = async (loanId: string) => {
    try {
      console.log(`🔍 Calculating funded amount for loan: ${loanId}`);
      
      // First try with 'active' status
      let investmentsQuery = query(
        collection(db, "investments"),
        where("loanRequestId", "==", loanId),
        where("status", "==", "active")
      );
      
      let investmentsSnapshot = await getDocs(investmentsQuery);
      console.log(`📊 Found ${investmentsSnapshot.docs.length} 'active' investments for loan ${loanId}`);
      
      // If no active investments, try without status filter
      if (investmentsSnapshot.docs.length === 0) {
        console.log("⚠️ No active investments found, checking all investments...");
        investmentsQuery = query(
          collection(db, "investments"),
          where("loanRequestId", "==", loanId)
        );
        investmentsSnapshot = await getDocs(investmentsQuery);
        console.log(`📊 Found ${investmentsSnapshot.docs.length} total investments for loan ${loanId}`);
      }
      
      let totalFunded = 0;
      
      investmentsSnapshot.docs.forEach((doc, index) => {
        const data = doc.data();
        console.log(`💰 Investment ${index + 1}:`, {
          id: doc.id,
          amount: data.amount,
          status: data.status,
          investedAt: data.investedAt
        });
        totalFunded += data.amount || 0;
      });
      
      console.log(`💰 Total funded amount for loan ${loanId}: ${totalFunded} SAR`);
      return totalFunded;
      
    } catch (error) {
      console.error("❌ Error calculating funded amount:", error);
      return 0;
    }
  };

  // Check for deleted loans and show notification
  const checkForDeletedLoans = () => {
    // This will be called by the real-time listener
    // but we can also call it manually if needed
    console.log("🔍 Checking for deleted loans...");
    
    // The real-time listener should handle this automatically
    // but if it doesn't, the manual refresh button will force a reload
  };

  // Test progress bar calculation
  const testProgressBar = () => {
    if (opportunities.length === 0) {
      alert("No opportunities to test. Create some loans first.");
      return;
    }
    
    const firstOpp = opportunities[0];
    const progress = (firstOpp.fundedAmount / firstOpp.totalAmount) * 100;
    
    alert(`Progress Bar Test for "${firstOpp.title}":\n\n` +
          `Total Amount: ${formatSAR(firstOpp.totalAmount, language)}\n` +
          `Funded Amount: ${formatSAR(firstOpp.fundedAmount, language)}\n` +
          `Progress: ${progress.toFixed(1)}%\n\n` +
          `If funded amount is 0, the progress bar will show 0%.\n` +
          `Use "Create Sample Investment" to test with real money.`);
  };

  // Manual refresh specifically for when loans are deleted
  const refreshAfterLoanDeletion = async () => {
    try {
      console.log("🔄 Manual refresh after loan deletion...");
      setLoading(true);
      
      // Force reload all data by refreshing the page
      window.location.reload();
      
    } catch (error) {
      console.error("❌ Error during manual refresh:", error);
      alert(`Error refreshing: ${error.message}`);
    }
  };

  // Create a sample investment for testing
  const createSampleInvestment = async () => {
    try {
      if (opportunities.length === 0) {
        alert("No opportunities available to invest in. Create a loan first.");
        return;
      }
      
      const firstOpportunity = opportunities[0];
      const investmentAmount = 1000; // 1000 SAR test investment
      
      console.log("🧪 Creating sample investment for testing...");
      console.log("📋 Target opportunity:", firstOpportunity);
      
      // Create investment record
      const investmentRef = await addDoc(collection(db, "investments"), {
        userId: "test-user-123",
        loanRequestId: firstOpportunity.id,
        amount: investmentAmount,
        investedAt: new Date(),
        status: 'active',
        expectedReturn: investmentAmount * 1.1, // 10% return
        repaymentDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days
      });
      
      console.log("✅ Sample investment created:", investmentRef.id);
      
      alert(`Sample investment of ${investmentAmount} SAR created for loan ${firstOpportunity.id}!\n\nRefresh the page to see the progress bar update.`);
      
      // Refresh the page to show the updated progress
      window.location.reload();
      
    } catch (error) {
      console.error("❌ Error creating sample investment:", error);
      alert(`Error creating sample investment: ${error.message}`);
    }
  };

  // Create a sample loan for testing if none exist
  const createSampleLoan = async () => {
    try {
      console.log("🧪 Creating sample loan for testing...");
      
      const sampleLoanData = {
        name: "Test Borrower",
        amount: 5000,
        purpose: "Business expansion",
        repaymentPeriod: 12,
        status: "pending",
        submittedAt: new Date(),
        updatedAt: new Date(),
        userId: "test-user-123"
      };
      
      // Add to Firestore
      const docRef = await addDoc(collection(db, "loanRequests"), sampleLoanData);
      console.log("✅ Sample loan created with ID:", docRef.id);
      
      alert("Sample loan created! Refresh the page to see it as an investment opportunity.");
      
      // Refresh the data
      window.location.reload();
      
    } catch (error) {
      console.error("❌ Error creating sample loan:", error);
      alert(`Error creating sample loan: ${error.message}`);
    }
  };

  // Monitor opportunities changes for debugging
  useEffect(() => {
    if (opportunities.length > 0) {
      console.log(`📊 Opportunities updated: ${opportunities.length} opportunities`);
      console.log("🎯 Current opportunity IDs:", opportunities.map(opp => opp.id));
    }
  }, [opportunities]);

  useEffect(() => {
    const loadOpportunities = async () => {
      try {
        setLoading(true);
        console.log("🔄 Loading investment opportunities...");
        
        // Get all loans regardless of status first
        const allLoansQuery = query(collection(db, "loanRequests"));
        const allLoansSnapshot = await getDocs(allLoansQuery);
        console.log(`📊 Total loans found: ${allLoansSnapshot.docs.length}`);
        
        if (allLoansSnapshot.docs.length === 0) {
          console.log("⚠️ No loans found in the system");
          setOpportunities([]);
          setLoading(false);
          return;
        }
        
        // Get all investments to calculate real funded amounts
        const allInvestmentsQuery = query(collection(db, "investments"));
        const allInvestmentsSnapshot = await getDocs(allInvestmentsQuery);
        console.log(`💰 Total investments found: ${allInvestmentsSnapshot.docs.length}`);
        
        // Create a map of loan ID to total funded amount
        const fundedAmounts = new Map();
        allInvestmentsSnapshot.docs.forEach(doc => {
          const data = doc.data();
          const loanId = data.loanRequestId;
          const amount = data.amount || 0;
          
          if (fundedAmounts.has(loanId)) {
            fundedAmounts.set(loanId, fundedAmounts.get(loanId) + amount);
          } else {
            fundedAmounts.set(loanId, amount);
          }
        });
        
        console.log("💰 Funded amounts map:", Object.fromEntries(fundedAmounts));
        
        // Transform loans into opportunities with REAL funded amounts
        const opportunitiesData = allLoansSnapshot.docs
          .filter(doc => {
            const data = doc.data();
            // Only show pending or approved loans
            return data.status === 'pending' || data.status === 'approved';
          })
          .filter(doc => {
            const data = doc.data();
            // Filter out opportunities where the borrower is the current user
            return data.userId !== user?.uid;
          })
          .map(doc => {
            const data = doc.data();
            const riskScore = calculateRiskScore(data);
            const riskLevel = getRiskLevel(riskScore);
            
            // Get REAL funded amount from investments
            const realFundedAmount = fundedAmounts.get(doc.id) || 0;
            
            console.log(`🎯 Loan ${doc.id}:`, {
              amount: data.amount,
              status: data.status,
              realFundedAmount: realFundedAmount,
              progress: realFundedAmount > 0 ? `${((realFundedAmount / data.amount) * 100).toFixed(1)}%` : '0%'
            });
            
            return {
              id: doc.id,
              title: isAr 
                ? `${data.repaymentPeriod} أشهر - ${data.amount.toLocaleString('ar-SA')} ريال`
                : `${formatSAR(data.amount, 'en')}, ${data.repaymentPeriod} months`,
              description: data.purpose || "Personal loan request",
              amount: data.amount,
              interestRate: 10,
              term: `${data.repaymentPeriod} ${isAr ? 'أشهر' : 'months'}`,
              risk: riskLevel,
              borrowerName: data.name || "Anonymous",
              borrowerRating: 4.2,
              fundedAmount: realFundedAmount, // REAL funded amount
              totalAmount: data.amount,
              daysRemaining: 25,
              category: getCategory(data.purpose),
              purpose: data.purpose || "Personal use",
              status: (data.status === 'pending' ? 'open' : 'funding') as 'open' | 'funding' | 'funded' | 'closed',
              originalStatus: data.status
            };
          });
        
        console.log(`✅ Final opportunities: ${opportunitiesData.length}`, opportunitiesData);
        setOpportunities(opportunitiesData);
        
      } catch (error) {
        console.error("❌ Error loading opportunities:", error);
        setOpportunities([]);
      } finally {
        setLoading(false);
      }
    };
    
    // Load opportunities immediately
    loadOpportunities();
    
    // Set up real-time listener for immediate updates
    const unsubscribe = onSnapshot(
      query(collection(db, "loanRequests")),
      (snapshot) => {
        console.log("🔄 Real-time update received, reloading opportunities...");
        console.log(`📊 Current loans in system: ${snapshot.docs.length}`);
        
        // Check if any opportunities need to be removed due to deletions
        const currentLoanIds = snapshot.docs.map(doc => doc.id);
        const opportunitiesToRemove = opportunities.filter(opp => !currentLoanIds.includes(opp.id));
        
        if (opportunitiesToRemove.length > 0) {
          console.log(`🗑️ Found ${opportunitiesToRemove.length} deleted loans:`, opportunitiesToRemove.map(opp => opp.id));
          console.log("🔄 Removing deleted loans from opportunities...");
        }
        
        // Reload everything when loans change
        loadOpportunities();
      },
      (error) => {
        console.error("❌ Real-time listener error:", error);
      }
    );
    
    return () => unsubscribe();
  }, [isAr, user]);

  const calculateRiskScore = (loanData: any) => {
    let score = 50; // Base score
    
    // Amount risk (higher amounts = higher risk)
    if (loanData.amount > 3000) score += 20;
    else if (loanData.amount > 1500) score += 10;
    
    // Term risk (longer terms = higher risk)
    if (loanData.repaymentPeriod > 9) score += 15;
    else if (loanData.repaymentPeriod > 6) score += 10;
    
    // Purpose risk
    if (loanData.purpose?.toLowerCase().includes('business')) score += 10;
    if (loanData.purpose?.toLowerCase().includes('debt')) score += 15;
    
    return Math.min(score, 100);
  };

  const getRiskLevel = (score: number) => {
    if (score <= 30) return 'low';
    if (score <= 60) return 'medium';
    return 'high';
  };

  const getCategory = (purpose: string) => {
    if (!purpose) return "Personal";
    const lowerPurpose = purpose.toLowerCase();
    if (lowerPurpose.includes('business') || lowerPurpose.includes('project')) return "Business";
    if (lowerPurpose.includes('home') || lowerPurpose.includes('renovation')) return "Home";
    if (lowerPurpose.includes('education') || lowerPurpose.includes('study')) return "Education";
    if (lowerPurpose.includes('medical') || lowerPurpose.includes('health')) return "Medical";
    if (lowerPurpose.includes('debt') || lowerPurpose.includes('consolidation')) return "Debt";
    return "Personal";
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'funding': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'funded': return 'bg-green-100 text-green-800 border-green-200';
      case 'closed': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getRiskIcon = (risk: string) => {
    switch (risk) {
      case 'low': return <Shield className="h-4 w-4 text-green-500" />;
      case 'medium': return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'high': return <AlertTriangle className="h-4 w-4 text-red-500" />;
      default: return <Shield className="h-4 w-4 text-gray-500" />;
    }
  };

  const filteredOpportunities = opportunities.filter(opp => {
    if (filter === 'all') return true;
    
    console.log(`🔍 Filtering opportunity:`, {
      id: opp.id,
      risk: opp.risk,
      filter: filter,
      matches: opp.risk === filter
    });
    
    return opp.risk === filter;
  });

  console.log(`📊 Filtering results:`, {
    totalOpportunities: opportunities.length,
    filter: filter,
    filteredCount: filteredOpportunities.length,
    opportunitiesByRisk: {
      low: opportunities.filter(opp => opp.risk === 'low').length,
      medium: opportunities.filter(opp => opp.risk === 'medium').length,
      high: opportunities.filter(opp => opp.risk === 'high').length
    }
  });

  const sortedOpportunities = [...filteredOpportunities].sort((a, b) => {
    switch (sortBy) {
      case 'amount':
        return b.amount - a.amount;
      case 'interest':
        return b.interestRate - a.interestRate;
      case 'risk':
        return a.risk === 'low' ? -1 : a.risk === 'medium' ? 0 : 1;
      case 'days':
        return a.daysRemaining - b.daysRemaining;
      default:
        return 0;
    }
  });

  if (loading) return (
    <div className="p-8 text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold mx-auto mb-4"></div>
      <p className="text-muted-foreground">{labels.loading}</p>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Navigation Header */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex gap-4">
          <Button variant="outline" onClick={() => navigate('/')} className="bg-blue-50 hover:bg-blue-100 text-blue-700 border-blue-200">
            <Home className="h-4 w-4 mr-2" />
            Home
          </Button>
          <Button variant="outline" onClick={() => navigate(-1)} className="bg-gray-50 hover:bg-gray-100 text-gray-700 border-gray-200">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        </div>
        <Button 
          variant="outline" 
          onClick={() => setLanguage(isAr ? 'en' : 'ar')} 
          className="bg-purple-50 hover:bg-purple-100 text-purple-700 border-purple-200"
        >
          <Globe className="h-4 w-4 mr-2" />
          {isAr ? "English" : "عربي"}
        </Button>
      </div>

      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-4">{labels.title}</h1>
        <p className="text-lg text-muted-foreground">{labels.subtitle}</p>
        
        {/* Borrower Information Notice */}
        {user && userType === 'borrower' && (
          <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg max-w-2xl mx-auto">
            <div className="flex items-center gap-2 text-blue-800">
              <AlertCircle className="h-5 w-5" />
              <span className="font-medium">
                {isAr ? 'معلومات للمقترضين' : 'Borrower Information'}
              </span>
            </div>
            <p className="text-blue-700 text-sm mt-2">
              {isAr 
                ? 'يمكنك الاستثمار في قروض الآخرين، لكن لا يمكنك الاستثمار في قروضك الخاصة. هذا لمنع تضارب المصالح.'
                : 'You can invest in other people\'s loans, but you cannot invest in your own loans. This prevents conflicts of interest.'
              }
            </p>
          </div>
        )}
      </div>

      {/* Filters and Sorting */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8 justify-between items-center">
        <div className="flex gap-2">
          <Button
            variant={filter === 'all' ? 'default' : 'outline'}
            onClick={() => setFilter('all')}
            size="sm"
          >
            {labels.filterAll}
          </Button>
          <Button
            variant={filter === 'low-risk' ? 'default' : 'outline'}
            onClick={() => setFilter('low-risk')}
            size="sm"
            className="border-green-200 text-green-700 hover:bg-green-50"
          >
            {labels.filterLowRisk}
          </Button>
          <Button
            variant={filter === 'medium-risk' ? 'default' : 'outline'}
            onClick={() => setFilter('medium-risk')}
            size="sm"
            className="border-yellow-200 text-yellow-700 hover:bg-yellow-50"
          >
            {labels.filterMediumRisk}
          </Button>
          <Button
            variant={filter === 'high-risk' ? 'default' : 'outline'}
            onClick={() => setFilter('high-risk')}
            size="sm"
            className="border-red-200 text-red-700 hover:bg-red-50"
          >
            {labels.filterHighRisk}
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">{labels.sortBy}:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="border rounded px-3 py-1 text-sm"
          >
            <option value="amount">{labels.sortAmount}</option>
            <option value="interest">{labels.sortInterest}</option>
            <option value="risk">{labels.sortRisk}</option>
            <option value="days">{labels.sortDays}</option>
          </select>
        </div>
      </div>

      {/* Debug Panel - Temporary */}
      {/* Removed debug panel - system is now working correctly */}
      
      {sortedOpportunities.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📊</div>
          <h3 className="text-xl font-semibold mb-2">{labels.noOpportunities}</h3>
          <p className="text-muted-foreground mb-4">Check back later for new opportunities</p>
          
          {/* Sample Data Populator for Development */}
          <div className="max-w-md mx-auto p-4 border border-dashed border-gray-300 rounded-lg bg-gray-50">
            <h4 className="font-medium mb-2">Development Mode</h4>
            <p className="text-sm text-muted-foreground mb-3">
              No opportunities found. Click below to populate with sample data for testing.
            </p>
            <Button 
              onClick={async () => {
                try {
                  const { populateSampleData } = await import('@/lib/sampleData');
                  await populateSampleData();
                  window.location.reload();
                } catch (error) {
                  console.error('Error populating sample data:', error);
                }
              }}
              className="bg-green-600 hover:bg-green-700"
            >
              Load Sample Opportunities
            </Button>
          </div>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedOpportunities.map(opp => (
            <Card key={opp.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg mb-2">{opp.title}</CardTitle>
                    <div className="flex items-center gap-2 mb-2">
                      <Badge className={getRiskColor(opp.risk)}>
                        {getRiskIcon(opp.risk)}
                        {labels.riskLevel}: {opp.risk}
                      </Badge>
                      <Badge className={getStatusColor(opp.status)}>
                        {labels[`status${opp.status.charAt(0).toUpperCase() + opp.status.slice(1)}`]}
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <p className="text-muted-foreground text-sm line-clamp-2">{opp.description}</p>
                
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">{labels.category}:</span>
                    <span className="font-medium">{opp.category}</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">{labels.borrowerRating}:</span>
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <CheckCircle
                          key={i}
                          className={`h-4 w-4 ${i < Math.floor(opp.borrowerRating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                        />
                      ))}
                      <span className="text-sm ml-1">({opp.borrowerRating.toFixed(1)})</span>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">{labels.fundedAmount}:</span>
                    <span className="font-medium">{formatSAR(opp.fundedAmount, language)}</span>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Progress</span>
                      <span className="font-medium">{Math.round((opp.fundedAmount / opp.totalAmount) * 100)}%</span>
                    </div>
                    <Progress value={(opp.fundedAmount / opp.totalAmount) * 100} className="h-2" />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="text-muted-foreground">{labels.interestRate}</div>
                      <div className="font-semibold text-green-600">{opp.interestRate.toFixed(1)}%</div>
                    </div>
                                          <div>
                        <div className="text-muted-foreground">{labels.daysRemaining}</div>
                        <div className="font-semibold text-blue-600">{opp.daysRemaining} {isAr ? 'أيام' : 'days'}</div>
                      </div>
                  </div>
                </div>
                
                <div className="flex gap-2 pt-2">
                  <Button asChild className="flex-1 bg-gold hover:bg-gold/90">
                    <Link to={`/invest/${opp.id}`}>
                      {labels.investNow}
                    </Link>
                  </Button>
                  <Button variant="outline" asChild className="flex-1">
                    <Link to={`/invest/${opp.id}`}>
                      {labels.viewDetails}
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default InvestList;