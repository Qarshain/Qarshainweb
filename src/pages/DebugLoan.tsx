import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { collection, getDocs, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../lib/firebase";
import { useAuth } from "../contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Home, ArrowLeft } from "lucide-react";

const DebugLoan = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loans, setLoans] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const loadLoans = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "loanRequests"));
      const loansData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setLoans(loansData);
      console.log("Loaded loans:", loansData);
    } catch (error) {
      console.error("Error loading loans:", error);
    }
  };

  const createTestLoan = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const testLoan = {
        userId: user.uid,
        userType: 'borrower',
        name: user.displayName || user.email || 'Test User',
        amount: 1000,
        repaymentPeriod: 6,
        purpose: 'Test loan for debugging',
        status: 'pending',
        submittedAt: serverTimestamp(),
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        interestRate: 0.12,
        monthlyPayment: 200,
        totalRepayment: 1200,
        daysRemaining: 180,
        mockUserId: 'test-user'
      };

      const docRef = await addDoc(collection(db, "loanRequests"), testLoan);
      console.log("Test loan created with ID:", docRef.id);
      
      // Reload loans
      await loadLoans();
    } catch (error) {
      console.error("Error creating test loan:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLoans();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <Button variant="ghost" onClick={() => navigate('/')}>
          <ArrowLeft className="mr-2" /> Back to Home
        </Button>
        <h1 className="text-3xl font-bold">Loan Debug Page</h1>
        <Button variant="ghost" onClick={() => navigate('/')}>
          <Home className="ml-2" /> Home
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button onClick={createTestLoan} disabled={loading || !user}>
              {loading ? 'Creating...' : 'Create Test Loan'}
            </Button>
            <Button onClick={loadLoans} variant="outline">
              Reload Loans
            </Button>
            {!user && <p className="text-red-500">Please log in to create loans</p>}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Current Loans ({loans.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {loans.length === 0 ? (
              <p className="text-muted-foreground">No loans found</p>
            ) : (
              <div className="space-y-2">
                {loans.map(loan => (
                  <div key={loan.id} className="p-3 border rounded">
                    <p><strong>ID:</strong> {loan.id}</p>
                    <p><strong>User:</strong> {loan.userId}</p>
                    <p><strong>Amount:</strong> {loan.amount}</p>
                    <p><strong>Status:</strong> {loan.status}</p>
                    <p><strong>Purpose:</strong> {loan.purpose}</p>
                    <p><strong>Submitted:</strong> {loan.submittedAt?.toDate?.()?.toLocaleString() || 'N/A'}</p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Debug Info</h2>
        <div className="bg-gray-100 p-4 rounded">
          <p><strong>Current User:</strong> {user?.email || 'Not logged in'}</p>
          <p><strong>User ID:</strong> {user?.uid || 'N/A'}</p>
          <p><strong>Display Name:</strong> {user?.displayName || 'N/A'}</p>
        </div>
      </div>
    </div>
  );
};

export default DebugLoan;
