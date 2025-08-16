import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { getTransactions, getUserTransactions, getTransactionStatistics } from "../lib/queryClient";
import { formatSAR } from "../lib/currency";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { 
  History, 
  ArrowLeft, 
  ArrowUpRight, 
  ArrowDownRight, 
  RefreshCw, 
  Search, 
  Filter,
  TrendingUp,
  Calendar,
  DollarSign,
  Users,
  Home,
  Globe
} from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const TransactionsPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { language, setLanguage } = useLanguage();
  const isAr = language === 'ar';

  // State management
  const [allTransactions, setAllTransactions] = useState<any[]>([]);
  const [userTransactions, setUserTransactions] = useState<any[]>([]);
  const [statistics, setStatistics] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'completed' | 'failed'>('all');
  const [viewMode, setViewMode] = useState<'user' | 'all'>('user');

  // Map Firebase user to mock user
  const getMockUserId = (firebaseUser: any) => {
    const emailToUserMap: { [key: string]: string } = {
      'saharaldhaheri@gmail.com': 'user-1',
      'admin@test.com': 'user-2',
      'user@test.com': 'user-3'
    };
    return emailToUserMap[firebaseUser?.email] || 'user-1';
  };

  const currentMockUserId = getMockUserId(user);

  const loadData = async () => {
    try {
      setLoading(true);
      
      // Load user transactions
      const userTxData = await getUserTransactions(currentMockUserId, 50);
      setUserTransactions(userTxData.data.transactions);
      
      // Load all transactions (if admin or for comparison)
      const allTxData = await getTransactions({ limit: 100 });
      setAllTransactions(allTxData.data.transactions);
      
      // Load statistics
      const statsData = await getTransactionStatistics();
      setStatistics(statsData.data.statistics);
      
    } catch (error) {
      console.error('Error loading transaction data:', error);
      toast({
        title: "Error",
        description: "Failed to load transaction data. Please ensure the backend is running.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      loadData();
    }
  }, [user]);

  if (!user) {
    navigate('/login');
    return null;
  }

  const transactions = viewMode === 'user' ? userTransactions : allTransactions;
  
  // Filter transactions based on search and status
  const filteredTransactions = transactions.filter(tx => {
    const matchesSearch = searchTerm === '' || 
      tx.senderName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tx.recipientName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tx.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || tx.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const labels = {
    title: isAr ? 'سجل المعاملات' : 'Transaction History',
    subtitle: isAr ? 'عرض جميع المعاملات المالية' : 'View all financial transactions',
    userTransactions: isAr ? 'معاملاتي' : 'My Transactions',
    allTransactions: isAr ? 'جميع المعاملات' : 'All Transactions',
    search: isAr ? 'البحث...' : 'Search...',
    filter: isAr ? 'تصفية' : 'Filter',
    all: isAr ? 'الكل' : 'All',
    completed: isAr ? 'مكتملة' : 'Completed',
    failed: isAr ? 'فاشلة' : 'Failed',
    refresh: isAr ? 'تحديث' : 'Refresh',
    back: isAr ? 'العودة' : 'Back',
    home: isAr ? 'الرئيسية' : 'Home',
    to: isAr ? 'إلى' : 'To',
    from: isAr ? 'من' : 'From',
    amount: isAr ? 'المبلغ' : 'Amount',
    date: isAr ? 'التاريخ' : 'Date',
    status: isAr ? 'الحالة' : 'Status',
    noTransactions: isAr ? 'لا توجد معاملات' : 'No transactions found',
    totalTransactions: isAr ? 'إجمالي المعاملات' : 'Total Transactions',
    totalVolume: isAr ? 'إجمالي المبلغ' : 'Total Volume',
    successRate: isAr ? 'معدل النجاح' : 'Success Rate',
    avgAmount: isAr ? 'متوسط المبلغ' : 'Average Amount',
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Loading transaction data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-4">
            <Button variant="outline" onClick={() => navigate('/dashboard')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              {labels.back}
            </Button>
            <Button variant="outline" onClick={() => navigate('/')}>
              <Home className="h-4 w-4 mr-2" />
              {labels.home}
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-foreground">{labels.title}</h1>
              <p className="text-muted-foreground">{labels.subtitle}</p>
            </div>
          </div>
          <div className="flex gap-4">
            <Button variant="outline" onClick={loadData} disabled={loading}>
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              {labels.refresh}
            </Button>
            <Button
              variant="outline"
              onClick={() => setLanguage(language === 'ar' ? 'en' : 'ar')}
              className="flex items-center gap-2"
            >
              <Globe className="h-4 w-4" />
              {language === 'ar' ? 'English' : 'عربي'}
            </Button>
          </div>
        </div>

        {/* Statistics Cards */}
        {statistics && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{labels.totalTransactions}</CardTitle>
                <History className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{statistics.totalTransactions}</div>
                <p className="text-xs text-muted-foreground">
                  {statistics.completedTransactions} completed
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{labels.totalVolume}</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatSAR(statistics.totalVolume)}</div>
                <p className="text-xs text-muted-foreground">
                  Platform total
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{labels.successRate}</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{statistics.successRate}%</div>
                <p className="text-xs text-muted-foreground">
                  Success rate
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{labels.avgAmount}</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatSAR(statistics.averageTransactionSize)}</div>
                <p className="text-xs text-muted-foreground">
                  Average per transaction
                </p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Filters and Search */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              {/* View Mode Toggle */}
              <div className="flex gap-2">
                <Button
                  variant={viewMode === 'user' ? 'default' : 'outline'}
                  onClick={() => setViewMode('user')}
                  size="sm"
                >
                  {labels.userTransactions}
                </Button>
                <Button
                  variant={viewMode === 'all' ? 'default' : 'outline'}
                  onClick={() => setViewMode('all')}
                  size="sm"
                >
                  {labels.allTransactions}
                </Button>
              </div>

              {/* Search */}
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder={labels.search}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Status Filter */}
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as 'all' | 'completed' | 'failed')}
                className="px-3 py-2 border rounded-md bg-background"
              >
                <option value="all">{labels.all}</option>
                <option value="completed">{labels.completed}</option>
                <option value="failed">{labels.failed}</option>
              </select>
            </div>
          </CardContent>
        </Card>

        {/* Transactions List */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <History className="h-5 w-5" />
              {viewMode === 'user' ? labels.userTransactions : labels.allTransactions}
              <Badge variant="secondary">{filteredTransactions.length}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {filteredTransactions.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <History className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>{labels.noTransactions}</p>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredTransactions.map((transaction: any) => (
                  <div key={transaction.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="flex items-center gap-4">
                      {/* Direction Icon */}
                      {viewMode === 'user' ? (
                        transaction.from === currentMockUserId ? (
                          <div className="p-2 bg-red-100 rounded-full">
                            <ArrowUpRight className="h-4 w-4 text-red-600" />
                          </div>
                        ) : (
                          <div className="p-2 bg-green-100 rounded-full">
                            <ArrowDownRight className="h-4 w-4 text-green-600" />
                          </div>
                        )
                      ) : (
                        <div className="p-2 bg-blue-100 rounded-full">
                          <ArrowUpRight className="h-4 w-4 text-blue-600" />
                        </div>
                      )}

                      {/* Transaction Details */}
                      <div>
                        <div className="font-medium">
                          {viewMode === 'user' ? (
                            transaction.from === currentMockUserId 
                              ? `${labels.to} ${transaction.recipientName}` 
                              : `${labels.from} ${transaction.senderName}`
                          ) : (
                            `${transaction.senderName} → ${transaction.recipientName}`
                          )}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          ID: {transaction.id.substring(0, 8)}... | {new Date(transaction.timestamp).toLocaleString()}
                        </div>
                      </div>
                    </div>

                    {/* Amount and Status */}
                    <div className="text-right">
                      <div className={`font-medium text-lg ${
                        viewMode === 'user' 
                          ? (transaction.from === currentMockUserId ? 'text-red-600' : 'text-green-600')
                          : 'text-blue-600'
                      }`}>
                        {viewMode === 'user' && transaction.from === currentMockUserId ? '-' : ''}
                        {viewMode === 'user' && transaction.from !== currentMockUserId ? '+' : ''}
                        {formatSAR(transaction.amount)}
                      </div>
                      <Badge variant={transaction.status === 'completed' ? 'default' : 'destructive'}>
                        {transaction.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TransactionsPage;