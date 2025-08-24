import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { formatSAR } from "@/lib/currency";
import { calculateLoanDetails } from "@/lib/calculations";
import { Coins, Calendar, FileText, Church, CheckCircle, Send, Sparkles, Users, TrendingUp, Wallet, AlertCircle, Clock, CheckCircle2, XCircle, Info, Home, ArrowLeft, Globe, LogIn, UserPlus } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect } from "react";
import { doc, setDoc, collection, addDoc, serverTimestamp, query, where, getDocs, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function LoanRequest() {
  const navigate = useNavigate();
  const { language, t, setLanguage } = useLanguage();
  const { user, userType } = useAuth();
  const isAr = language === 'ar';

  // Check language consistency on page load
  useEffect(() => {
    const savedLanguage = localStorage.getItem('preferred-language');
    if (savedLanguage && savedLanguage !== language) {
      console.log(`🔄 LoanRequest: Language mismatch detected. Fixing...`);
      setLanguage(savedLanguage as 'ar' | 'en');
    }
  }, [language, setLanguage]);
  
  const [loanAmount, setLoanAmount] = useState(2500);
  const [repaymentPeriod, setRepaymentPeriod] = useState(6);
  const [purpose, setPurpose] = useState("");
  const [showMatching, setShowMatching] = useState(false);
  const [submittedLoanId, setSubmittedLoanId] = useState<string | null>(null);
  const [matchingResults, setMatchingResults] = useState<any[]>([]);
  const [loanStatus, setLoanStatus] = useState<'draft' | 'pending' | 'approved' | 'rejected' | 'funded' | 'active' | 'completed'>('draft');
  
  // KYC status state
  const [kycStatus, setKycStatus] = useState<string | null>(null);
  const [kycLoading, setKycLoading] = useState(true);
  
  // Define the loan request type
  interface LoanRequest {
    id: string;
    userId: string;
    userType: string;
    name: string;
    amount: number;
    repaymentPeriod: number;
    purpose: string;
    status: string;
    submittedAt: any;
    createdAt: any;
    updatedAt: any;
    interestRate: number;
    monthlyPayment: number;
    totalRepayment: number;
    daysRemaining: number;
    mockUserId: string;
  }
  
  const [loanRequests, setLoanRequests] = useState<LoanRequest[]>([]);
  
  // Real Firebase data state
  const [loadingData, setLoadingData] = useState(false);

  const { toast } = useToast();

  // Check user's KYC status
  useEffect(() => {
    const checkKYCStatus = async () => {
      if (!user) {
        setKycLoading(false);
        return;
      }
      
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
    
    checkKYCStatus();
  }, [user]);

  // Load user's existing loan requests only if authenticated
  useEffect(() => {
    if (user) {
      loadUserLoanRequests();
    }
  }, [user]);

  // Remove mock user mapping - no longer needed
  // const getMockUserId = (firebaseUser: any) => { ... };
  // const currentMockUserId = user ? getMockUserId(user) : null;

  const loanDetails = calculateLoanDetails(loanAmount, repaymentPeriod);

  // Load user's existing loan requests
  const loadUserLoanRequests = async () => {
    if (!user) return;
    
    try {
      setLoadingData(true);
      const q = query(
        collection(db, "loanRequests"),
        where("userId", "==", user.uid)
      );
      const querySnapshot = await getDocs(q);
      const loans = querySnapshot.docs.map(doc => ({ 
        id: doc.id, 
        ...doc.data() 
      } as LoanRequest));
      setLoanRequests(loans);
    } catch (error) {
      console.error('Error loading loan requests:', error);
      toast({
        title: "Error",
        description: "Failed to load your loan requests.",
        variant: "destructive",
      });
    } finally {
      setLoadingData(false);
    }
  };

  // Find potential matches for a loan
  const findMatches = async (loanId: string) => {
    try {
      // For now, we'll just show a message that matching is not implemented yet
      toast({
        title: "Matching Feature",
        description: "Loan matching feature is coming soon!",
      });
    } catch (error) {
      console.error('Error finding matches:', error);
    }
  };

  const handleSelectMatch = async (match: any) => {
    try {
      // For now, we'll just show a message that matching is not implemented yet
      toast({
        title: "Matching Feature",
        description: "Loan matching feature is coming soon!",
      });
    } catch (error) {
      console.error('Error selecting match:', error);
    }
  };

  // Translation keys
  const labels = {
    title: isAr ? "طلب قرض فوري" : "Instant Loan Request",
    subtitle: isAr ? "احصل على تمويل من 500 إلى 5,000 ريال خلال دقائق" : "Get funding from SAR 500 to 5,000 in minutes",
    amount: isAr ? "مبلغ القرض المطلوب" : "Requested Loan Amount",
    minAmount: isAr ? "500 ريال" : "SAR 500",
    maxAmount: isAr ? "5,000 ريال" : "SAR 5,000",
    repayment: isAr ? "فترة السداد" : "Repayment Period",
    months: isAr ? "أشهر" : "months",
    month: isAr ? "شهر" : "month",
    purpose: isAr ? "الغرض من القرض (اختياري)" : "Purpose of the loan (optional)",
    purposePlaceholder: isAr ? "مثال: تمويل مشروع صغير، تسديد التزامات، تحسين المنزل..." : "E.g.: Small business, debt consolidation, home improvement...",
    summary: isAr ? "ملخص القرض" : "Loan Summary",
    principal: isAr ? "المبلغ الأساسي" : "Principal Amount",
    platformFee: isAr ? "رسوم المنصة (2.5%)" : "Platform Fee (2.5%)",
    investorReturn: isAr ? "الربح المتوقع للمستثمرين" : "Expected Investor Return",
    totalRepayment: isAr ? "إجمالي المبلغ المسدد" : "Total Repayment",
    monthlyPayment: isAr ? "القسط الشهري المتوقع" : "Expected Monthly Payment",
    shariah: isAr ? "متوافق مع أحكام الشريعة الإسلامية" : "Shariah Compliant",
    shariahDesc: isAr ? "تم مراجعة هذا المنتج والموافقة عليه من قبل الهيئة الشرعية" : "This product has been reviewed and approved by the Shariah board.",
    submit: isAr ? "إرسال طلب القرض" : "Submit Loan Request",
    submitting: isAr ? "جاري الإرسال..." : "Submitting...",
    review: isAr ? "سيتم مراجعة طلبك خلال 24 ساعة" : "Your request will be reviewed within 24 hours",
    successTitle: isAr ? "تم إرسال طلب القرض بنجاح" : "Loan request sent successfully",
    successDesc: isAr ? "جاري البحث عن مقرضين مناسبين بالذكاء الاصطناعي..." : "Searching for suitable lenders using AI...",
    errorTitle: isAr ? "خطأ في إرسال الطلب" : "Error submitting request",
    errorDesc: isAr ? "يرجى المحاولة مرة أخرى" : "Please try again",
    aiSuccessTitle: isAr ? "تم العثور على مقرضين مناسبين!" : "Suitable lenders found!",
    aiSuccessDesc: (n: number) => isAr ? `وجدنا ${n} مقرض مناسب لطلبك` : `Found ${n} suitable lenders for your request`,
    aiErrorTitle: isAr ? "خطأ في البحث عن المقرضين" : "Error finding lenders",
    aiErrorDesc: isAr ? "سنحاول البحث مرة أخرى لاحقاً" : "We'll try searching again later",
    lenderSelectedTitle: isAr ? "تم اختيار المقرض" : "Lender selected",
    lenderSelectedDesc: isAr ? "سيتم التواصل معك قريباً لإكمال الإجراءات" : "You will be contacted soon to complete the process",
    // New labels for enhanced features
    loanStatus: isAr ? "حالة القرض" : "Loan Status",
    activeLoans: isAr ? "القروض النشطة" : "Active Loans",
    noActiveLoans: isAr ? "لا توجد قروض نشطة" : "No active loans",
    createNewLoan: isAr ? "إنشاء قرض جديد" : "Create New Loan",
    statusPending: isAr ? "قيد المراجعة" : "Under Review",
    statusApproved: isAr ? "تمت الموافقة" : "Approved",
    statusRejected: isAr ? "مرفوض" : "Rejected",
    statusFunded: isAr ? "تم التمويل" : "Funded",
    statusActive: isAr ? "نشط" : "Active",
    statusCompleted: isAr ? "مكتمل" : "Completed",
    nextPayment: isAr ? "القسط التالي" : "Next Payment",
    daysRemaining: isAr ? "الأيام المتبقية" : "Days Remaining",
    outstandingBalance: isAr ? "الرصيد المتبقي" : "Outstanding Balance",
    viewDetails: isAr ? "عرض التفاصيل" : "View Details",
    notifications: isAr ? "الإشعارات" : "Notifications",
    noNotifications: isAr ? "لا توجد إشعارات" : "No notifications",
    submitted: isAr ? "تم الإرسال في" : "Submitted on",
    // Guest mode labels
    guestTitle: isAr ? "عرض طلب القرض" : "View Loan Request",
    guestSubtitle: isAr ? "يمكنك استكشاف خيارات القروض المتاحة" : "Explore available loan options",
    loginToSubmit: isAr ? "تسجيل الدخول لإرسال الطلب" : "Login to submit request",
    signupToSubmit: isAr ? "إنشاء حساب لإرسال الطلب" : "Sign up to submit request",
    loginRequired: isAr ? "تسجيل الدخول مطلوب" : "Login Required",
    loginRequiredDesc: isAr ? "يجب تسجيل الدخول لإنشاء طلب قرض" : "You must be logged in to create a loan request",
    signupRequired: isAr ? "إنشاء حساب مطلوب" : "Account Required",
    signupRequiredDesc: isAr ? "يجب إنشاء حساب للوصول إلى خدمات القروض" : "You must create an account to access loan services"
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to submit a loan request.",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoadingData(true);
      
      // Create loan request in Firestore
      const loanRequest = {
        userId: user.uid,
        userType: userType || 'borrower',
        name: user.displayName || user.email || 'Anonymous',
        amount: loanAmount,
        repaymentPeriod,
        purpose,
        status: 'pending',
        submittedAt: serverTimestamp(),
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        interestRate: 10, // 10% annual reward rate
        monthlyPayment: loanDetails.monthlyPayment,
        totalRepayment: loanDetails.totalRepayment,
        daysRemaining: repaymentPeriod * 30
      };
      
      const docRef = await addDoc(collection(db, "loanRequests"), loanRequest);
      
      setSubmittedLoanId(docRef.id);
      setLoanStatus('pending');
      
      toast({
        title: labels.successTitle,
        description: labels.successDesc,
      });
      
      // Reload loan requests
      await loadUserLoanRequests();
      
    } catch (error) {
      console.error('Error submitting loan request:', error);
      toast({
        title: labels.errorTitle,
        description: labels.errorDesc,
        variant: "destructive",
      });
    } finally {
      setLoadingData(false);
    }
  };

  const repaymentOptions = [3, 6, 9, 12];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'approved': return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case 'rejected': return <XCircle className="h-4 w-4 text-red-500" />;
      case 'funded': return <Wallet className="h-4 w-4 text-blue-500" />;
      case 'active': return <TrendingUp className="h-4 w-4 text-green-500" />;
      case 'completed': return <CheckCircle className="h-4 w-4 text-green-500" />;
      default: return <Info className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'approved': return 'bg-green-100 text-green-800 border-green-200';
      case 'rejected': return 'bg-red-100 text-red-800 border-red-200';
      case 'funded': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'active': return 'bg-green-100 text-green-800 border-green-200';
      case 'completed': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  // Check if user can submit loan (authenticated and verified)
  const canSubmitLoan = user && (kycStatus === 'approved' || kycStatus === 'verified');
  
  // Debug logging
  console.log('🔍 LoanRequest Debug:', {
    user: !!user,
    userEmail: user?.email,
    kycStatus,
    canSubmitLoan,
    loadingData
  });

  return (
    <div className="min-h-screen bg-[var(--garshain-cream)] py-8">
      <div className="container mx-auto px-4">
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
            <Button variant="outline" onClick={() => setLanguage(language === 'ar' ? 'en' : 'ar')} className="bg-gray-50 hover:bg-gray-100 text-gray-700 border-gray-200">
              <Globe className="h-4 w-4 mr-2" />
              {language === 'ar' ? 'English' : 'العربية'}
            </Button>
          </div>
        </div>

        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-[var(--garshain-text)] mb-4">
            {user ? labels.title : labels.guestTitle}
          </h1>
          <p className="text-lg text-[var(--garshain-text)] opacity-70">
            {user ? labels.subtitle : labels.guestSubtitle}
          </p>
        </div>

        {/* Active Loans Section - Only show if user is authenticated */}
        {user && loanRequests.length > 0 && (
          <div className="max-w-4xl mx-auto mb-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  {labels.activeLoans}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {loanRequests.map((loan) => (
                    <div key={loan.id} className="border p-3 rounded">
                      <div className="flex items-center justify-between mb-2">
                        <div className="font-medium">{formatSAR(loan.amount)}</div>
                        <Badge className={`${getStatusColor(loan.status)}`}>
                          {getStatusIcon(loan.status)}
                          <span className="ml-1">{loan.status}</span>
                        </Badge>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        <div className="flex items-center gap-2 mb-1">
                          <Calendar className="h-3 w-3" />
                          {loan.repaymentPeriod} months
                        </div>
                        {loan.purpose && (
                          <div className="text-xs">{loan.purpose}</div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* New Loan Request Form */}
        <div className="max-w-4xl mx-auto">
          <Card className="p-8 border border-[var(--garshain-gold)] border-opacity-20">
            <CardHeader>
              <CardTitle className="text-center text-xl">
                {user 
                  ? (loanRequests.length > 0 ? labels.createNewLoan : labels.title)
                  : labels.guestTitle
                }
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {/* Guest Mode - Show interactive form but disable submit */}
              {!user ? (
                <div className="space-y-8">
                  {/* Loan Amount Selection */}
                  <div>
                    <Label className="block text-lg font-medium text-[var(--garshain-text)] mb-4">
                      <Coins className="inline ml-2 h-5 w-5 text-[var(--garshain-gold)]" />
                      {labels.amount}
                    </Label>
                    <div className="relative">
                      <input
                        type="range"
                        min="500"
                        max="5000"
                        step="100"
                        value={loanAmount}
                        onChange={(e) => setLoanAmount(parseInt(e.target.value))}
                        className="loan-slider w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                      />
                      <div className="flex justify-between text-sm text-[var(--garshain-text)] opacity-70 mt-2">
                        <span>{labels.minAmount}</span>
                        <span>{labels.maxAmount}</span>
                      </div>
                    </div>
                    <div className="text-center mt-4">
                      <span className="text-3xl font-bold text-[var(--garshain-gold)]">{formatSAR(loanAmount)}</span>
                    </div>
                  </div>

                  {/* Repayment Period */}
                  <div>
                    <Label className="block text-lg font-medium text-[var(--garshain-text)] mb-4">
                      <Calendar className="inline ml-2 h-5 w-5 text-[hsl(45,85%,55%)]" />
                      {labels.repayment}
                    </Label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {repaymentOptions.map((months) => (
                        <Button
                          key={months}
                          type="button"
                          variant="outline"
                          className={`p-4 h-auto flex flex-col transition-all duration-200 ${
                            repaymentPeriod === months
                              ? "bg-[hsl(45,85%,55%)] text-white border-[hsl(45,85%,55%)] shadow-lg scale-105"
                              : "border-gray-300 text-gray-700 hover:border-[hsl(45,85%,55%)] hover:bg-[hsl(45,85%,55%)] hover:text-white hover:shadow-md"
                          }`}
                          onClick={() => setRepaymentPeriod(months)}
                        >
                          <div className="font-bold text-lg">{months}</div>
                          <div className="text-sm">{months === 1 ? labels.month : labels.months}</div>
                        </Button>
                      ))}
                    </div>
                  </div>

                  {/* Loan Purpose */}
                  <div>
                    <Label htmlFor="purpose" className="block text-lg font-medium text-[var(--garshain-text)] mb-4">
                      <FileText className="inline ml-2 h-5 w-5 text-[hsl(45,85%,55%)]" />
                      {labels.purpose}
                    </Label>
                    <Textarea
                      id="purpose"
                      value={purpose}
                      onChange={(e) => setPurpose(e.target.value)}
                      placeholder={labels.purposePlaceholder}
                      className="min-h-[100px]"
                    />
                  </div>

                  {/* Loan Summary */}
                  <Card className="border border-[hsl(45,85%,55%)] border-opacity-30">
                    <CardHeader>
                      <CardTitle className="text-xl text-[var(--garshain-text)]">{labels.summary}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex justify-between">
                        <span>{labels.principal}</span>
                        <span className="font-bold">{formatSAR(loanAmount)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>{labels.platformFee}</span>
                        <span className="font-bold">{formatSAR(loanDetails.platformFee)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>{labels.investorReturn}</span>
                        <span className="font-bold">{formatSAR(loanDetails.investorReturn)}</span>
                      </div>
                      <div className="border-t border-[hsl(45,85%,55%)] border-opacity-30 pt-3">
                        <div className="flex justify-between text-lg font-bold text-[hsl(45,85%,55%)]">
                          <span>{labels.totalRepayment}</span>
                          <span>{formatSAR(loanDetails.totalRepayment)}</span>
                        </div>
                      </div>
                      <div className="flex justify-between text-sm text-[var(--garshain-text)] opacity-70">
                        <span>{labels.monthlyPayment}</span>
                        <span className="font-bold">{formatSAR(loanDetails.monthlyPayment)}</span>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Shariah Compliance Indicator */}
                  <Card className="bg-[var(--garshain-success)] bg-opacity-10 border border-[var(--garshain-success)] border-opacity-30">
                    <CardContent className="p-4">
                      <div className="flex items-center">
                        <Church className="h-6 w-6 text-[var(--garshain-success)] ml-3" />
                        <div>
                          <h4 className="font-bold text-[var(--garshain-success)]">{labels.shariah}</h4>
                          <p className="text-sm text-[var(--garshain-text)] opacity-70">{labels.shariahDesc}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Login Required Message */}
                  <div className="text-center py-6 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="text-4xl mb-4">🔒</div>
                    <h3 className="text-lg font-semibold mb-2 text-blue-600">
                      {labels.loginRequired}
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      {labels.loginRequiredDesc}
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                      <Button 
                        onClick={() => navigate('/login')} 
                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3"
                      >
                        <LogIn className="h-4 w-4 mr-2" />
                        {labels.loginToSubmit}
                      </Button>
                      <Button 
                        onClick={() => navigate('/signup')} 
                        variant="outline"
                        className="border-blue-600 text-blue-600 hover:bg-blue-50 px-6 py-3"
                      >
                        <UserPlus className="h-4 w-4 mr-2" />
                        {labels.signupToSubmit}
                      </Button>
                    </div>
                  </div>
                </div>
              ) : (
                /* Authenticated User Flow */
                <>
                  {/* KYC Status Check */}
                  {kycLoading ? (
                    <div className="text-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                      <p className="text-muted-foreground">Checking account status...</p>
                    </div>
                  ) : (
                    /* Show loan form for verified users */
                    <form onSubmit={handleSubmit} className="space-y-8">
                      {/* Loan Amount Selection */}
                      <div>
                        <Label className="block text-lg font-medium text-[var(--garshain-text)] mb-4">
                          <Coins className="inline ml-2 h-5 w-5 text-[var(--garshain-gold)]" />
                          {labels.amount}
                        </Label>
                        <div className="relative">
                          <input
                            type="range"
                            min="500"
                            max="5000"
                            step="100"
                            value={loanAmount}
                            onChange={(e) => setLoanAmount(parseInt(e.target.value))}
                            className="loan-slider w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                          />
                          <div className="flex justify-between text-sm text-[var(--garshain-text)] opacity-70 mt-2">
                            <span>{labels.minAmount}</span>
                            <span>{labels.maxAmount}</span>
                          </div>
                        </div>
                        <div className="text-center mt-4">
                          <span className="text-3xl font-bold text-[var(--garshain-gold)]">{formatSAR(loanAmount)}</span>
                        </div>
                      </div>

                      {/* Repayment Period */}
                      <div>
                        <Label className="block text-lg font-medium text-[var(--garshain-text)] mb-4">
                          <Calendar className="inline ml-2 h-5 w-5 text-[hsl(45,85%,55%)]" />
                          {labels.repayment}
                        </Label>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          {repaymentOptions.map((months) => (
                            <Button
                              key={months}
                              type="button"
                              variant="outline"
                              className={`p-4 h-auto flex flex-col transition-all duration-200 ${
                                repaymentPeriod === months
                                  ? "bg-[hsl(45,85%,55%)] text-white border-[hsl(45,85%,55%)] shadow-lg scale-105"
                                  : "border-gray-300 text-gray-700 hover:border-[hsl(45,85%,55%)] hover:bg-[hsl(45,85%,55%)] hover:text-white hover:shadow-md"
                              }`}
                              onClick={() => setRepaymentPeriod(months)}
                            >
                              <div className="font-bold text-lg">{months}</div>
                              <div className="text-sm">{months === 1 ? labels.month : labels.months}</div>
                            </Button>
                          ))}
                        </div>
                      </div>

                      {/* Loan Purpose */}
                      <div>
                        <Label htmlFor="purpose" className="block text-lg font-medium text-[var(--garshain-text)] mb-4">
                          <FileText className="inline ml-2 h-5 w-5 text-[hsl(45,85%,55%)]" />
                          {labels.purpose}
                        </Label>
                        <Textarea
                          id="purpose"
                          value={purpose}
                          onChange={(e) => setPurpose(e.target.value)}
                          placeholder={labels.purposePlaceholder}
                          className="min-h-[100px]"
                        />
                      </div>

                      {/* Loan Summary */}
                      <Card className="border border-[hsl(45,85%,55%)] border-opacity-30">
                        <CardHeader>
                          <CardTitle className="text-xl text-[var(--garshain-text)]">{labels.summary}</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          <div className="flex justify-between">
                            <span>{labels.principal}</span>
                            <span className="font-bold">{formatSAR(loanAmount)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>{labels.platformFee}</span>
                            <span className="font-bold">{formatSAR(loanDetails.platformFee)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>{labels.investorReturn}</span>
                            <span className="font-bold">{formatSAR(loanDetails.investorReturn)}</span>
                          </div>
                          <div className="border-t border-[hsl(45,85%,55%)] border-opacity-30 pt-3">
                            <div className="flex justify-between text-lg font-bold text-[hsl(45,85%,55%)]">
                              <span>{labels.totalRepayment}</span>
                              <span>{formatSAR(loanDetails.totalRepayment)}</span>
                            </div>
                          </div>
                          <div className="flex justify-between text-sm text-[var(--garshain-text)] opacity-70">
                            <span>{labels.monthlyPayment}</span>
                            <span className="font-bold">{formatSAR(loanDetails.monthlyPayment)}</span>
                          </div>
                        </CardContent>
                      </Card>

                      {/* Shariah Compliance Indicator */}
                      <Card className="bg-[var(--garshain-success)] bg-opacity-10 border border-[var(--garshain-success)] border-opacity-30">
                        <CardContent className="p-4">
                          <div className="flex items-center">
                            <Church className="h-6 w-6 text-[var(--garshain-success)] ml-3" />
                            <div>
                              <h4 className="font-bold text-[var(--garshain-success)]">{labels.shariah}</h4>
                              <p className="text-sm text-[var(--garshain-text)] opacity-70">{labels.shariahDesc}</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      {/* Submit Button */}
                      <div className="text-center">
                        <Button
                          type="submit"
                          disabled={loadingData || !canSubmitLoan}
                          className="bg-[hsl(45,85%,55%)] text-white px-12 py-4 rounded-full text-lg font-medium hover:bg-[hsl(42,90%,40%)] shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {loadingData ? (
                            labels.submitting
                          ) : (
                            <>
                              <Send className="ml-2 h-5 w-5" />
                              {labels.submit}
                            </>
                          )}
                        </Button>
                        <p className="text-sm text-[var(--garshain-text)] opacity-70 mt-3">
                          {labels.review}
                        </p>
                      </div>
                    </form>
                  )}
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}