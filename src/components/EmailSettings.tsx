import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Mail, 
  Settings, 
  TestTube, 
  Save, 
  RefreshCw, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  Info,
  Send,
  Clock,
  Bell,
  Shield
} from 'lucide-react';
import { emailService, emailConfig } from '@/lib/emailService';
import { reminderScheduler } from '@/lib/reminderScheduler';
import { loanReminderIntegration } from '@/lib/loanReminderIntegration';

export interface EmailSettings {
  // Email Service Configuration
  apiKey: string;
  serviceUrl: string;
  fromEmail: string;
  fromName: string;
  replyTo: string;
  
  // Reminder Settings
  enableReminders: boolean;
  checkInterval: number; // hours
  maxAttempts: number;
  
  // Template Settings
  companyName: string;
  supportEmail: string;
  supportPhone: string;
  websiteUrl: string;
  
  // Advanced Settings
  enableDebugMode: boolean;
  enableTestMode: boolean;
  backupEmail: string;
}

export const EmailSettings: React.FC = () => {
  const [settings, setSettings] = useState<EmailSettings>({
    apiKey: emailConfig.apiKey || '',
    serviceUrl: emailConfig.serviceUrl || '',
    fromEmail: emailConfig.fromEmail || 'noreply@garshain.com',
    fromName: emailConfig.fromName || 'قرشين - منصة الإقراض الرقمي',
    replyTo: emailConfig.replyTo || 'support@garshain.com',
    enableReminders: true,
    checkInterval: 24,
    maxAttempts: 3,
    companyName: 'قرشين',
    supportEmail: 'support@garshain.com',
    supportPhone: '+966 11 123 4567',
    websiteUrl: 'https://garshain.com',
    enableDebugMode: false,
    enableTestMode: false,
    backupEmail: 'admin@garshain.com',
  });

  const [isSaving, setIsSaving] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);
  const [stats, setStats] = useState(loanReminderIntegration.getReminderStats());

  // Load settings from localStorage on mount
  useEffect(() => {
    const savedSettings = localStorage.getItem('garshain-email-settings');
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings);
        setSettings(prev => ({ ...prev, ...parsed }));
      } catch (error) {
        console.error('Error loading email settings:', error);
      }
    }
  }, []);

  // Update stats periodically
  useEffect(() => {
    const interval = setInterval(() => {
      setStats(loanReminderIntegration.getReminderStats());
    }, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, []);

  const handleSettingChange = (key: keyof EmailSettings, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleSaveSettings = async () => {
    setIsSaving(true);
    try {
      // Save to localStorage
      localStorage.setItem('garshain-email-settings', JSON.stringify(settings));
      
      // Update email service config
      emailConfig.apiKey = settings.apiKey;
      emailConfig.serviceUrl = settings.serviceUrl;
      emailConfig.fromEmail = settings.fromEmail;
      emailConfig.fromName = settings.fromName;
      emailConfig.replyTo = settings.replyTo;

      // Update reminder scheduler settings
      reminderScheduler.updateSettings({
        enableReminders: settings.enableReminders,
        reminderIntervalHours: settings.checkInterval,
        maxRemindersPerType: settings.maxAttempts,
      });

      console.log('✅ Email settings saved successfully');
      alert('تم حفظ الإعدادات بنجاح');
    } catch (error) {
      console.error('❌ Error saving email settings:', error);
      alert('حدث خطأ في حفظ الإعدادات');
    } finally {
      setIsSaving(false);
    }
  };

  const handleTestEmail = async () => {
    setIsTesting(true);
    setTestResult(null);

    try {
      const testData = {
        borrowerName: 'أحمد محمد (اختبار)',
        borrowerEmail: settings.backupEmail,
        loanAmount: 50000,
        remainingAmount: 25000,
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        loanId: 'TEST-' + Date.now(),
        paymentLink: 'https://garshain.com/pay/test',
      };

      const success = await emailService.sendReminderEmail(testData, 'upcoming');
      
      if (success) {
        setTestResult({
          success: true,
          message: 'تم إرسال البريد الإلكتروني التجريبي بنجاح! تحقق من صندوق الوارد.'
        });
      } else {
        setTestResult({
          success: false,
          message: 'فشل في إرسال البريد الإلكتروني التجريبي. تحقق من إعدادات الخدمة.'
        });
      }
    } catch (error) {
      setTestResult({
        success: false,
        message: `خطأ في إرسال البريد الإلكتروني: ${error.message}`
      });
    } finally {
      setIsTesting(false);
    }
  };

  const handleResetSettings = () => {
    if (confirm('هل أنت متأكد من إعادة تعيين جميع الإعدادات إلى القيم الافتراضية؟')) {
      setSettings({
        apiKey: '',
        serviceUrl: '',
        fromEmail: 'noreply@garshain.com',
        fromName: 'قرشين - منصة الإقراض الرقمي',
        replyTo: 'support@garshain.com',
        enableReminders: true,
        checkInterval: 24,
        maxAttempts: 3,
        companyName: 'قرشين',
        supportEmail: 'support@garshain.com',
        supportPhone: '+966 11 123 4567',
        websiteUrl: 'https://garshain.com',
        enableDebugMode: false,
        enableTestMode: false,
        backupEmail: 'admin@garshain.com',
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">إعدادات البريد الإلكتروني</h1>
          <p className="text-gray-600 mt-2">إدارة إعدادات إرسال تذكيرات السداد</p>
        </div>
        <div className="flex items-center gap-3">
          <Button onClick={handleSaveSettings} disabled={isSaving}>
            {isSaving ? <RefreshCw className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
            حفظ الإعدادات
          </Button>
          <Button onClick={handleResetSettings} variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            إعادة تعيين
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">القروض النشطة</CardTitle>
            <Bell className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalActiveLoans}</div>
            <p className="text-xs text-muted-foreground">قرض نشط</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">القروض المتأخرة</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{stats.overdueLoans}</div>
            <p className="text-xs text-muted-foreground">قرض متأخر</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">التذكيرات اليوم</CardTitle>
            <Send className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.remindersSentToday}</div>
            <p className="text-xs text-muted-foreground">تذكير مرسل</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">متوسط التأخير</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.averageDaysOverdue}</div>
            <p className="text-xs text-muted-foreground">يوم</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Settings */}
      <Tabs defaultValue="service" className="space-y-4">
        <TabsList>
          <TabsTrigger value="service">خدمة البريد الإلكتروني</TabsTrigger>
          <TabsTrigger value="reminders">إعدادات التذكيرات</TabsTrigger>
          <TabsTrigger value="templates">قوالب البريد</TabsTrigger>
          <TabsTrigger value="test">اختبار الإرسال</TabsTrigger>
        </TabsList>

        {/* Email Service Tab */}
        <TabsContent value="service" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>إعدادات خدمة البريد الإلكتروني</CardTitle>
              <CardDescription>
                تكوين خدمة البريد الإلكتروني لإرسال التذكيرات
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="api-key">مفتاح API</Label>
                  <Input
                    id="api-key"
                    type="password"
                    value={settings.apiKey}
                    onChange={(e) => handleSettingChange('apiKey', e.target.value)}
                    placeholder="أدخل مفتاح API الخاص بخدمة البريد الإلكتروني"
                  />
                  <p className="text-sm text-muted-foreground">
                    مفتاح API الخاص بخدمة البريد الإلكتروني (SendGrid, AWS SES, إلخ)
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="service-url">رابط الخدمة</Label>
                  <Input
                    id="service-url"
                    value={settings.serviceUrl}
                    onChange={(e) => handleSettingChange('serviceUrl', e.target.value)}
                    placeholder="https://api.emailservice.com"
                  />
                  <p className="text-sm text-muted-foreground">
                    رابط API الخاص بخدمة البريد الإلكتروني
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="from-email">البريد الإلكتروني المرسل</Label>
                  <Input
                    id="from-email"
                    type="email"
                    value={settings.fromEmail}
                    onChange={(e) => handleSettingChange('fromEmail', e.target.value)}
                    placeholder="noreply@garshain.com"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="from-name">اسم المرسل</Label>
                  <Input
                    id="from-name"
                    value={settings.fromName}
                    onChange={(e) => handleSettingChange('fromName', e.target.value)}
                    placeholder="قرشين - منصة الإقراض الرقمي"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="reply-to">البريد الإلكتروني للرد</Label>
                  <Input
                    id="reply-to"
                    type="email"
                    value={settings.replyTo}
                    onChange={(e) => handleSettingChange('replyTo', e.target.value)}
                    placeholder="support@garshain.com"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="backup-email">البريد الإلكتروني الاحتياطي</Label>
                  <Input
                    id="backup-email"
                    type="email"
                    value={settings.backupEmail}
                    onChange={(e) => handleSettingChange('backupEmail', e.target.value)}
                    placeholder="admin@garshain.com"
                  />
                  <p className="text-sm text-muted-foreground">
                    البريد الإلكتروني لإرسال الاختبارات والإشعارات الإدارية
                  </p>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">الإعدادات المتقدمة</h3>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="debug-mode">وضع التصحيح</Label>
                    <p className="text-sm text-muted-foreground">
                      تفعيل وضع التصحيح لطباعة معلومات مفصلة في وحدة التحكم
                    </p>
                  </div>
                  <Switch
                    id="debug-mode"
                    checked={settings.enableDebugMode}
                    onCheckedChange={(checked) => handleSettingChange('enableDebugMode', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="test-mode">وضع الاختبار</Label>
                    <p className="text-sm text-muted-foreground">
                      إرسال جميع الرسائل إلى البريد الإلكتروني الاحتياطي فقط
                    </p>
                  </div>
                  <Switch
                    id="test-mode"
                    checked={settings.enableTestMode}
                    onCheckedChange={(checked) => handleSettingChange('enableTestMode', checked)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Reminders Tab */}
        <TabsContent value="reminders" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>إعدادات التذكيرات</CardTitle>
              <CardDescription>
                تخصيص توقيت وتكرار إرسال تذكيرات السداد
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
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
                  onCheckedChange={(checked) => handleSettingChange('enableReminders', checked)}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="check-interval">فترة فحص التذكيرات (ساعات)</Label>
                  <Input
                    id="check-interval"
                    type="number"
                    min="1"
                    max="168"
                    value={settings.checkInterval}
                    onChange={(e) => handleSettingChange('checkInterval', parseInt(e.target.value) || 24)}
                  />
                  <p className="text-sm text-muted-foreground">
                    عدد الساعات بين فحص التذكيرات المجدولة (1-168 ساعة)
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="max-attempts">الحد الأقصى للمحاولات</Label>
                  <Input
                    id="max-attempts"
                    type="number"
                    min="1"
                    max="10"
                    value={settings.maxAttempts}
                    onChange={(e) => handleSettingChange('maxAttempts', parseInt(e.target.value) || 3)}
                  />
                  <p className="text-sm text-muted-foreground">
                    الحد الأقصى لعدد محاولات إرسال التذكير
                  </p>
                </div>
              </div>

              <Alert>
                <Info className="h-4 w-4" />
                <AlertDescription>
                  <strong>ملاحظة:</strong> التغييرات في هذه الإعدادات ستؤثر على جميع التذكيرات الجديدة. 
                  التذكيرات المجدولة مسبقاً ستحتفظ بإعداداتها الحالية.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Templates Tab */}
        <TabsContent value="templates" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>إعدادات القوالب</CardTitle>
              <CardDescription>
                تخصيص معلومات الشركة وعناصر الاتصال في قوالب البريد الإلكتروني
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="company-name">اسم الشركة</Label>
                  <Input
                    id="company-name"
                    value={settings.companyName}
                    onChange={(e) => handleSettingChange('companyName', e.target.value)}
                    placeholder="قرشين"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="website-url">رابط الموقع</Label>
                  <Input
                    id="website-url"
                    value={settings.websiteUrl}
                    onChange={(e) => handleSettingChange('websiteUrl', e.target.value)}
                    placeholder="https://garshain.com"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="support-email">بريد الدعم</Label>
                  <Input
                    id="support-email"
                    type="email"
                    value={settings.supportEmail}
                    onChange={(e) => handleSettingChange('supportEmail', e.target.value)}
                    placeholder="support@garshain.com"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="support-phone">هاتف الدعم</Label>
                  <Input
                    id="support-phone"
                    value={settings.supportPhone}
                    onChange={(e) => handleSettingChange('supportPhone', e.target.value)}
                    placeholder="+966 11 123 4567"
                  />
                </div>
              </div>

              <Alert>
                <Shield className="h-4 w-4" />
                <AlertDescription>
                  <strong>معلومات مهمة:</strong> هذه المعلومات ستظهر في جميع رسائل البريد الإلكتروني 
                  المرسلة للمقترضين. تأكد من صحة المعلومات قبل الحفظ.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Test Tab */}
        <TabsContent value="test" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>اختبار إرسال البريد الإلكتروني</CardTitle>
              <CardDescription>
                اختبار إعدادات البريد الإلكتروني بإرسال رسالة تجريبية
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-medium text-blue-900 mb-2">معلومات الاختبار</h4>
                  <div className="text-sm text-blue-800 space-y-1">
                    <p><strong>نوع الرسالة:</strong> تذكير بالدفع (قريب الاستحقاق)</p>
                    <p><strong>المستقبل:</strong> {settings.backupEmail}</p>
                    <p><strong>المرسل:</strong> {settings.fromEmail}</p>
                    <p><strong>اسم المرسل:</strong> {settings.fromName}</p>
                  </div>
                </div>

                <Button 
                  onClick={handleTestEmail} 
                  disabled={isTesting || !settings.apiKey}
                  className="w-full"
                >
                  {isTesting ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      جاري الإرسال...
                    </>
                  ) : (
                    <>
                      <TestTube className="h-4 w-4 mr-2" />
                      إرسال بريد إلكتروني تجريبي
                    </>
                  )}
                </Button>

                {!settings.apiKey && (
                  <Alert>
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>
                      يجب إدخال مفتاح API في تبويب "خدمة البريد الإلكتروني" قبل إجراء الاختبار.
                    </AlertDescription>
                  </Alert>
                )}

                {testResult && (
                  <Alert className={testResult.success ? 'border-green-500 bg-green-50' : 'border-red-500 bg-red-50'}>
                    {testResult.success ? (
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    ) : (
                      <XCircle className="h-4 w-4 text-red-600" />
                    )}
                    <AlertDescription className={testResult.success ? 'text-green-800' : 'text-red-800'}>
                      {testResult.message}
                    </AlertDescription>
                  </Alert>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
