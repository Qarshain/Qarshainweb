import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import NotFound from "./pages/NotFound";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { LanguageProvider } from "./contexts/LanguageContext";
import { NotificationProvider } from "./contexts/NotificationContext";
import Dashboard from "./pages/Dashboard";
import InvestList from "./pages/InvestList";
import InvestDetail from "./pages/InvestDetail";
import AdminOpportunities from "./pages/AdminOpportunities";
import LoanRequest from "./pages/LoanRequest";
import Wallet from "./pages/Wallet";
import Transactions from "./pages/Transactions";
import UserProfile from "./components/UserProfile";
import { useAnalytics } from "./hooks/useAnalytics";

const queryClient = new QueryClient();

function PrivateRoute({ children }: { children: JSX.Element }) {
  const { user } = useAuth();
  if (!user) {
    return <Login />;
  }
  return children;
}

function AppRoutes() {
  // Initialize analytics for route tracking
  useAnalytics();
  
  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
      <Route path="/wallet" element={<PrivateRoute><Wallet /></PrivateRoute>} />
      <Route path="/transactions" element={<PrivateRoute><Transactions /></PrivateRoute>} />
      <Route path="/profile" element={<PrivateRoute><UserProfile /></PrivateRoute>} />
      <Route path="/invest" element={<InvestList />} />
      <Route path="/invest/:id" element={<InvestDetail />} />
      <Route path="/admin/opportunities" element={<AdminOpportunities />} />
      <Route path="/loan-request" element={<LoanRequest />} />
      {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <LanguageProvider>
          <NotificationProvider>
            <AppRoutes />
          </NotificationProvider>
        </LanguageProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
