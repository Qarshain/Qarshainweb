import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { 
  Mail, 
  TestTube, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  Eye,
  EyeOff
} from 'lucide-react';
import { emailService } from '@/lib/emailService';

export const EmailTestComponent: React.FC = () => {
  const [testEmail, setTestEmail] = useState('test@example.com');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<{ success: boolean; message: string; emailPreview?: any } | null>(null);
  const [showPreview, setShowPreview] = useState(false);

  const handleTestEmail = async () => {
    setIsLoading(true);
    setResult(null);

    try {
      // Create test data
      const testData = {
        borrowerName: 'أحمد محمد (اختبار)',
        borrowerEmail: testEmail,
        loanAmount: 50000,
        remainingAmount: 25000,
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        loanId: 'TEST-' + Date.now(),
        paymentLink: 'https://garshain.com/pay/test',
        daysOverdue: 0
      };

      // Generate email template (without sending)
      const template = emailService.generateReminderEmail(testData, 'upcoming');
      
      setResult({
        success: true,
        message: 'تم إنشاء قالب البريد الإلكتروني بنجاح! يمكنك معاينة المحتوى أدناه.',
        emailPreview: {
          subject: template.subject,
          html: template.html,
          text: template.text
        }
      });

    } catch (error: any) {
      setResult({
        success: false,
        message: `خطأ في إنشاء قالب البريد الإلكتروني: ${error.message}`
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendTestEmail = async () => {
    setIsLoading(true);
    setResult(null);

    try {
      const testData = {
        borrowerName: 'أحمد محمد (اختبار)',
        borrowerEmail: testEmail,
        loanAmount: 50000,
        remainingAmount: 25000,
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        loanId: 'TEST-' + Date.now(),
        paymentLink: 'https://garshain.com/pay/test',
        daysOverdue: 0
      };

      const success = await emailService.sendReminderEmail(testData, 'upcoming');
      
      if (success) {
        setResult({
          success: true,
          message: 'تم إرسال البريد الإلكتروني التجريبي بنجاح! تحقق من صندوق الوارد.'
        });
      } else {
        setResult({
          success: false,
          message: 'فشل في إرسال البريد الإلكتروني. تحقق من إعدادات الخدمة.'
        });
      }
    } catch (error: any) {
      setResult({
        success: false,
        message: `خطأ في إرسال البريد الإلكتروني: ${error.message}`
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TestTube className="h-5 w-5" />
            اختبار نظام البريد الإلكتروني
          </CardTitle>
          <CardDescription>
            اختبر قوالب البريد الإلكتروني وإعدادات الإرسال
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Test Email Input */}
          <div className="space-y-2">
            <Label htmlFor="test-email">البريد الإلكتروني للاختبار</Label>
            <Input
              id="test-email"
              type="email"
              value={testEmail}
              onChange={(e) => setTestEmail(e.target.value)}
              placeholder="test@example.com"
            />
            <p className="text-sm text-muted-foreground">
              أدخل البريد الإلكتروني الذي تريد إرسال الاختبار إليه
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button 
              onClick={handleTestEmail} 
              disabled={isLoading}
              variant="outline"
            >
              {isLoading ? (
                <>
                  <TestTube className="h-4 w-4 mr-2 animate-spin" />
                  جاري المعالجة...
                </>
              ) : (
                <>
                  <Eye className="h-4 w-4 mr-2" />
                  معاينة القالب
                </>
              )}
            </Button>

            <Button 
              onClick={handleSendTestEmail} 
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Mail className="h-4 w-4 mr-2 animate-spin" />
                  جاري الإرسال...
                </>
              ) : (
                <>
                  <Mail className="h-4 w-4 mr-2" />
                  إرسال اختبار
                </>
              )}
            </Button>
          </div>

          {/* Result Display */}
          {result && (
            <Alert className={result.success ? 'border-green-500 bg-green-50' : 'border-red-500 bg-red-50'}>
              {result.success ? (
                <CheckCircle className="h-4 w-4 text-green-600" />
              ) : (
                <XCircle className="h-4 w-4 text-red-600" />
              )}
              <AlertDescription className={result.success ? 'text-green-800' : 'text-red-800'}>
                {result.message}
              </AlertDescription>
            </Alert>
          )}

          {/* Email Preview */}
          {result?.success && result.emailPreview && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>معاينة البريد الإلكتروني</span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowPreview(!showPreview)}
                  >
                    {showPreview ? (
                      <>
                        <EyeOff className="h-4 w-4 mr-2" />
                        إخفاء
                      </>
                    ) : (
                      <>
                        <Eye className="h-4 w-4 mr-2" />
                        عرض
                      </>
                    )}
                  </Button>
                </CardTitle>
              </CardHeader>
              {showPreview && (
                <CardContent className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium">الموضوع:</Label>
                    <p className="text-sm text-muted-foreground mt-1">{result.emailPreview.subject}</p>
                  </div>
                  
                  <div>
                    <Label className="text-sm font-medium">المحتوى (HTML):</Label>
                    <div className="mt-2 p-4 bg-gray-50 rounded-lg max-h-96 overflow-auto">
                      <div dangerouslySetInnerHTML={{ __html: result.emailPreview.html }} />
                    </div>
                  </div>
                  
                  <div>
                    <Label className="text-sm font-medium">المحتوى (نص عادي):</Label>
                    <div className="mt-2 p-4 bg-gray-50 rounded-lg max-h-32 overflow-auto">
                      <pre className="text-sm whitespace-pre-wrap">{result.emailPreview.text}</pre>
                    </div>
                  </div>
                </CardContent>
              )}
            </Card>
          )}

          {/* Information Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="outline" className="bg-green-50 text-green-700">
                    قريب الاستحقاق
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  تذكير ودود قبل 3 أيام من الاستحقاق
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="outline" className="bg-orange-50 text-orange-700">
                    متأخر
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  تحذير عند تأخير السداد
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="outline" className="bg-red-50 text-red-700">
                    إشعار نهائي
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  إشعار نهائي بعد 7 أيام تأخير
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Configuration Status */}
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              <strong>ملاحظة:</strong> هذا الاختبار يعرض قوالب البريد الإلكتروني فقط. 
              لإرسال رسائل حقيقية، تحتاج إلى تكوين خدمة بريد إلكتروني مثل SendGrid أو AWS SES.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    </div>
  );
};
