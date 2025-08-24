import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  FileText, 
  Clock, 
  DollarSign,
  TrendingUp,
  Shield,
  Users,
  Calendar,
  Target
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useNotifications } from '@/contexts/NotificationContext';
import { AdminWorkflow, AdminReview } from '@/lib/adminWorkflow';
import { MatchingEngine, LoanRequest, Lender } from '@/lib/matchingEngine';
import { formatSAR } from '@/lib/currency';

interface AdminLoanReviewProps {
  loanRequest: any;
  onReviewComplete: (review: AdminReview) => void;
  className?: string;
}

const AdminLoanReview: React.FC<AdminLoanReviewProps> = ({ 
  loanRequest, 
  onReviewComplete,
  className 
}) => {
  const { language } = useLanguage();
  const { addNotification } = useNotifications();
  const isAr = language === 'ar';
  
  const [review, setReview] = useState<AdminReview | null>(null);
  const [adminNotes, setAdminNotes] = useState('');
  const [approvedAmount, setApprovedAmount] = useState(loanRequest.amount);
  const [approvedTerms, setApprovedTerms] = useState(loanRequest.repaymentPeriod);
  const [interestRate, setInterestRate] = useState(8.5);
  const [rejectionReason, setRejectionReason] = useState('');
  const [requestedData, setRequestedData] = useState<string[]>([]);
  const [availableLenders, setAvailableLenders] = useState<Lender[]>([]);
  const [potentialMatches, setPotentialMatches] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const labels = {
    title: isAr ? 'مراجعة طلب القرض' : 'Loan Request Review',
    riskAssessment: isAr ? 'تقييم المخاطر' : 'Risk Assessment',
    adminNotes: isAr ? 'ملاحظات المدير' : 'Admin Notes',
    approve: isAr ? 'موافقة' : 'Approve',
    reject: isAr ? 'رفض' : 'Reject',
    requestData: isAr ? 'طلب بيانات إضافية' : 'Request Additional Data',
    adjustTerms: isAr ? 'تعديل الشروط' : 'Adjust Terms',
    approvedAmount: isAr ? 'المبلغ المعتمد' : 'Approved Amount',
    approvedTerms: isAr ? 'المدة المعتمدة' : 'Approved Terms',
            interestRate: isAr ? 'معدل الربح' : 'Expected Return',
    rejectionReason: isAr ? 'سبب الرفض' : 'Rejection Reason',
    additionalData: isAr ? 'البيانات المطلوبة' : 'Required Data',
    potentialMatches: isAr ? 'المطابقات المحتملة' : 'Potential Matches',
    executeMatch: isAr ? 'تنفيذ المطابقة' : 'Execute Match',
    riskLevel: isAr ? 'مستوى المخاطر' : 'Risk Level',
    riskScore: isAr ? 'درجة المخاطر' : 'Risk Score',
    riskFactors: isAr ? 'عوامل المخاطر' : 'Risk Factors',
    recommendations: isAr ? 'التوصيات' : 'Recommendations',
    borrowerInfo: isAr ? 'معلومات المقترض' : 'Borrower Information',
    loanDetails: isAr ? 'تفاصيل القرض' : 'Loan Details',
    matching: isAr ? 'المطابقة' : 'Matching',
    actions: isAr ? 'الإجراءات' : 'Actions'
  };

  // Mock borrower history (in real app, this would come from database)
  const mockBorrowerHistory = {
    defaultedLoans: 0,
    latePayments: 1,
    totalLoans: 2,
    averageRating: 4.2
  };

  // Mock available lenders (in real app, this would come from database)
  const mockLenders: Lender[] = [
    {
      id: 'lender-1',
      userId: 'user-2',
      availableAmount: 10000,
      riskPreference: 'low',
      preferredTerms: [3, 6, 12],
      maxAmount: 5000,
      minAmount: 500,
      rating: 4.5
    },
    {
      id: 'lender-2',
      userId: 'user-3',
      availableAmount: 15000,
      riskPreference: 'medium',
      preferredTerms: [6, 12],
      maxAmount: 8000,
      minAmount: 1000,
      rating: 4.0
    }
  ];

  useEffect(() => {
    // Initialize review with risk assessment
    const initializeReview = async () => {
      const initialReview = await AdminWorkflow.reviewLoanRequest(
        loanRequest,
        mockBorrowerHistory,
        'admin-1'
      );
      setReview(initialReview);
      
      // Find potential matches
      const matches = MatchingEngine.findMatches(loanRequest, mockLenders);
      setPotentialMatches(matches);
      setAvailableLenders(mockLenders);
    };

    initializeReview();
  }, [loanRequest]);

  const handleApprove = async () => {
    if (!review) return;
    
    setLoading(true);
    try {
      const action = await AdminWorkflow.approveLoanRequest(
        review,
        approvedAmount,
        approvedTerms,
        interestRate,
        adminNotes
      );

      // Send notification to borrower
      await addNotification({
        userId: loanRequest.userId,
        type: 'loan_approved',
        title: isAr ? 'تمت الموافقة على طلب القرض' : 'Loan Request Approved',
        message: isAr 
          ? `تمت الموافقة على قرضك بمبلغ ${formatSAR(approvedAmount)} لمدة ${approvedTerms} أشهر`
          : `Your loan request for ${formatSAR(approvedAmount)} for ${approvedTerms} months has been approved`,
        read: false
      });

      onReviewComplete(review);
    } catch (error) {
      console.error('Error approving loan:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async () => {
    if (!review || !rejectionReason) return;
    
    setLoading(true);
    try {
      const action = await AdminWorkflow.rejectLoanRequest(
        review,
        rejectionReason,
        adminNotes
      );

      // Send notification to borrower
      await addNotification({
        userId: loanRequest.userId,
        type: 'loan_rejected',
        title: isAr ? 'تم رفض طلب القرض' : 'Loan Request Rejected',
        message: isAr 
          ? `تم رفض طلب قرضك. السبب: ${rejectionReason}`
          : `Your loan request has been rejected. Reason: ${rejectionReason}`,
        read: false
      });

      onReviewComplete(review);
    } catch (error) {
      console.error('Error rejecting loan:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRequestData = async () => {
    if (!review || requestedData.length === 0) return;
    
    setLoading(true);
    try {
      const action = await AdminWorkflow.requestAdditionalData(
        review,
        requestedData,
        adminNotes
      );

      // Send notification to borrower
      await addNotification({
        userId: loanRequest.userId,
        type: 'additional_data_requested',
        title: isAr ? 'مطلوب بيانات إضافية' : 'Additional Data Required',
        message: isAr 
          ? 'يرجى تقديم البيانات الإضافية المطلوبة لمراجعة طلب القرض'
          : 'Please provide additional data required to review your loan request',
        read: false
      });

      onReviewComplete(review);
    } catch (error) {
      console.error('Error requesting data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleExecuteMatch = async (match: any) => {
    setLoading(true);
    try {
      const success = await MatchingEngine.executeMatch(
        match,
        loanRequest,
        availableLenders.find(l => l.id === match.lenderId)!
      );

      if (success) {
        // Send notification to both borrower and lender
        await addNotification({
          userId: loanRequest.userId,
          type: 'investment_matched',
          title: isAr ? 'تمت مطابقة الاستثمار' : 'Investment Matched',
          message: isAr 
            ? `تم العثور على مستثمر لمبلغ ${formatSAR(match.amount)}`
            : `An investor has been found for ${formatSAR(match.amount)}`,
          read: false
        });
      }
    } catch (error) {
      console.error('Error executing match:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!review) {
    return <div className="p-4">Loading review...</div>;
  }

  return (
    <div className={`space-y-6 ${className}`}>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            {labels.title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">{isAr ? 'نظرة عامة' : 'Overview'}</TabsTrigger>
              <TabsTrigger value="risk">{labels.riskAssessment}</TabsTrigger>
              <TabsTrigger value="matching">{labels.matching}</TabsTrigger>
              <TabsTrigger value="actions">{labels.actions}</TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      {labels.borrowerInfo}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 text-sm">
                      <div>ID: {loanRequest.userId}</div>
                      <div>Rating: {loanRequest.borrowerRating || 'N/A'}</div>
                      <div>History: {mockBorrowerHistory.totalLoans} loans</div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <DollarSign className="h-4 w-4" />
                      {labels.loanDetails}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 text-sm">
                      <div>Amount: {formatSAR(loanRequest.amount)}</div>
                      <div>Term: {loanRequest.repaymentPeriod} months</div>
                      <div>Purpose: {loanRequest.purpose}</div>
                      <div>Category: {loanRequest.category}</div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Risk Assessment Tab */}
            <TabsContent value="risk" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    {labels.riskAssessment}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-4">
                    <Badge 
                      variant={review.riskAssessment.level === 'high' ? 'destructive' : 
                              review.riskAssessment.level === 'medium' ? 'secondary' : 'default'}
                    >
                      {review.riskAssessment.level.toUpperCase()}
                    </Badge>
                    <span className="text-sm">
                      {labels.riskScore}: {review.riskAssessment.score}/100
                    </span>
                  </div>

                  {review.riskAssessment.factors.length > 0 && (
                    <div>
                      <h4 className="font-medium mb-2">{labels.riskFactors}:</h4>
                      <ul className="list-disc list-inside space-y-1 text-sm">
                        {review.riskAssessment.factors.map((factor, index) => (
                          <li key={index}>{factor}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {review.riskAssessment.recommendations.length > 0 && (
                    <div>
                      <h4 className="font-medium mb-2">{labels.recommendations}:</h4>
                      <ul className="list-disc list-inside space-y-1 text-sm">
                        {review.riskAssessment.recommendations.map((rec, index) => (
                          <li key={index}>{rec}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Matching Tab */}
            <TabsContent value="matching" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5" />
                    {labels.potentialMatches}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {potentialMatches.length > 0 ? (
                    <div className="space-y-3">
                      {potentialMatches.map((match, index) => (
                        <div key={index} className="p-3 border rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-medium">
                              Lender {match.lenderId}
                            </span>
                            <Badge variant="outline">
                              {Math.round(match.matchScore * 100)}% match
                            </span>
                          </div>
                          <div className="grid grid-cols-3 gap-2 text-sm text-muted-foreground">
                            <div>Amount: {formatSAR(match.amount)}</div>
                            <div>Risk: {Math.round(match.riskCompatibility * 100)}%</div>
                            <div>Terms: {Math.round(match.termCompatibility * 100)}%</div>
                          </div>
                          <Button
                            size="sm"
                            className="mt-2"
                            onClick={() => handleExecuteMatch(match)}
                            disabled={loading}
                          >
                            {labels.executeMatch}
                          </Button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground">No potential matches found.</p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Actions Tab */}
            <TabsContent value="actions" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    {labels.actions}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="adminNotes">{labels.adminNotes}</Label>
                    <Textarea
                      id="adminNotes"
                      value={adminNotes}
                      onChange={(e) => setAdminNotes(e.target.value)}
                      placeholder={isAr ? 'أدخل ملاحظاتك هنا...' : 'Enter your notes here...'}
                      className="mt-1"
                    />
                  </div>

                  {/* Approve Section */}
                  <div className="space-y-3 p-4 border rounded-lg bg-green-50">
                    <h4 className="font-medium text-green-800 flex items-center gap-2">
                      <CheckCircle className="h-4 w-4" />
                      {labels.approve}
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <div>
                        <Label htmlFor="approvedAmount">{labels.approvedAmount}</Label>
                        <Input
                          id="approvedAmount"
                          type="number"
                          value={approvedAmount}
                          onChange={(e) => setApprovedAmount(Number(e.target.value))}
                          min="500"
                          max="5000"
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="approvedTerms">{labels.approvedTerms}</Label>
                        <Select value={approvedTerms.toString()} onValueChange={(value) => setApprovedTerms(Number(value))}>
                          <SelectTrigger className="mt-1">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(term => (
                              <SelectItem key={term} value={term.toString()}>
                                {term} {isAr ? 'أشهر' : 'months'}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="interestRate">{labels.interestRate} (%)</Label>
                        <Input
                          id="interestRate"
                          type="number"
                          value={interestRate}
                          onChange={(e) => setInterestRate(Number(e.target.value))}
                          min="5"
                          max="20"
                          step="0.1"
                          className="mt-1"
                        />
                      </div>
                    </div>
                    <Button 
                      onClick={handleApprove}
                      disabled={loading}
                      className="w-full bg-green-600 hover:bg-green-700"
                    >
                      {labels.approve}
                    </Button>
                  </div>

                  {/* Reject Section */}
                  <div className="space-y-3 p-4 border rounded-lg bg-red-50">
                    <h4 className="font-medium text-red-800 flex items-center gap-2">
                      <XCircle className="h-4 w-4" />
                      {labels.reject}
                    </h4>
                    <div>
                      <Label htmlFor="rejectionReason">{labels.rejectionReason}</Label>
                      <Input
                        id="rejectionReason"
                        value={rejectionReason}
                        onChange={(e) => setRejectionReason(e.target.value)}
                        placeholder={isAr ? 'أدخل سبب الرفض...' : 'Enter rejection reason...'}
                        className="mt-1"
                      />
                    </div>
                    <Button 
                      onClick={handleReject}
                      disabled={loading || !rejectionReason}
                      variant="destructive"
                      className="w-full"
                    >
                      {labels.reject}
                    </Button>
                  </div>

                  {/* Request Data Section */}
                  <div className="space-y-3 p-4 border rounded-lg bg-orange-50">
                    <h4 className="font-medium text-orange-800 flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      {labels.requestData}
                    </h4>
                    <div className="space-y-2">
                      {[
                        'Proof of income',
                        'Bank statements (last 3 months)',
                        'Employment verification',
                        'Additional identification documents',
                        'Credit report',
                        'Collateral documentation'
                      ].map((dataType) => (
                        <label key={dataType} className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            checked={requestedData.includes(dataType)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setRequestedData([...requestedData, dataType]);
                              } else {
                                setRequestedData(requestedData.filter(d => d !== dataType));
                              }
                            }}
                          />
                          <span className="text-sm">{dataType}</span>
                        </label>
                      ))}
                    </div>
                    <Button 
                      onClick={handleRequestData}
                      disabled={loading || requestedData.length === 0}
                      variant="outline"
                      className="w-full border-orange-300 text-orange-800 hover:bg-orange-100"
                    >
                      {labels.requestData}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminLoanReview;
