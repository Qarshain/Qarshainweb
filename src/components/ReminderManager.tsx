import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Bell, 
  Settings, 
  Play, 
  Pause, 
  Mail, 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  Calendar,
  User,
  DollarSign,
  Eye,
  Send
} from 'lucide-react';
import { 
  reminderScheduler, 
  createMockLoan, 
  formatReminderDate,
  type ReminderSchedule,
  type LoanRecord,
  type ReminderSettings
} from '@/lib/reminderScheduler';
import { emailService, type ReminderEmailData } from '@/lib/emailService';

export const ReminderManager: React.FC = () => {
  const [schedules, setSchedules] = useState<ReminderSchedule[]>([]);
  const [settings, setSettings] = useState<ReminderSettings>(reminderScheduler.getSettings());
  const [status, setStatus] = useState(reminderScheduler.getStatus());
  const [selectedLoan, setSelectedLoan] = useState<LoanRecord | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [previewData, setPreviewData] = useState<ReminderEmailData | null>(null);

  // Load data on component mount
  useEffect(() => {
    loadSchedules();
    loadStatus();
  }, []);

  const loadSchedules = () => {
    setSchedules(reminderScheduler.getSchedules());
  };

  const loadStatus = () => {
    setStatus(reminderScheduler.getStatus());
  };

  const handleStartScheduler = () => {
    reminderScheduler.start();
    loadStatus();
  };

  const handleStopScheduler = () => {
    reminderScheduler.stop();
    loadStatus();
  };

  const handleSettingsChange = (newSettings: Partial<ReminderSettings>) => {
    const updatedSettings = { ...settings, ...newSettings };
    setSettings(updatedSettings);
    reminderScheduler.updateSettings(newSettings);
  };

  const handleScheduleLoan = (loan: LoanRecord) => {
    reminderScheduler.scheduleLoanReminders(loan);
    loadSchedules();
    loadStatus();
  };

  const handlePreviewEmail = (schedule: ReminderSchedule) => {
    // Create mock email data for preview
    const emailData: ReminderEmailData = {
      borrowerName: 'أحمد محمد',
      borrowerEmail: 'ahmed@example.com',
      loanAmount: 50000,
      remainingAmount: 25000,
      dueDate: '2024-02-15',
      daysOverdue: schedule.type === 'overdue' ? 5 : undefined,
      loanId: schedule.loanId,
      paymentLink: `https://garshain.com/pay/${schedule.loanId}`,
    };
    
    setPreviewData(emailData);
    setIsPreviewOpen(true);
  };

  const handleSendTestEmail = async (schedule: ReminderSchedule) => {
    const emailData: ReminderEmailData = {
      borrowerName: 'أحمد محمد',
      borrowerEmail: 'test@example.com', // Use test email
      loanAmount: 50000,
      remainingAmount: 25000,
      dueDate: '2024-02-15',
      daysOverdue: schedule.type === 'overdue' ? 5 : undefined,
      loanId: schedule.loanId,
      paymentLink: `https://garshain.com/pay/${schedule.loanId}`,
    };

    const success = await emailService.sendReminderEmail(emailData, schedule.type);
    if (success) {
      alert('✅ Test email sent successfully!');
    } else {
      alert('❌ Failed to send test email');
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'sent':
        return <Badge variant="default" className="bg-green-500"><CheckCircle className="h-3 w-3 mr-1" />Sent</Badge>;
      case 'pending':
        return <Badge variant="secondary"><Clock className="h-3 w-3 mr-1" />Pending</Badge>;
      case 'failed':
        return <Badge variant="destructive"><XCircle className="h-3 w-3 mr-1" />Failed</Badge>;
      case 'cancelled':
        return <Badge variant="outline"><XCircle className="h-3 w-3 mr-1" />Cancelled</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getTypeBadge = (type: string) => {
    switch (type) {
      case 'upcoming':
        return <Badge variant="outline" className="border-blue-500 text-blue-500">Upcoming</Badge>;
      case 'overdue':
        return <Badge variant="outline" className="border-orange-500 text-orange-500">Overdue</Badge>;
      case 'final':
        return <Badge variant="outline" className="border-red-500 text-red-500">Final Notice</Badge>;
      default:
        return <Badge variant="outline">{type}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">إدارة تذكيرات السداد</h1>
          <p className="text-gray-600 mt-2">إدارة وإرسال تذكيرات السداد عبر البريد الإلكتروني</p>
        </div>
        <div className="flex items-center gap-3">
          {status.isRunning ? (
            <Button onClick={handleStopScheduler} variant="outline" className="text-orange-600 border-orange-600">
              <Pause className="h-4 w-4 mr-2" />
              إيقاف المخطط
            </Button>
          ) : (
            <Button onClick={handleStartScheduler} className="bg-green-600 hover:bg-green-700">
              <Play className="h-4 w-4 mr-2" />
              تشغيل المخطط
            </Button>
          )}
        </div>
      </div>

      {/* Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">حالة المخطط</CardTitle>
            <Bell className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {status.isRunning ? 'نشط' : 'متوقف'}
            </div>
            <p className="text-xs text-muted-foreground">
              {status.isRunning ? 'المخطط يعمل بشكل طبيعي' : 'المخطط متوقف'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">إجمالي التذكيرات</CardTitle>
            <Mail className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{status.scheduleCount}</div>
            <p className="text-xs text-muted-foreground">
              تذكير مجدول
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">التذكيرات المرسلة</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {schedules.filter(s => s.status === 'sent').length}
            </div>
            <p className="text-xs text-muted-foreground">
              تذكير تم إرساله
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="schedules" className="space-y-4">
        <TabsList>
          <TabsTrigger value="schedules">التذكيرات المجدولة</TabsTrigger>
          <TabsTrigger value="settings">الإعدادات</TabsTrigger>
          <TabsTrigger value="test">اختبار الإرسال</TabsTrigger>
        </TabsList>

        {/* Schedules Tab */}
        <TabsContent value="schedules" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>التذكيرات المجدولة</CardTitle>
              <CardDescription>
                عرض وإدارة جميع التذكيرات المجدولة
              </CardDescription>
            </CardHeader>
            <CardContent>
              {schedules.length === 0 ? (
                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    لا توجد تذكيرات مجدولة حالياً. قم بجدولة قرض جديد لبدء إرسال التذكيرات.
                  </AlertDescription>
                </Alert>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>رقم القرض</TableHead>
                      <TableHead>النوع</TableHead>
                      <TableHead>تاريخ الإرسال</TableHead>
                      <TableHead>الحالة</TableHead>
                      <TableHead>المحاولات</TableHead>
                      <TableHead>الإجراءات</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {schedules.map((schedule) => (
                      <TableRow key={schedule.id}>
                        <TableCell className="font-medium">#{schedule.loanId}</TableCell>
                        <TableCell>{getTypeBadge(schedule.type)}</TableCell>
                        <TableCell>{formatReminderDate(schedule.scheduledDate)}</TableCell>
                        <TableCell>{getStatusBadge(schedule.status)}</TableCell>
                        <TableCell>{schedule.attempts}/{schedule.maxAttempts}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handlePreviewEmail(schedule)}
                            >
                              <Eye className="h-3 w-3 mr-1" />
                              معاينة
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleSendTestEmail(schedule)}
                            >
                              <Send className="h-3 w-3 mr-1" />
                              اختبار
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Settings Tab */}
        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>إعدادات التذكيرات</CardTitle>
              <CardDescription>
                تخصيص إعدادات إرسال التذكيرات
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Enable/Disable Reminders */}
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="enable-reminders">تفعيل التذكيرات</Label>
                  <p className="text-sm text-muted-foreground">
                    تفعيل أو إيقاف نظام التذكيرات التلقائي
                  </p>
                </div>
                <Switch
                  id="enable-reminders"
                  checked={settings.enableReminders}
                  onCheckedChange={(checked) => handleSettingsChange({ enableReminders: checked })}
                />
              </div>

              {/* Upcoming Reminder Days */}
              <div className="space-y-2">
                <Label>أيام التذكير قبل الاستحقاق</Label>
                <p className="text-sm text-muted-foreground">
                  الأيام التي سيتم إرسال التذكيرات فيها قبل تاريخ الاستحقاق
                </p>
                <div className="flex gap-2">
                  {settings.upcomingReminderDays.map((day, index) => (
                    <Input
                      key={index}
                      type="number"
                      value={day}
                      onChange={(e) => {
                        const newDays = [...settings.upcomingReminderDays];
                        newDays[index] = parseInt(e.target.value) || 0;
                        handleSettingsChange({ upcomingReminderDays: newDays });
                      }}
                      className="w-20"
                    />
                  ))}
                </div>
              </div>

              {/* Overdue Reminder Days */}
              <div className="space-y-2">
                <Label>أيام التذكير بعد الاستحقاق</Label>
                <p className="text-sm text-muted-foreground">
                  الأيام التي سيتم إرسال التذكيرات فيها بعد تاريخ الاستحقاق
                </p>
                <div className="flex gap-2">
                  {settings.overdueReminderDays.map((day, index) => (
                    <Input
                      key={index}
                      type="number"
                      value={day}
                      onChange={(e) => {
                        const newDays = [...settings.overdueReminderDays];
                        newDays[index] = parseInt(e.target.value) || 0;
                        handleSettingsChange({ overdueReminderDays: newDays });
                      }}
                      className="w-20"
                    />
                  ))}
                </div>
              </div>

              {/* Final Notice Days */}
              <div className="space-y-2">
                <Label htmlFor="final-notice-days">أيام الإشعار النهائي</Label>
                <p className="text-sm text-muted-foreground">
                  عدد الأيام بعد الاستحقاق لإرسال الإشعار النهائي
                </p>
                <Input
                  id="final-notice-days"
                  type="number"
                  value={settings.finalNoticeDays}
                  onChange={(e) => handleSettingsChange({ finalNoticeDays: parseInt(e.target.value) || 30 })}
                  className="w-32"
                />
              </div>

              {/* Reminder Interval */}
              <div className="space-y-2">
                <Label htmlFor="reminder-interval">فترة فحص التذكيرات (ساعات)</Label>
                <p className="text-sm text-muted-foreground">
                  عدد الساعات بين فحص التذكيرات المجدولة
                </p>
                <Input
                  id="reminder-interval"
                  type="number"
                  value={settings.reminderIntervalHours}
                  onChange={(e) => handleSettingsChange({ reminderIntervalHours: parseInt(e.target.value) || 24 })}
                  className="w-32"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Test Tab */}
        <TabsContent value="test" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>اختبار إرسال التذكيرات</CardTitle>
              <CardDescription>
                اختبار إرسال التذكيرات مع بيانات وهمية
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button
                  onClick={() => {
                    const mockLoan = createMockLoan();
                    handleScheduleLoan(mockLoan);
                  }}
                  className="h-20 flex flex-col items-center justify-center"
                >
                  <Calendar className="h-6 w-6 mb-2" />
                  جدولة قرض جديد
                </Button>
                
                <Button
                  onClick={() => {
                    const mockLoan = createMockLoan({
                      dueDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] // 5 days ago
                    });
                    handleScheduleLoan(mockLoan);
                  }}
                  variant="outline"
                  className="h-20 flex flex-col items-center justify-center"
                >
                  <AlertTriangle className="h-6 w-6 mb-2" />
                  قرض متأخر
                </Button>
                
                <Button
                  onClick={() => {
                    const mockLoan = createMockLoan({
                      dueDate: new Date(Date.now() - 35 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] // 35 days ago
                    });
                    handleScheduleLoan(mockLoan);
                  }}
                  variant="destructive"
                  className="h-20 flex flex-col items-center justify-center"
                >
                  <XCircle className="h-6 w-6 mb-2" />
                  قرض متأخر جداً
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Email Preview Dialog */}
      <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>معاينة البريد الإلكتروني</DialogTitle>
            <DialogDescription>
              معاينة تذكير السداد قبل الإرسال
            </DialogDescription>
          </DialogHeader>
          {previewData && (
            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium mb-2">بيانات التذكير:</h4>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div><strong>اسم المقترض:</strong> {previewData.borrowerName}</div>
                  <div><strong>البريد الإلكتروني:</strong> {previewData.borrowerEmail}</div>
                  <div><strong>رقم القرض:</strong> #{previewData.loanId}</div>
                  <div><strong>المبلغ المتبقي:</strong> {previewData.remainingAmount.toLocaleString('ar-SA')} ر.س</div>
                  <div><strong>تاريخ الاستحقاق:</strong> {new Date(previewData.dueDate).toLocaleDateString('ar-SA')}</div>
                  {previewData.daysOverdue && (
                    <div><strong>أيام التأخير:</strong> {previewData.daysOverdue} يوم</div>
                  )}
                </div>
              </div>
              
              <div className="border rounded-lg p-4">
                <h4 className="font-medium mb-2">معاينة المحتوى:</h4>
                <div 
                  className="prose max-w-none"
                  dangerouslySetInnerHTML={{ 
                    __html: emailService.generateReminderEmail(previewData, 'upcoming').html 
                  }}
                />
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};
