import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { doc, getDoc, addDoc, collection, updateDoc } from "firebase/firestore";
import { db } from "../lib/firebase";
import { useAuth } from "../contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { Home, ArrowLeft, Globe, AlertCircle, AlertTriangle, CheckCircle } from "lucide-react";
import { formatSAR } from "../lib/currency";

const InvestDetail = () => {
  const { id } = useParams();
  const [opportunity, setOpportunity] = useState<any>(null);
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const { user, userType } = useAuth();
  const navigate = useNavigate();
  const { language, t, setLanguage } = useLanguage();
  const isAr = language === 'ar';
  
  // Check if user is trying to invest in their own loan
  const [isOwnLoan, setIsOwnLoan] = useState(false);
  
  // KYC status state
  const [kycStatus, setKycStatus] = useState<string | null>(null);
  const [kycLoading, setKycLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;
      try {
        // First try to fetch from loanRequests collection
        const loanDoc = await getDoc(doc(db, "loanRequests", id));
        if (loanDoc.exists()) {
          const data = loanDoc.data();
          // Check if user is trying to invest in their own loan
          if (data.userId === user?.uid) {
            setIsOwnLoan(true);
          }
          
          // Transform loan request data to match opportunity format
          const opportunity = {
            id: loanDoc.id,
            title: `${data.amount} SAR - ${data.repaymentPeriod} months`,
            description: data.purpose || "Personal loan request",
            amount: data.amount,
            interestRate: 3 + Math.random() * 5, // Random expected return between 3-8%
            term: `${data.repaymentPeriod} months`,
            risk: data.riskLevel || 'medium',
            borrowerName: data.name || "Anonymous",
            borrowerRating: data.borrowerRating || 4.0,
            category: getCategory(data.purpose),
            purpose: data.purpose || "Personal use"
          };
          setOpportunity(opportunity);
        } else {
          // Fallback to opportunities collection if it exists
          const oppDoc = await getDoc(doc(db, "opportunities", id));
          if (oppDoc.exists()) {
            setOpportunity({ id: oppDoc.id, ...oppDoc.data() });
          }
        }
      } catch (error) {
        console.error("Error fetching opportunity:", error);
      } finally {
        setLoading(false);
      }
    };
    
    const checkKYCStatus = async () => {
      if (!user) return;
      
      try {
        setKycLoading(true);
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setKycStatus(userData.kycStatus || 'approved');
        } else {
          setKycStatus('approved');
        }
      } catch (error) {
        console.error('Error checking KYC status:', error);
        setKycStatus('approved');
      } finally {
        setKycLoading(false);
      }
    };
    
    fetchData();
    checkKYCStatus();
  }, [id, user]);

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

  const handleInvest = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    // Double-check restrictions
    if (!user) {
      setError("You must be logged in to invest.");
      return;
    }
    
    if (isOwnLoan) {
      setError("You cannot invest in your own loan.");
      return;
    }
    
    // KYC status is now auto-approved, so no blocking needed
    
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      setError("Enter a valid amount.");
      return;
    }
    
    const investmentAmount = Number(amount);
    
    try {
      // First, add the investment record
      const investmentRef = await addDoc(collection(db, "investments"), {
        userId: user.uid,
        loanRequestId: id,
        amount: investmentAmount,
        investedAt: new Date(),
        status: 'active',
        expectedReturn: investmentAmount * (1 + (opportunity.interestRate / 100)),
        repaymentDate: new Date(Date.now() + (opportunity.term.includes('12') ? 365 : opportunity.term.includes('6') ? 180 : 90) * 24 * 60 * 60 * 1000)
      });
      
      console.log("✅ Investment record created:", investmentRef.id);
      
      // Now update the loan request to reflect the new funded amount
      const loanRef = doc(db, "loanRequests", id);
      const loanDoc = await getDoc(loanRef);
      
      if (loanDoc.exists()) {
        const currentLoanData = loanDoc.data();
        const currentFundedAmount = currentLoanData.fundedAmount || 0;
        const newFundedAmount = currentFundedAmount + investmentAmount;
        
        // Update the loan with new funded amount
        await updateDoc(loanRef, {
          fundedAmount: newFundedAmount,
          updatedAt: new Date(),
          lastInvestmentAt: new Date(),
          lastInvestmentAmount: investmentAmount,
          lastInvestorId: user.uid
        });
        
        console.log(`✅ Loan funded amount updated: ${currentFundedAmount} → ${newFundedAmount}`);
        
        // Check if loan is now fully funded
        if (newFundedAmount >= currentLoanData.amount) {
          await updateDoc(loanRef, {
            status: 'funded',
            fundedAt: new Date()
          });
          console.log("🎉 Loan is now fully funded!");
        }
      }
      
      setSuccess(true);
      alert(`Investment successful! You invested ${investmentAmount} SAR. The loan progress has been updated.`);
      setTimeout(() => navigate("/dashboard"), 2000);
      
    } catch (err: any) {
      console.error("❌ Investment failed:", err);
      setError("Failed to invest. Try again.");
    }
  };

  if (loading) return <div className="p-8 text-center">Loading...</div>;
  if (!opportunity) return <div className="p-8 text-center">Opportunity not found.</div>;

  // Own loan restriction check
  if (isOwnLoan) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-xl">
        {/* Navigation Header */}
        <div className="flex gap-4 mb-6">
          <Button variant="outline" onClick={() => navigate('/')} className="bg-blue-50 hover:bg-blue-100 text-blue-700 border-blue-200">
            <Home className="h-4 w-4 mr-2" />
            Home
          </Button>
          <Button variant="outline" onClick={() => navigate(-1)} className="bg-gray-50 hover:bg-gray-100 text-gray-700 border-gray-200">
            <ArrowLeft className="h-4 w-4 mr-2" />
            {isAr ? 'رجوع' : 'Back'}
          </Button>
          <Button 
            variant="outline" 
            onClick={() => setLanguage(language === 'ar' ? 'en' : 'ar')}
            className="bg-purple-50 hover:bg-purple-100 text-purple-700 border-purple-200"
          >
            <Globe className="h-4 w-4 mr-2" />
            {language === 'ar' ? 'English' : 'العربية'}
          </Button>
        </div>

        <div className="text-center py-12">
          <div className="text-6xl mb-4">⚠️</div>
          <h1 className="text-3xl font-bold mb-4 text-orange-600">
            {isAr ? 'لا يمكنك الاستثمار في قرضك الخاص' : 'Cannot Invest in Your Own Loan'}
          </h1>
          <p className="text-lg text-muted-foreground mb-6">
            {isAr 
              ? 'لا يمكنك الاستثمار في القرض الذي أنشأته. هذا لمنع تضارب المصالح.'
              : 'You cannot invest in the loan you created. This prevents conflicts of interest.'
            }
          </p>
          <div className="space-y-3">
            <Button 
              onClick={() => navigate('/invest')} 
              className="bg-green-600 hover:bg-green-700 text-white w-full"
            >
              {isAr ? 'استكشف فرص استثمار أخرى' : 'Explore Other Opportunities'}
            </Button>
            <Button 
              onClick={() => navigate('/dashboard')} 
              variant="outline"
              className="w-full"
            >
              {isAr ? 'العودة إلى لوحة التحكم' : 'Back to Dashboard'}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-xl">
      {/* Navigation Header */}
      <div className="flex gap-4 mb-6">
        <Button variant="outline" onClick={() => navigate('/')} className="bg-blue-50 hover:bg-blue-100 text-blue-700 border-blue-200">
          <Home className="h-4 w-4 mr-2" />
          Home
        </Button>
        <Button variant="outline" onClick={() => navigate(-1)} className="bg-gray-50 hover:bg-gray-100 text-gray-700 border-gray-200">
          <ArrowLeft className="h-4 w-4 mr-2" />
          {isAr ? 'رجوع' : 'Back'}
        </Button>
        <Button 
          variant="outline" 
          onClick={() => setLanguage(language === 'ar' ? 'en' : 'ar')}
          className="bg-purple-50 hover:bg-purple-100 text-purple-700 border-purple-200"
        >
          <Globe className="h-4 w-4 mr-2" />
          {language === 'ar' ? 'English' : 'العربية'}
        </Button>
      </div>

      <h1 className="text-3xl font-bold mb-4">{opportunity.title}</h1>
      <p className="mb-2">{opportunity.description}</p>
      
      {/* Borrower Information Notice */}
      {user && userType === 'borrower' && (
        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center gap-2 text-blue-800">
            <AlertCircle className="h-4 w-4" />
            <span className="text-sm font-medium">
              {isAr ? 'تنبيه للمقترضين' : 'Borrower Notice'}
            </span>
          </div>
          <p className="text-blue-700 text-xs mt-1">
            {isAr 
              ? 'يمكنك الاستثمار في هذا القرض إذا لم يكن قرضك الخاص.'
              : 'You can invest in this loan if it\'s not your own loan.'
            }
          </p>
        </div>
      )}
      
      {/* KYC Status Success */}
      {user && kycStatus === 'approved' && (
        <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center gap-2 text-green-800">
            <CheckCircle className="h-4 w-4" />
            <span className="text-sm font-medium">
              {isAr ? 'حسابك مفعل' : 'Account Verified'}
            </span>
          </div>
          <p className="text-green-700 text-xs mt-1">
            {isAr 
              ? '✅ حسابك مفعل ومُوافق عليه! يمكنك الآن الاستثمار.'
              : '✅ Your account is verified and approved! You can now invest.'
            }
          </p>
        </div>
      )}
      
      <div className="mb-2">Amount: {formatSAR(opportunity.amount, language)}</div>
              <div className="mb-2">Expected Return: {opportunity.interestRate}%</div>
      <div className="mb-2">Term: {opportunity.term}</div>
      <div className="mb-2">Risk: {opportunity.risk}</div>
      <form onSubmit={handleInvest} className="mt-6 space-y-4">
        {kycStatus === 'approved' ? (
          <>
            <input
              type="number"
              min="1"
              max={opportunity.amount}
              value={amount}
              onChange={e => setAmount(e.target.value)}
              className="w-full p-2 border rounded"
              placeholder="Amount to invest"
              required
            />
            {error && <div className="text-red-500 text-sm">{error}</div>}
            {success && <div className="text-green-600 text-sm">Investment successful! Redirecting...</div>}
            <button type="submit" className="w-full bg-gold text-white p-2 rounded">Invest</button>
          </>
        ) : (
          <div className="text-center py-8">
            <div className="text-4xl mb-4">⏳</div>
            <h3 className="text-lg font-semibold mb-2 text-yellow-600">
              {isAr ? 'جاري تفعيل حسابك' : 'Activating Your Account'}
            </h3>
            <p className="text-muted-foreground mb-4">
              {isAr 
                ? 'سيتم تفعيل حسابك قريباً. يرجى المحاولة مرة أخرى في بضع دقائق.'
                : 'Your account will be activated shortly. Please try again in a few minutes.'
              }
            </p>
          </div>
        )}
      </form>
    </div>
  );
};

export default InvestDetail;