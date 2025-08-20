import React, { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { collection, getDocs, query, where, orderBy, onSnapshot, getDoc, doc } from "firebase/firestore";
import { db } from "../lib/firebase";
import { formatSAR } from "../lib/currency";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/contexts/LanguageContext";
import { 
  TrendingUp, 
  Users, 
  DollarSign, 
  Calendar, 
  ArrowRight, 
  Plus, 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  Home,
  ArrowLeft,
  Globe,
  Wallet,
  FileText,
  ArrowUpRight,
  ArrowDownRight,
  AlertCircle,
  User
} from "lucide-react";

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, logout, userName, userType, emailVerified, sendVerification, loading } = useAuth();
  const { language, t, setLanguage } = useLanguage();
  const isAr = language === 'ar';

  // Check language consistency on page load
  useEffect(() => {
    const savedLanguage = localStorage.getItem('preferred-language');
    if (savedLanguage && savedLanguage !== language) {
      console.log(`🔄 Dashboard: Language mismatch detected. Fixing...`);
      setLanguage(savedLanguage as 'ar' | 'en');
    }
  }, [language, setLanguage]);

  // Check user's KYC status
  useEffect(() => {
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
    
    checkKYCStatus();
  }, [user]);

  const [investments, setInvestments] = useState<any[]>([]);
  const [loanRequests, setLoanRequests] = useState<any[]>([]);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loadingInvestments, setLoadingInvestments] = useState(true);
  const [loadingLoanRequests, setLoadingLoanRequests] = useState(true);
  const [loadingTransactions, setLoadingTransactions] = useState(true);
  
  // KYC status state
  const [kycStatus, setKycStatus] = useState<string | null>(null);
  const [kycLoading, setKycLoading] = useState(true);

  const fetchInvestments = async () => {
      if (!user) return;
    try {
      setLoadingInvestments(true);
      const q = query(collection(db, "investments"), where("userId", "==", user.uid));
      const querySnapshot = await getDocs(q);
      const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setInvestments(data);
      console.log("Fetched investments:", data);
    } catch (error) {
      console.error('Error fetching investments:', error);
      setInvestments([]);
    } finally {
      setLoadingInvestments(false);
    }
    };

    const fetchLoanRequests = async () => {
      if (!user) return;
    try {
      setLoadingLoanRequests(true);
      const q = query(collection(db, "loanRequests"), where("userId", "==", user.uid));
      const querySnapshot = await getDocs(q);
      const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setLoanRequests(data);
      console.log("Fetched loan requests:", data);
    } catch (error) {
      console.error('Error fetching loan requests:', error);
      setLoanRequests([]);
    } finally {
      setLoadingLoanRequests(false);
    }
  };

  const fetchTransactions = async () => {
    if (!user) return;
    try {
      setLoadingTransactions(true);
      // Try to get transactions from a transactions collection, or create empty array
      try {
        const q = query(collection(db, "transactions"), where("userId", "==", user.uid), orderBy("createdAt", "desc"));
        const querySnapshot = await getDocs(q);
        const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setTransactions(data);
        console.log("Fetched transactions:", data);
      } catch (error) {
        // If transactions collection doesn't exist, set empty array
        setTransactions([]);
        console.log("No transactions collection found, setting empty array");
      }
    } catch (error) {
      console.error('Error fetching transactions:', error);
      setTransactions([]);
    } finally {
      setLoadingTransactions(false);
    }
  };

  // Set up real-time listeners for immediate updates
  useEffect(() => {
    if (!user) return;

    console.log("Setting up real-time listeners for user:", user.uid);

    // Real-time listener for loan requests
    const loanRequestsQuery = query(
      collection(db, "loanRequests"), 
      where("userId", "==", user.uid)
    );
    
    const unsubscribeLoanRequests = onSnapshot(loanRequestsQuery, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      console.log("Real-time loan requests update:", data);
      setLoanRequests(data);
      setLoadingLoanRequests(false);
    }, (error) => {
      console.error("Error in loan requests listener:", error);
      setLoadingLoanRequests(false);
    });

    // Real-time listener for investments
    const investmentsQuery = query(
      collection(db, "investments"), 
      where("userId", "==", user.uid)
    );
    
    const unsubscribeInvestments = onSnapshot(investmentsQuery, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      console.log("Real-time investments update:", data);
      setInvestments(data);
      setLoadingInvestments(false);
    }, (error) => {
      console.error("Error in investments listener:", error);
      setLoadingInvestments(false);
    });

    // Real-time listener for transactions
    try {
      const transactionsQuery = query(
        collection(db, "transactions"), 
        where("userId", "==", user.uid),
        orderBy("createdAt", "desc")
      );
      
      const unsubscribeTransactions = onSnapshot(transactionsQuery, (snapshot) => {
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        console.log("Real-time transactions update:", data);
        setTransactions(data);
        setLoadingTransactions(false);
      }, (error) => {
        console.error("Error in transactions listener:", error);
        setLoadingTransactions(false);
      });

      // Return cleanup function
      return () => {
        unsubscribeLoanRequests();
        unsubscribeInvestments();
        unsubscribeTransactions();
      };
    } catch (error) {
      console.log("Transactions collection not available, skipping listener");
      // Return cleanup function without transactions
      return () => {
        unsubscribeLoanRequests();
        unsubscribeInvestments();
      };
    }
  }, [user]);

  const getCurrentUserBalance = () => {
    // Calculate balance from transactions or return 0
    if (transactions.length === 0) return 0;
    
    let balance = 0;
    transactions.forEach(transaction => {
      if (transaction.type === 'credit' || transaction.type === 'deposit') {
        balance += transaction.amount || 0;
      } else if (transaction.type === 'debit' || transaction.type === 'withdrawal') {
        balance -= transaction.amount || 0;
      }
    });
    
    return balance;
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'approved':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'rejected':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'funded':
        return <DollarSign className="h-4 w-4 text-blue-500" />;
      case 'active':
        return <TrendingUp className="h-4 w-4 text-green-500" />;
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'approved':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'rejected':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'funded':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'active':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Welcome, {userName || user.email}!</h1>
            <p className="text-muted-foreground">
              {userType === 'borrower' ? 'Borrower Dashboard' : userType === 'lender' ? 'Lender Dashboard' : 'Financial Dashboard'}
            </p>
            {userType && (
              <Badge variant="outline" className="mt-2">
                {userType === 'borrower' ? 'مقترض' : 'مقرض'} - {userType === 'borrower' ? 'Borrower' : 'Lender'}
              </Badge>
            )}
          </div>
          <div className="flex gap-4">
            <Button variant="outline" onClick={() => navigate('/')} className="bg-blue-50 hover:bg-blue-100 text-blue-700 border-blue-200">
              <Home className="h-4 w-4 mr-2" />
              Home
            </Button>
            <Button variant="outline" onClick={() => navigate(-1)} className="bg-gray-50 hover:bg-gray-100 text-gray-700 border-gray-200">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <Button 
              variant="outline" 
              onClick={() => navigate('/profile')} 
              className="bg-green-50 hover:bg-green-100 text-green-700 border-green-200"
            >
              <User className="h-4 w-4 mr-2" />
              {isAr ? 'الملف الشخصي' : 'Profile'}
            </Button>
            {userType !== 'borrower' && (
            <Button onClick={() => navigate('/wallet')} className="bg-[hsl(45,85%,55%)] hover:bg-[hsl(42,90%,40%)] text-white">
              <Wallet className="h-4 w-4 mr-2" />
              Wallet
            </Button>
            )}
            {userType === 'borrower' && (
              <Button onClick={() => navigate('/loan-request')} className="bg-green-600 hover:bg-green-700 text-white">
                <FileText className="h-4 w-4 mr-2" />
                Submit New Loan
              </Button>
            )}
            <Button 
              variant="outline" 
              onClick={() => setLanguage(language === 'ar' ? 'en' : 'ar')}
              className="bg-purple-50 hover:bg-purple-100 text-purple-700 border-purple-200"
            >
              <Globe className="h-4 w-4 mr-2" />
              {language === 'ar' ? 'English' : 'العربية'}
            </Button>
          </div>
        </div>

        {/* Email Verification Warning */}
        {!emailVerified && (
          <Card className="mb-6 border-yellow-200 bg-yellow-50">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 text-yellow-800">
                <AlertCircle className="h-4 w-4" />
                <span>Your email is not verified.</span>
                <Button variant="link" onClick={sendVerification} disabled={loading} className="text-[hsl(45,85%,55%)] p-0 h-auto">
                  Resend verification email
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* KYC Status Success Message */}
        {user && kycStatus === 'approved' && (
          <Card className="mb-6 border-green-200 bg-green-50">
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-800" />
                <span className="text-green-800">
                  {isAr 
                    ? '✅ حسابك مفعل ومُوافق عليه! يمكنك الآن استخدام جميع الميزات.'
                    : '✅ Your account is active and approved! You can now use all features.'
                  }
                </span>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Wallet and Transactions Section - Only for Lenders */}
        {userType === 'lender' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Wallet Balance */}
          <Card>
              <CardHeader className="flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Wallet Balance</CardTitle>
              <Wallet className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                {loadingTransactions ? (
                <div className="h-8 bg-gray-200 rounded animate-pulse"></div>
              ) : (
                <div>
                    <div className="text-2xl font-bold">{formatSAR(getCurrentUserBalance(), language)}</div>
                    <p className="text-xs text-muted-foreground">Based on transaction history.</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Total Transactions */}
          <Card>
              <CardHeader className="flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Transactions</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                {loadingTransactions ? (
                <div className="h-8 bg-gray-200 rounded animate-pulse"></div>
              ) : (
                <div>
                    <div className="text-2xl font-bold">{transactions.length}</div>
                    <p className="text-xs text-muted-foreground">Total transactions</p>
                </div>
              )}
            </CardContent>
          </Card>

            {/* Total Investments */}
            <Card>
              <CardHeader className="flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Investments</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                {loadingInvestments ? (
                  <div className="h-8 bg-gray-200 rounded animate-pulse"></div>
                ) : (
                  <div>
                    <div className="text-2xl font-bold">{investments.length}</div>
                    <p className="text-xs text-muted-foreground">Active investments</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {/* Borrower Stats Section */}
        {userType === 'borrower' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* Active Loans */}
            <Card>
              <CardHeader className="flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Loans</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                {loadingLoanRequests ? (
                  <div className="h-8 bg-gray-200 rounded animate-pulse"></div>
                ) : (
                  <div>
                    <div className="text-2xl font-bold">{loanRequests.filter(loan => ['active', 'funded'].includes(loan.status)).length}</div>
                    <p className="text-xs text-muted-foreground">Active loan requests</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Total Loan Requests */}
            <Card>
              <CardHeader className="flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Loan Requests</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                {loadingLoanRequests ? (
                  <div className="h-8 bg-gray-200 rounded animate-pulse"></div>
                ) : (
                  <div>
                    <div className="text-2xl font-bold">{loanRequests.length}</div>
                    <p className="text-xs text-muted-foreground">All loan requests</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {/* General Stats for Unknown User Types */}
        {!userType && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardHeader className="flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Platform Stats</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{loanRequests.length + investments.length}</div>
                <p className="text-xs text-muted-foreground">Total activities</p>
              </CardContent>
            </Card>
          </div>
          )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Transactions - Only for Lenders */}
          {userType === 'lender' && (
          <Card>
            <CardHeader>
              <CardTitle>Recent Transactions</CardTitle>
            </CardHeader>
            <CardContent>
                {loadingTransactions ? (
                <div className="space-y-3">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="h-16 bg-gray-200 rounded animate-pulse"></div>
                  ))}
                </div>
                ) : transactions.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No transactions yet. Try the wallet to make your first transfer!
                </div>
              ) : (
                <div className="space-y-3">
                    {transactions.slice(0, 5).map((transaction: any) => (
                    <div key={transaction.id} className="flex items-center justify-between p-3 border rounded">
                      <div className="flex items-center gap-3">
                          {transaction.type === 'credit' || transaction.type === 'deposit' ? (
                            <ArrowUpRight className="h-4 w-4 text-green-500" />
                        ) : (
                            <ArrowDownRight className="h-4 w-4 text-red-500" />
                        )}
                        <div>
                          <div className="font-medium">
                              {transaction.type === 'credit' || transaction.type === 'deposit' 
                              ? `To ${transaction.recipientName}` 
                              : `From ${transaction.senderName}`}
                          </div>
                          <div className="text-sm text-muted-foreground">
                              {new Date(transaction.createdAt).toLocaleDateString()}
                            </div>
                        </div>
                      </div>
                      <div className="text-right">
                          <div className={`font-medium ${transaction.type === 'debit' || transaction.type === 'withdrawal' ? 'text-red-600' : 'text-green-600'}`}>
                            {transaction.type === 'debit' || transaction.type === 'withdrawal' ? '-' : '+'}{formatSAR(transaction.amount, language)}
                        </div>
                        <Badge variant={transaction.status === 'completed' ? 'default' : 'destructive'}>
                          {transaction.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                    {transactions.length > 5 && (
                    <Button variant="outline" className="w-full" onClick={() => navigate('/transactions')}>
                      View All Transactions
                    </Button>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
          )}

          {/* Borrower Notice - When Transactions are Hidden */}
          {userType === 'borrower' && (
            <Card>
              <CardHeader>
                <CardTitle>Borrower Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-muted-foreground">
                  <div className="text-4xl mb-2">📋</div>
                  <p className="mb-2">Transactions are only available for lenders</p>
                  <p className="text-xs">Focus on managing your loan requests</p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* User Type Specific Content */}
          {userType === 'borrower' ? (
            <Card>
              <CardHeader>
                <CardTitle>Your Loan Requests</CardTitle>
                {/* Loan Status Summary */}
                {loanRequests.length > 0 && (
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <span>Total Requests:</span>
                      <Badge variant="outline">{loanRequests.length}</Badge>
                    </div>
                    {loanRequests.some(loan => loan.status === 'rejected') && (
                      <div className="flex items-center gap-2 text-red-600">
                        <AlertCircle className="h-3 w-3" />
                        <span>Some loans were rejected</span>
                      </div>
                    )}
                    {loanRequests.some(loan => loan.status === 'completed') && (
                      <div className="flex items-center gap-2 text-green-600">
                        <CheckCircle className="h-3 w-3" />
                        <span>Some loans completed</span>
                      </div>
                    )}
                  </div>
                )}
              </CardHeader>
              <CardContent>
                {loadingLoanRequests ? (
                  <div className="space-y-3">
                    {[1, 2, 3].map(i => (
                      <div key={i} className="h-16 bg-gray-200 rounded animate-pulse"></div>
                    ))}
                  </div>
                ) : loanRequests.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <div className="mb-4">No loan requests yet.</div>
                    <Button onClick={() => navigate('/loan-request')} className="bg-[hsl(45,85%,55%)] hover:bg-[hsl(42,90%,40%)] text-white">
                      <FileText className="h-4 w-4 mr-2" />
                      Create Loan Request
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {loanRequests.slice(0, 5).map((loan: any) => (
                      <div key={loan.id} className="border p-3 rounded">
                        <div className="flex items-center justify-between mb-2">
                          <div className="font-medium">{formatSAR(loan.amount, language)}</div>
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
                        
                        {/* Special handling for rejected loans */}
                        {loan.status === 'rejected' && (
                          <div className="mt-3 pt-3 border-t border-gray-100">
                            <div className="flex items-center justify-between">
                              <div className="text-xs text-red-600">
                                <AlertCircle className="h-3 w-3 inline mr-1" />
                                Loan was rejected. You can submit a new request.
                              </div>
                              <Button 
                                size="sm" 
                                onClick={() => navigate('/loan-request')}
                                className="bg-red-50 hover:bg-red-100 text-red-700 border-red-200"
                              >
                                Try Again
                              </Button>
                            </div>
                          </div>
                        )}
                        
                        {/* Special handling for completed loans */}
                        {loan.status === 'completed' && (
                          <div className="mt-3 pt-3 border-t border-gray-100">
                            <div className="flex items-center justify-between">
                              <div className="text-xs text-green-600">
                                <CheckCircle className="h-3 w-3 inline mr-1" />
                                Loan completed successfully!
                              </div>
                              <Button 
                                size="sm" 
                                onClick={() => navigate('/loan-request')}
                                className="bg-green-50 hover:bg-green-100 text-green-700 border-green-200"
                              >
                                New Loan
                              </Button>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                    {loanRequests.length > 5 && (
                      <Button variant="outline" className="w-full" onClick={() => navigate('/loan-request')}>
                        View All Loan Requests
                      </Button>
                    )}
                    
                    {/* Submit New Loan Request Button - Always visible for borrowers */}
                    <div className="pt-4 border-t">
                      <Button 
                        onClick={() => navigate('/loan-request')} 
                        className="w-full bg-[hsl(45,85%,55%)] hover:bg-[hsl(42,90%,40%)] text-white"
                      >
                        <FileText className="h-4 w-4 mr-2" />
                        Submit New Loan Request
                      </Button>
                      <p className="text-xs text-muted-foreground text-center mt-2">
                        You can submit a new request even if your previous loans were rejected or completed
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ) : userType === 'lender' ? (
            <Card>
              <CardHeader>
                <CardTitle>Your Investments</CardTitle>
              </CardHeader>
              <CardContent>
                {loadingInvestments ? (
                  <div className="space-y-3">
                    {[1, 2, 3].map(i => (
                      <div key={i} className="h-16 bg-gray-200 rounded animate-pulse"></div>
                    ))}
                  </div>
                ) : investments.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <div className="mb-4">No investments yet.</div>
                    <Button onClick={() => navigate('/invest')} className="bg-[hsl(45,85%,55%)] hover:bg-[hsl(42,90%,40%)] text-white">
                      Explore Investment Opportunities
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {investments.map(inv => (
                      <div key={inv.id} className="border p-3 rounded">
                        <div className="font-medium">Opportunity: {inv.opportunityId}</div>
                        <div className="text-sm text-muted-foreground">Amount: {formatSAR(inv.amount, language)}</div>
                        <div className="text-sm text-muted-foreground">
                          Date: {inv.investedAt?.toDate?.().toLocaleString?.() || inv.investedAt}
                        </div>
                      </div>
                    ))}
                    <Button variant="outline" className="w-full" onClick={() => navigate('/invest')}>
                      View All Investments
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Platform Statistics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{loanRequests.length + investments.length}</div>
                <p className="text-xs text-muted-foreground">Total activities</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;