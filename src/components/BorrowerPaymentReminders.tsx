import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Bell, 
  Calendar, 
  Clock, 
  AlertTriangle, 
  CheckCircle, 
  Mail,
  Settings,
  Eye,
  EyeOff
} from 'lucide-react';
import { formatSAR } from '@/lib/currency';
import { emailService } from '@/lib/emailService';

interface PaymentReminder {
  id: string;
  loanId: string;
  amount: number;
  dueDate: string;
  daysUntilDue: number;
  status: 'upcoming' | 'overdue' | 'paid';
  reminderType: 'upcoming' | 'overdue' | 'final';
  lastReminderSent?: string;
  nextReminderDate?: string;
}

interface BorrowerPaymentRemindersProps {
  userId: string;
  language: 'ar' | 'en';
}

export const BorrowerPaymentReminders: React.FC<BorrowerPaymentRemindersProps> = ({ 
  userId, 
  language 
}) => {
  const [reminders, setReminders] = useState<PaymentReminder[]>([]);
  const [loading, setLoading] = useState(true);
  const [showEmailPreview, setShowEmailPreview] = useState(false);
  const [previewData, setPreviewData] = useState<any>(null);

  const isRtl = language === 'ar';

  // Mock data for demonstration - in real app, this would come from your database
  useEffect(() => {
    const mockReminders: PaymentReminder[] = [
      {
        id: '1',
        loanId: 'LOAN-001',
        amount: 2500,
        dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        daysUntilDue: 3,
        status: 'upcoming',
        reminderType: 'upcoming',
        lastReminderSent: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        nextReminderDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: '2',
        loanId: 'LOAN-002',
        amount: 5000,
        dueDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        daysUntilDue: -2,
        status: 'overdue',
        reminderType: 'overdue',
        lastReminderSent: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        nextReminderDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString()
      }
    ];

    setTimeout(() => {
      setReminders(mockReminders);
      setLoading(false);
    }, 1000);
  }, [userId]);

  const getReminderStatusColor = (status: string) => {
    switch (status) {
      case 'upcoming':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'overdue':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'paid':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getReminderStatusIcon = (status: string) => {
    switch (status) {
      case 'upcoming':
        return <Clock className="h-4 w-4 text-green-600" />;
      case 'overdue':
        return <AlertTriangle className="h-4 w-4 text-orange-600" />;
      case 'paid':
        return <CheckCircle className="h-4 w-4 text-blue-600" />;
      default:
        return <Bell className="h-4 w-4 text-gray-600" />;
    }
  };

  const handlePreviewEmail = (reminder: PaymentReminder) => {
    const testData = {
      borrowerName: 'أحمد محمد (اختبار)',
      borrowerEmail: 'test@example.com',
      loanAmount: reminder.amount * 2, // Assuming total loan amount
      remainingAmount: reminder.amount,
      dueDate: reminder.dueDate,
      loanId: reminder.loanId,
      paymentLink: 'https://garshain.com/pay/' + reminder.loanId,
      daysOverdue: reminder.daysUntilDue < 0 ? Math.abs(reminder.daysUntilDue) : 0
    };

    const template = emailService.generateReminderEmail(testData, reminder.reminderType);
    setPreviewData({
      subject: template.subject,
      html: template.html,
      text: template.text
    });
    setShowEmailPreview(true);
  };

  const handleMarkAsPaid = (reminderId: string) => {
    setReminders(prev => 
      prev.map(reminder => 
        reminder.id === reminderId 
          ? { ...reminder, status: 'paid' as const }
          : reminder
      )
    );
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            {isRtl ? 'تذكيرات الدفع' : 'Payment Reminders'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[1, 2].map(i => (
              <div key={i} className="h-20 bg-gray-200 rounded animate-pulse"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="h-5 w-5" />
          {isRtl ? 'تذكيرات الدفع' : 'Payment Reminders'}
        </CardTitle>
        <CardDescription>
          {isRtl 
            ? 'تتبع مدفوعاتك القادمة والمتأخرة' 
            : 'Track your upcoming and overdue payments'
          }
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {reminders.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Bell className="h-12 w-12 mx-auto mb-4 text-gray-400" />
            <p className="text-lg font-medium mb-2">
              {isRtl ? 'لا توجد تذكيرات حالياً' : 'No reminders at the moment'}
            </p>
            <p className="text-sm">
              {isRtl 
                ? 'ستظهر تذكيرات الدفع هنا عندما يكون لديك قروض نشطة'
                : 'Payment reminders will appear here when you have active loans'
              }
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {reminders.map((reminder) => (
              <div key={reminder.id} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    {getReminderStatusIcon(reminder.status)}
                    <div>
                      <h4 className="font-medium">
                        {isRtl ? 'قرض' : 'Loan'} {reminder.loanId}
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        {isRtl ? 'المبلغ المستحق' : 'Amount Due'}: {formatSAR(reminder.amount, language)}
                      </p>
                    </div>
                  </div>
                  <Badge className={getReminderStatusColor(reminder.status)}>
                    {reminder.status === 'upcoming' && (isRtl ? 'قريب الاستحقاق' : 'Upcoming')}
                    {reminder.status === 'overdue' && (isRtl ? 'متأخر' : 'Overdue')}
                    {reminder.status === 'paid' && (isRtl ? 'مدفوع' : 'Paid')}
                  </Badge>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">
                      {isRtl ? 'تاريخ الاستحقاق' : 'Due Date'}:
                    </span>
                    <span className="font-medium">
                      {new Date(reminder.dueDate).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">
                      {isRtl ? 'الأيام المتبقية' : 'Days Remaining'}:
                    </span>
                    <span className={`font-medium ${
                      reminder.daysUntilDue < 0 ? 'text-orange-600' : 
                      reminder.daysUntilDue <= 3 ? 'text-yellow-600' : 'text-green-600'
                    }`}>
                      {reminder.daysUntilDue < 0 
                        ? `${Math.abs(reminder.daysUntilDue)} ${isRtl ? 'يوم متأخر' : 'days overdue'}`
                        : `${reminder.daysUntilDue} ${isRtl ? 'يوم' : 'days'}`
                      }
                    </span>
                  </div>
                </div>

                {reminder.lastReminderSent && (
                  <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="flex items-center gap-2 text-sm text-blue-800">
                      <Mail className="h-4 w-4" />
                      <span>
                        {isRtl 
                          ? `آخر تذكير مرسل: ${new Date(reminder.lastReminderSent).toLocaleDateString()}`
                          : `Last reminder sent: ${new Date(reminder.lastReminderSent).toLocaleDateString()}`
                        }
                      </span>
                    </div>
                  </div>
                )}

                <div className="flex gap-2">
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => handlePreviewEmail(reminder)}
                    className="flex-1"
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    {isRtl ? 'معاينة التذكير' : 'Preview Reminder'}
                  </Button>
                  
                  {reminder.status !== 'paid' && (
                    <Button 
                      size="sm" 
                      onClick={() => handleMarkAsPaid(reminder.id)}
                      className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      {isRtl ? 'تم الدفع' : 'Mark as Paid'}
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Email Preview Modal */}
        {showEmailPreview && previewData && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">
                    {isRtl ? 'معاينة تذكير البريد الإلكتروني' : 'Email Reminder Preview'}
                  </h3>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setShowEmailPreview(false)}
                  >
                    <EyeOff className="h-4 w-4 mr-2" />
                    {isRtl ? 'إغلاق' : 'Close'}
                  </Button>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700">
                      {isRtl ? 'الموضوع' : 'Subject'}:
                    </label>
                    <p className="text-sm text-gray-600 mt-1">{previewData.subject}</p>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-700">
                      {isRtl ? 'المحتوى' : 'Content'}:
                    </label>
                    <div className="mt-2 p-4 bg-gray-50 rounded-lg max-h-96 overflow-auto border">
                      <div dangerouslySetInnerHTML={{ __html: previewData.html }} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Information Alert */}
        <Alert>
          <Bell className="h-4 w-4" />
          <AlertDescription>
            <strong>
              {isRtl ? 'معلومات مهمة:' : 'Important Information:'}
            </strong>{' '}
            {isRtl 
              ? 'ستتلقى تذكيرات تلقائية عبر البريد الإلكتروني قبل مواعيد استحقاق مدفوعاتك. يمكنك معاينة هذه التذكيرات أعلاه.'
              : 'You will receive automatic email reminders before your payment due dates. You can preview these reminders above.'
            }
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
};
