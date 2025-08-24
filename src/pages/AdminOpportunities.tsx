import React, { useState, useEffect } from "react";
import { collection, getDocs, query, orderBy, updateDoc, doc, getDoc, deleteDoc, where } from "firebase/firestore";
import { db } from "../lib/firebase";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, TrendingUp, DollarSign, FileText, CheckCircle, XCircle, User, RefreshCw, AlertCircle, Shield, Clock, Home, Globe } from "lucide-react";
import { useLanguage } from "../contexts/LanguageContext";

const AdminOpportunities = () => {
  const navigate = useNavigate();
  const { language, t, setLanguage } = useLanguage();
  const isAr = language === 'ar';

  // Check language consistency on page load
  useEffect(() => {
    const savedLanguage = localStorage.getItem('preferred-language');
    if (savedLanguage && savedLanguage !== language) {
      console.log(`🔄 AdminOpportunities: Language mismatch detected. Fixing...`);
      setLanguage(savedLanguage as 'ar' | 'en');
    }
  }, [language, setLanguage]);
  
  // Form state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [interestRate, setInterestRate] = useState("");
  const [term, setTerm] = useState("");
  const [risk, setRisk] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Real data state
  const [loanRequests, setLoanRequests] = useState<any[]>([]);
  const [opportunities, setOpportunities] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [investments, setInvestments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [loanLoading, setLoanLoading] = useState(true);
  const [userLoading, setUserLoading] = useState(true);
  const [investmentsLoading, setInvestmentsLoading] = useState(true);

  // Load real loan requests from Firebase
  const loadLoanRequests = async () => {
    try {
      setLoanLoading(true);
      const q = query(
        collection(db, "loanRequests"),
        orderBy("submittedAt", "desc")
      );
      const querySnapshot = await getDocs(q);
      const loans = querySnapshot.docs.map(doc => ({ 
        id: doc.id, 
        ...doc.data() 
      }));
      
      // Sort loans by priority: pending first, then approved, then rejected
      const sortedLoans = loans.sort((a, b) => {
        const statusPriority = {
          'pending': 1,    // Highest priority - needs attention
          'approved': 2,   // Medium priority - already handled
          'rejected': 3,   // Lowest priority - already handled
          'draft': 4       // Lowest priority - not submitted yet
        };
        
        const aData = a as any; // Type assertion for sorting
        const bData = b as any; // Type assertion for sorting
        
        const aPriority = statusPriority[aData.status as keyof typeof statusPriority] || 5;
        const bPriority = statusPriority[bData.status as keyof typeof statusPriority] || 5;
        
        // If same priority, sort by submission date (newest first)
        if (aPriority === bPriority) {
          // Safely convert dates to Date objects
          let aDate: Date;
          let bDate: Date;
          
          try {
            // Handle Firestore Timestamp or regular Date objects
            if (aData.submittedAt?.toDate) {
              aDate = aData.submittedAt.toDate();
            } else if (aData.submittedAt instanceof Date) {
              aDate = aData.submittedAt;
            } else if (typeof aData.submittedAt === 'string') {
              aDate = new Date(aData.submittedAt);
            } else {
              aDate = new Date(0); // Default date if invalid
            }
            
            if (bData.submittedAt?.toDate) {
              bDate = bData.submittedAt.toDate();
            } else if (bData.submittedAt instanceof Date) {
              bDate = bData.submittedAt;
            } else if (typeof bData.submittedAt === 'string') {
              bDate = new Date(bData.submittedAt);
            } else {
              bDate = new Date(0); // Default date if invalid
            }
            
            // Check if dates are valid before calling getTime()
            if (isNaN(aDate.getTime()) || isNaN(bDate.getTime())) {
              return 0; // If dates are invalid, don't change order
            }
            
            return bDate.getTime() - aDate.getTime();
          } catch (error) {
            console.warn('Error sorting by date:', error);
            return 0; // If there's an error, don't change order
          }
        }
        
        return aPriority - bPriority;
      });
      
      setLoanRequests(sortedLoans);

    } catch (error) {
      console.error('Error loading loan requests:', error);
      setLoanRequests([]);
    } finally {
      setLoanLoading(false);
    }
  };

  // Load investments from Firebase
  const loadInvestments = async () => {
    try {
      setInvestmentsLoading(true);
      
      // Try to order by investedAt first, but fall back to creation time if that fails
      let q;
      try {
        q = query(
          collection(db, "investments"),
          orderBy("investedAt", "desc")
        );
      } catch (error) {
        q = query(collection(db, "investments"));
      }
      const querySnapshot = await getDocs(q);
      
      if (querySnapshot.empty) {
        setInvestments([]);
        return;
      }
      
      const investmentsData = querySnapshot.docs.map(doc => ({ 
        id: doc.id, 
        ...(doc.data() as any) 
      }));
      
      // Try to get user details for each investment
      const investmentsWithUserDetails = await Promise.all(
        investmentsData.map(async (investment: any) => {
          try {
            if (investment.userId) {
              const userDoc = await getDoc(doc(db, "users", investment.userId));
              if (userDoc.exists()) {
                const userData = userDoc.data();
                return {
                  ...investment,
                  userName: userData.name || userData.email || 'Anonymous',
                  userEmail: userData.email || 'N/A'
                };
              }
            }
            return investment;
          } catch (error) {
            console.warn('Could not fetch user details for investment:', investment.id);
            return investment;
          }
        })
      );
      
      setInvestments(investmentsWithUserDetails);
    } catch (error) {
      console.error("Error loading investments:", error);
      setInvestments([]);
    } finally {
      setInvestmentsLoading(false);
    }
  };

  // Load real users from Firebase
  const loadUsers = async () => {
    try {
      setUserLoading(true);
      
      // Get all users and order by creation date (newest first)
      const querySnapshot = await getDocs(collection(db, "users"));
      
      const userList = querySnapshot.docs.map(doc => ({ 
        id: doc.id, 
        ...doc.data() 
      })) as any[];
      
      // Auto-approve any pending users to match the new system
      for (const user of userList) {
        if (user.kycStatus === 'pending') {
          try {
            await updateDoc(doc(db, "users", user.id), {
              kycStatus: 'approved',
              verifiedAt: new Date(),
              adminAction: 'auto_approved',
              adminId: 'system',
              adminEmail: 'system@qarshain.com',
              updatedAt: new Date()
            });
            console.log(`✅ Auto-approved user: ${user.name || user.email}`);
            // Update the user object in the list
            user.kycStatus = 'approved';
            user.verifiedAt = new Date();
          } catch (error) {
            console.error(`❌ Failed to auto-approve user ${user.id}:`, error);
          }
        }
      }
      
      // Sort users by KYC status priority and creation date
      const sortedUsers = userList.sort((a, b) => {
        const statusPriority = {
          'approved': 1,   // Highest priority - active users
          'pending': 2,    // Medium priority - needs attention (should be rare now)
          'rejected': 3    // Lowest priority - already handled
        };
        
        const aData = a as any; // Type assertion for sorting
        const bData = b as any; // Type assertion for sorting
        
        const aPriority = statusPriority[aData.kycStatus as keyof typeof statusPriority] || 4;
        const bPriority = statusPriority[bData.kycStatus as keyof typeof statusPriority] || 4;
        
        // If same priority, sort by creation date (newest first)
        if (aPriority === bPriority) {
          // Safely convert dates to Date objects
          let aDate: Date;
          let bDate: Date;
          
          try {
            // Handle Firestore Timestamp or regular Date objects
            if (aData.createdAt?.toDate) {
              aDate = aData.createdAt.toDate();
            } else if (aData.createdAt instanceof Date) {
              aDate = aData.createdAt;
            } else if (typeof aData.createdAt === 'string') {
              aDate = new Date(aData.createdAt);
            } else {
              aDate = new Date(0); // Default date if invalid
            }
            
            if (bData.createdAt?.toDate) {
              bDate = bData.createdAt.toDate();
            } else if (bData.createdAt instanceof Date) {
              bDate = bData.createdAt;
            } else if (typeof bData.createdAt === 'string') {
              bDate = new Date(bData.createdAt);
            } else {
              bDate = new Date(0); // Default date if invalid
            }
            
            // Check if dates are valid before calling getTime()
            if (isNaN(aDate.getTime()) || isNaN(bDate.getTime())) {
              return 0; // If dates are invalid, don't change order
            }
            
            return bDate.getTime() - aDate.getTime();
          } catch (error) {
            console.warn('Error sorting by date:', error);
            return 0; // If there's an error, don't change order
          }
        }
        
        return aPriority - bPriority;
      });
      
      setUsers(sortedUsers);
    } catch (error) {
      console.error('❌ Error loading users:', error);
      console.error('❌ Error details:', {
        message: error.message,
        code: error.code,
        stack: error.stack
      });
      
      // Show more specific error information
      if (error.code === 'permission-denied') {
        alert('❌ Permission denied: Check Firebase security rules');
      } else if (error.code === 'unavailable') {
        alert('❌ Firebase service unavailable: Check your internet connection');
      } else if (error.code === 'unauthenticated') {
        alert('❌ Not authenticated: Please log in again');
      } else {
        alert(`❌ Error loading users: ${error.message}`);
      }
      
      setUsers([]);
    } finally {
      setUserLoading(false);
    }
  };

  // Load real opportunities from Firebase
  const loadOpportunities = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "opportunities"));
      const opps = querySnapshot.docs.map(doc => ({ 
        id: doc.id, 
        ...doc.data() 
      }));
      setOpportunities(opps);
    } catch (error) {
      console.error('Error loading opportunities:', error);
      setOpportunities([]);
    }
  };

  // Delete loan request (admin only)
  const deleteLoan = async (loanId: string, borrowerName: string) => {
    if (!confirm(`Are you sure you want to delete the loan request for ${borrowerName}? This action cannot be undone.`)) {
      return;
    }

    try {
      // Delete the loan request
      await deleteDoc(doc(db, "loanRequests", loanId));
      
      // Delete all related investments
      const investmentsQuery = query(collection(db, "investments"), where("loanRequestId", "==", loanId));
      const investmentsSnapshot = await getDocs(investmentsQuery);
      
      // Delete each investment
      for (const investmentDoc of investmentsSnapshot.docs) {
        await deleteDoc(investmentDoc.ref);
      }
      
      // Refresh the admin dashboard
      await loadLoanRequests();
      
    } catch (error) {
      console.error('Error deleting loan:', error);
      alert(`Failed to delete loan: ${error.message}`);
    }
  };

  // Handle loan approval/rejection
  const handleLoanAction = async (loanId: string, action: 'approve' | 'reject') => {
    try {
      // First, let's get the current loan data to verify it exists
      const loanRef = doc(db, "loanRequests", loanId);
      const loanSnap = await getDoc(loanRef);
      
      if (!loanSnap.exists()) {
        console.error(`❌ Loan document ${loanId} does not exist!`);
        alert(`Error: Loan ${loanId} not found in database`);
        return;
      }
      
      const currentLoanData = loanSnap.data();
      
      const newStatus = action === 'approve' ? 'approved' : 'rejected';
      
      // Update the loan status
      await updateDoc(loanRef, {
        status: newStatus,
        updatedAt: new Date(),
        adminAction: action,
        adminId: 'admin',
        adminEmail: 'admin@system.com'
      });
      
      alert(`Loan ${action === 'approve' ? 'approved' : 'rejected'} successfully!`);
      
      // Refresh the loan requests to show updated data
      await loadLoanRequests();
      
    } catch (error) {
      console.error(`❌ Error updating loan status:`, error);
      alert(`Failed to ${action} loan: ${error}`);
    }
  };

  // Handle user verification approval/rejection
  const handleUserVerification = async (userId: string, action: 'approved' | 'rejected') => {
    try {
      await updateDoc(doc(db, "users", userId), {
        kycStatus: action,
        verifiedAt: new Date(),
        adminAction: action,
        adminId: 'admin',
        adminEmail: 'admin@system.com'
      });

      alert(`User verification ${action === 'approved' ? 'approved' : 'rejected'} successfully!`);
      
      // Refresh the users
      await loadUsers();
    } catch (error) {
      console.error('Error updating user verification:', error);
      alert(`Failed to ${action} user verification: ${error}`);
    }
  };

  // Load all data on component mount
  useEffect(() => {
    const loadAllData = async () => {
      try {
        setLoading(true);
        await Promise.all([
          loadLoanRequests(),
          loadUsers(),
          loadOpportunities(),
          loadInvestments()
        ]);
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadAllData();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description || !amount || !interestRate || !term || !risk) {
      setError("All fields are required.");
      return;
    }
    setSuccess("Opportunity added successfully!");
      setTitle("");
      setDescription("");
      setAmount("");
      setInterestRate("");
      setTerm("");
      setRisk("");
    setError("");
  };

  const handleDelete = (id: string) => {
    alert(`Opportunity ${id} deleted successfully!`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Admin Dashboard</h1>
            <p className="text-muted-foreground">Manage real loan requests and opportunities</p>
          </div>
          <div className="flex gap-4">
            <Button variant="outline" onClick={() => navigate('/')} className="bg-blue-50 hover:bg-blue-100 text-blue-700 border-blue-200">
              <Home className="h-4 w-4 mr-2" />
              Home
            </Button>
            <Button variant="outline" onClick={loadLoanRequests} disabled={loanLoading}>
              <RefreshCw className={`h-4 w-4 mr-2 ${loanLoading ? 'animate-spin' : ''}`} />
              Refresh Loans
            </Button>
            <Button variant="outline" onClick={loadInvestments} disabled={investmentsLoading}>
              <RefreshCw className={`h-4 w-4 mr-2 ${investmentsLoading ? 'animate-spin' : ''}`} />
              Refresh Investments
            </Button>
            <Button variant="outline" onClick={() => navigate('/dashboard')}>
              Back to Dashboard
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
        </div>

        {/* Statistics Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Loan Requests</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
              <div className="text-2xl font-bold">{loanRequests.length}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Loans</CardTitle>
              <Clock className="h-4 w-4 text-yellow-500" />
              </CardHeader>
              <CardContent>
              <div className="text-2xl font-bold text-yellow-600">
                {loanRequests.filter(loan => (loan as any).status === 'pending').length}
              </div>
              <p className="text-xs text-muted-foreground">Need attention</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Approved Loans</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {loanRequests.filter(loan => (loan as any).status === 'approved').length}
              </div>
              <p className="text-xs text-muted-foreground">Already processed</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Rejected Loans</CardTitle>
              <XCircle className="h-4 w-4 text-red-500" />
              </CardHeader>
              <CardContent>
              <div className="text-2xl font-bold text-red-600">
                {loanRequests.filter(loan => (loan as any).status === 'rejected').length}
              </div>
              <p className="text-xs text-muted-foreground">Already processed</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Investments</CardTitle>
              <TrendingUp className="h-4 w-4 text-blue-500" />
              </CardHeader>
              <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {investmentsLoading ? '...' : investments.length}
              </div>
              <p className="text-xs text-muted-foreground">Lender investments</p>
              </CardContent>
            </Card>
          </div>

        <Tabs defaultValue="loan-management" className="space-y-6">
          <TabsList className="flex w-full flex-wrap gap-2">
            <TabsTrigger value="user-verification">User Verification</TabsTrigger>
            <TabsTrigger value="loan-management">Loan Management</TabsTrigger>
            <TabsTrigger value="lenders-investment">Lenders Investment</TabsTrigger>
            <TabsTrigger value="opportunities">Investment Opportunities</TabsTrigger>
            <TabsTrigger value="system-info">System Info</TabsTrigger>
          </TabsList>
          

          


          {/* User Verification Tab */}
          <TabsContent value="user-verification" className="space-y-6">
              <Card>
                <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  User KYC Verification Management
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  ℹ️ Users are automatically approved upon registration. The system will auto-approve any pending users.
                </p>
                </CardHeader>
                <CardContent>
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold">User Accounts Requiring Verification</h2>
                  <Button onClick={loadUsers} variant="outline" size="sm" disabled={userLoading}>
                    <RefreshCw className={`h-4 w-4 mr-2 ${userLoading ? 'animate-spin' : ''}`} />
                    Refresh Users
                  </Button>
                    </div>

                {userLoading ? (
                  <div className="text-center py-8">Loading users...</div>
                ) : users.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                    <p>No users found in your system.</p>
                    <p className="text-sm mt-2">Users will appear here once they create accounts.</p>
                    </div>
                  ) : (
                  <div className="space-y-4">
                    {users.map((user) => (
                      <div key={user.id} className="border rounded-lg p-4 space-y-3">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <User className="h-4 w-4 text-muted-foreground" />
                              <span className="font-medium">{(user as any).name || 'No Name'}</span>
                              <Badge variant={(user as any).kycStatus === 'pending' ? 'secondary' : (user as any).kycStatus === 'approved' ? 'default' : 'destructive'}>
                                {(user as any).kycStatus === 'pending' ? 'Pending' : (user as any).kycStatus === 'approved' ? 'Approved' : (user as any).kycStatus || 'No Status'}
                              </Badge>
                              <Badge variant={(user as any).userType === 'borrower' ? 'default' : 'secondary'}>
                                {(user as any).userType === 'borrower' ? 'Borrower' : 'Lender'}
                            </Badge>
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                              <div>
                                <span className="font-medium">Email:</span> {(user as any).email || 'N/A'}
                              </div>
                              <div>
                                <span className="font-medium">Mobile:</span> {(user as any).mobileNumber || 'N/A'}
                              </div>
                              <div>
                                <span className="font-medium">ID Number:</span> {(user as any).idNumber || 'N/A'}
                              </div>
                            </div>
                            {(user as any).createdAt && (
                              <div className="text-xs text-muted-foreground mt-2">
                                Account Created: {(user as any).createdAt.toDate?.()?.toLocaleString() || (user as any).createdAt.toLocaleString() || 'N/A'}
                              </div>
                            )}
                          </div>
                          
                          {(user as any).kycStatus === 'pending' && (
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                onClick={() => handleUserVerification(user.id, 'approved')}
                                className="bg-green-600 hover:bg-green-700"
                              >
                                <CheckCircle className="h-4 w-4 mr-1" />
                                Approve
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => handleUserVerification(user.id, 'rejected')}
                              >
                                <XCircle className="h-4 w-4 mr-1" />
                                Reject
                              </Button>
                            </div>
                          )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
          </TabsContent>

          {/* Loan Management Tab */}
          <TabsContent value="loan-management" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Real Loan Requests from Your System
                  </CardTitle>
                </CardHeader>
                <CardContent>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold">All Loan Requests ({loanRequests.length})</h3>
                  <Button onClick={loadLoanRequests} variant="outline" size="sm" disabled={loanLoading}>
                    <RefreshCw className={`h-4 w-4 mr-2 ${loanLoading ? 'animate-spin' : ''}`} />
                    Refresh
                  </Button>
                </div>
                
                {loanLoading ? (
                  <div className="text-center py-8">Loading loan requests...</div>
                ) : loanRequests.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <p>No loan requests found in your system.</p>
                    <p className="text-sm mt-2">Create a loan request from the loan page to see it here.</p>
                    </div>
                  ) : (
                  <div className="space-y-4">
                    {loanRequests.map((loan) => (
                      <div key={loan.id} className="border rounded-lg p-4 space-y-3">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <User className="h-4 w-4 text-muted-foreground" />
                              <span className="font-medium">{loan.name || 'Anonymous'}</span>
                              <Badge variant={loan.status === 'pending' ? 'secondary' : loan.status === 'approved' ? 'default' : 'destructive'}>
                                {loan.status}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground mb-2">{loan.purpose}</p>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                              <div>
                                <span className="font-medium">Amount:</span> SAR {loan.amount?.toLocaleString() || 'N/A'}
                              </div>
                              <div>
                                <span className="font-medium">Period:</span> {loan.repaymentPeriod || 'N/A'} months
                              </div>
                              <div>
                                <span className="font-medium">Expected Return:</span> {loan.interestRate ? (typeof loan.interestRate === 'string' ? loan.interestRate : (loan.interestRate * 100).toFixed(1)) : 'N/A'}%
                              </div>
                          <div>
                                <span className="font-medium">Monthly:</span> SAR {loan.monthlyPayment?.toLocaleString() || 'N/A'}
                              </div>
                            </div>
                            {loan.submittedAt && (
                              <div className="text-xs text-muted-foreground mt-2">
                                Submitted: {loan.submittedAt.toDate?.()?.toLocaleString() || loan.submittedAt.toLocaleString?.() || 'N/A'}
                              </div>
                            )}
                          </div>
                          
                          {loan.status === 'pending' && (
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                onClick={() => handleLoanAction(loan.id, 'approve')}
                                className="bg-green-600 hover:bg-green-700"
                              >
                                <CheckCircle className="h-4 w-4 mr-1" />
                                Approve
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => handleLoanAction(loan.id, 'reject')}
                              >
                                <XCircle className="h-4 w-4 mr-1" />
                                Reject
                              </Button>
                            </div>
                          )}
                          
                          {/* Delete button for all loans (admin only) */}
                          <div className="flex gap-2 ml-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => deleteLoan(loan.id, loan.name || 'Unknown')}
                              className="text-red-600 border-red-300 hover:bg-red-50"
                            >
                              🗑️ Delete
                            </Button>
                          </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
          </TabsContent>

          {/* User Verification Tab */}
          <TabsContent value="user-verification" className="space-y-6">
              <Card>
                <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  User KYC Verification Management
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  ℹ️ Users are automatically approved upon registration. The system will auto-approve any pending users.
                </p>
                </CardHeader>
                <CardContent>
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold">User Accounts Requiring Verification</h2>
                  <Button onClick={loadUsers} variant="outline" size="sm" disabled={userLoading}>
                    <RefreshCw className={`h-4 w-4 mr-2 ${userLoading ? 'animate-spin' : ''}`} />
                    Refresh Users
                  </Button>
                    </div>

                {userLoading ? (
                  <div className="text-center py-8">Loading users...</div>
                ) : users.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                    <p>No users found in your system.</p>
                    <p className="text-sm mt-2">Users will appear here once they create accounts.</p>
                    </div>
                  ) : (
                  <div className="space-y-4">
                    {users.map((user) => (
                      <div key={user.id} className="border rounded-lg p-4 space-y-3">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <User className="h-4 w-4 text-muted-foreground" />
                              <span className="font-medium">{(user as any).name || 'No Name'}</span>
                              <Badge variant={(user as any).kycStatus === 'pending' ? 'secondary' : (user as any).kycStatus === 'approved' ? 'default' : 'destructive'}>
                                {(user as any).kycStatus === 'pending' ? 'Pending' : (user as any).kycStatus === 'approved' ? 'Approved' : (user as any).kycStatus || 'No Status'}
                              </Badge>
                              <Badge variant={(user as any).userType === 'borrower' ? 'default' : 'secondary'}>
                                {(user as any).userType === 'borrower' ? 'Borrower' : 'Lender'}
                            </Badge>
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                              <div>
                                <span className="font-medium">Email:</span> {(user as any).email || 'N/A'}
                              </div>
                              <div>
                                <span className="font-medium">Mobile:</span> {(user as any).mobileNumber || 'N/A'}
                              </div>
                              <div>
                                <span className="font-medium">ID Number:</span> {(user as any).idNumber || 'N/A'}
                              </div>
                            </div>
                            {(user as any).createdAt && (
                              <div className="text-xs text-muted-foreground mt-2">
                                Account Created: {(user as any).createdAt.toDate?.()?.toLocaleString() || (user as any).createdAt.toLocaleString() || 'N/A'}
                              </div>
                            )}
                          </div>
                          
                          {(user as any).kycStatus === 'pending' && (
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                onClick={() => handleUserVerification(user.id, 'approved')}
                                className="bg-green-600 hover:bg-green-700"
                              >
                                <CheckCircle className="h-4 w-4 mr-1" />
                                Approve
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => handleUserVerification(user.id, 'rejected')}
                              >
                                <XCircle className="h-4 w-4 mr-1" />
                                Reject
                              </Button>
                            </div>
                          )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
          </TabsContent>

          {/* Investment Opportunities Tab */}
          <TabsContent value="opportunities" className="space-y-6">
              <Card>
                <CardHeader>
                <CardTitle>Add New Investment Opportunity</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="title" className="block text-sm font-medium mb-1">Title</label>
                      <Input
                        id="title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Opportunity title"
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="amount" className="block text-sm font-medium mb-1">Amount (SAR)</label>
                      <Input
                        id="amount"
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder="0.00"
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="interestRate" className="block text-sm font-medium mb-1">Expected Return (%)</label>
                      <Input
                        id="interestRate"
                        type="number"
                        step="0.1"
                        value={interestRate}
                        onChange={(e) => setInterestRate(e.target.value)}
                        placeholder="0.0"
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="term" className="block text-sm font-medium mb-1">Term</label>
                      <Input
                        id="term"
                        value={term}
                        onChange={(e) => setTerm(e.target.value)}
                        placeholder="e.g., 12 months"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="description" className="block text-sm font-medium mb-1">Description</label>
                    <Input
                      id="description"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Detailed description"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="risk" className="block text-sm font-medium mb-1">Risk Level</label>
                    <Input
                      id="risk"
                      value={risk}
                      onChange={(e) => setRisk(e.target.value)}
                      placeholder="e.g., Low, Medium, High"
                      required
                    />
                  </div>
                  
                  {error && <div className="text-red-600 text-sm">{error}</div>}
                    {success && <div className="text-green-600 text-sm">{success}</div>}
                  
                  <Button type="submit" className="w-full">
                    Add Opportunity
                  </Button>
                  </form>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                <CardTitle>Current Opportunities ({opportunities.length})</CardTitle>
                </CardHeader>
                <CardContent>
                  {opportunities.length === 0 ? (
                  <p className="text-muted-foreground">No opportunities available</p>
                ) : (
                  <div className="space-y-4">
                    {opportunities.map((op) => (
                      <div key={op.id} className="flex justify-between items-center p-3 border rounded">
                          <div>
                          <h4 className="font-medium">{op.title}</h4>
                          <p className="text-sm text-muted-foreground">{op.description}</p>
                          <div className="text-sm">
                            SAR {op.amount?.toLocaleString() || 'N/A'} • {op.interestRate || 'N/A'}% • {op.term || 'N/A'} • {op.risk || 'N/A'}
                          </div>
                          </div>
                          <Button variant="outline" size="sm" onClick={() => handleDelete(op.id)} className="text-red-600 hover:text-red-700">
                            Delete
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
          </TabsContent>

          {/* Lenders Investment Tab */}
          <TabsContent value="lenders-investment" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Lenders Investment Overview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold">All Investments ({investments.length})</h3>
                  <Button onClick={loadInvestments} variant="outline" size="sm" disabled={investmentsLoading}>
                    <RefreshCw className={`h-4 w-4 mr-2 ${investmentsLoading ? 'animate-spin' : ''}`} />
                    Refresh
                  </Button>
                </div>
                
                {investmentsLoading ? (
                  <div className="text-center py-8">Loading investments...</div>
                ) : investments.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <p>No investments found in your system.</p>
                    <p className="text-sm mt-2">Investments will appear here when lenders invest in loans.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {investments.map((investment) => (
                      <div key={investment.id} className="border rounded-lg p-4 space-y-3">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <User className="h-4 w-4 text-muted-foreground" />
                              <span className="font-medium">{investment.userName || `Lender ID: ${investment.userId}` || 'Anonymous'}</span>
                              <Badge variant="default" className="bg-blue-100 text-blue-800">
                                Investment
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground mb-2">
                              Loan ID: {investment.loanRequestId || 'N/A'}
                              {investment.userEmail && investment.userEmail !== 'N/A' && (
                                <span className="ml-4">• Email: {investment.userEmail}</span>
                              )}
                            </p>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                              <div>
                                <span className="font-medium">Amount:</span> SAR {investment.amount?.toLocaleString() || 'N/A'}
                              </div>
                              <div>
                                <span className="font-medium">Expected Return:</span> {investment.expectedReturn ? ((investment.expectedReturn / investment.amount - 1) * 100).toFixed(1) : 'N/A'}%
                                {investment.expectedReturn && (
                                  <span className="text-xs text-muted-foreground ml-2">
                                    (Total: SAR {investment.expectedReturn?.toLocaleString() || 'N/A'})
                                  </span>
                                )}
                              </div>
                              <div>
                                <span className="font-medium">Status:</span> 
                                <Badge 
                                  variant={investment.status === 'active' ? 'default' : 'secondary'}
                                  className={investment.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}
                                >
                                  {investment.status || 'active'}
                                </Badge>
                              </div>
                              <div>
                                <span className="font-medium">Invested:</span> 
                                {investment.investedAt ? (
                                  investment.investedAt.toDate ? 
                                    investment.investedAt.toDate().toLocaleDateString() : 
                                    new Date(investment.investedAt).toLocaleDateString()
                                ) : 'N/A'}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Investment Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Investment Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">
                      SAR {investments.reduce((total, inv) => total + (inv.amount || 0), 0).toLocaleString()}
                    </div>
                    <p className="text-sm text-blue-800">Total Invested</p>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">
                      {investments.filter(inv => inv.status === 'active').length}
                    </div>
                    <p className="text-sm text-green-800">Active Investments</p>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">
                      {investments.length > 0 ? 
                        (investments.reduce((total, inv) => total + (inv.amount || 0), 0) / investments.length).toFixed(0) : 0
                      }
                    </div>
                    <p className="text-sm text-purple-800">Average Investment</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* System Info Tab */}
          <TabsContent value="system-info" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>System Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium">Database Status</h4>
                      <p className="text-sm text-green-600">Connected to Firebase</p>
                    </div>
                    <div>
                      <h4 className="font-medium">Loan Requests</h4>
                      <p className="text-sm text-blue-600">{loanRequests.length} total</p>
                    </div>
                    <div>
                      <h4 className="font-medium">Pending Loans</h4>
                      <p className="text-sm text-orange-600">{loanRequests.filter(loan => loan.status === 'pending').length} need approval</p>
                    </div>
                    <div>
                      <h4 className="font-medium">Total Investments</h4>
                      <p className="text-sm text-purple-600">{investments.length} total</p>
                    </div>
                    <div>
                      <h4 className="font-medium">Total Invested Amount</h4>
                      <p className="text-sm text-green-600">SAR {investments.reduce((total, inv) => total + (inv.amount || 0), 0).toLocaleString()}</p>
                    </div>
                    <div>
                      <h4 className="font-medium">Last Updated</h4>
                      <p className="text-sm text-muted-foreground">{new Date().toLocaleString()}</p>
                    </div>
                  </div>

                  <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-medium text-blue-800 mb-2">How to use this dashboard:</h4>
                    <ul className="text-sm text-blue-700 space-y-1">
                      <li>• <strong>Loan Management:</strong> View and approve/reject loan requests from borrowers</li>
                      <li>• <strong>User Verification:</strong> Manage user KYC status and verification</li>
                      <li>• <strong>Investment Opportunities:</strong> Create and manage investment opportunities</li>
                      <li>• <strong>Lenders Investment:</strong> Monitor all lender investments and track funding</li>
                      <li>• <strong>Refresh:</strong> Click the refresh button to load latest data</li>
                      <li>• <strong>Real-time:</strong> All data comes directly from your Firebase database</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminOpportunities;