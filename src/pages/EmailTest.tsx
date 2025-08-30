import React from 'react';
import { EmailTestComponent } from '@/components/EmailTestComponent';
import { EmailSettings } from '@/components/EmailSettings';
import { ReminderManager } from '@/components/ReminderManager';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  TestTube, 
  Settings, 
  Bell, 
  Info,
  Mail,
  Clock,
  CheckCircle
} from 'lucide-react';

const EmailTest: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            نظام تذكيرات البريد الإلكتروني
          </h1>
          <p className="text-gray-600">
            إدارة وإعداد نظام التذكيرات التلقائي للقروض
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Mail className="h-6 w-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">النظام</p>
                  <p className="text-2xl font-bold text-gray-900">جاهز</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">القوالب</p>
                  <p className="text-2xl font-bold text-gray-900">3</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <Clock className="h-6 w-6 text-orange-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">التوقيت</p>
                  <p className="text-2xl font-bold text-gray-900">24س</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Bell className="h-6 w-6 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">المحاولات</p>
                  <p className="text-2xl font-bold text-gray-900">3</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="test" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="test" className="flex items-center gap-2">
              <TestTube className="h-4 w-4" />
              اختبار النظام
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              الإعدادات
            </TabsTrigger>
            <TabsTrigger value="reminders" className="flex items-center gap-2">
              <Bell className="h-4 w-4" />
              إدارة التذكيرات
            </TabsTrigger>
            <TabsTrigger value="info" className="flex items-center gap-2">
              <Info className="h-4 w-4" />
              معلومات النظام
            </TabsTrigger>
          </TabsList>

          <TabsContent value="test">
            <EmailTestComponent />
          </TabsContent>

          <TabsContent value="settings">
            <EmailSettings />
          </TabsContent>

          <TabsContent value="reminders">
            <ReminderManager />
          </TabsContent>

          <TabsContent value="info">
            <Card>
              <CardHeader>
                <CardTitle>معلومات نظام التذكيرات</CardTitle>
                <CardDescription>
                  نظرة عامة على نظام تذكيرات البريد الإلكتروني
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-3">الميزات المتاحة</h3>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        تذكيرات تلقائية للقروض
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        قوالب بريد إلكتروني احترافية
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        دعم اللغة العربية (RTL)
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        تصميم متجاوب لجميع الأجهزة
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        نظام إعادة المحاولة
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        إحصائيات مفصلة
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-3">أنواع التذكيرات</h3>
                    <div className="space-y-3">
                      <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                        <h4 className="font-medium text-green-900">تذكير قريب الاستحقاق</h4>
                        <p className="text-sm text-green-700">يرسل قبل 3 أيام من تاريخ الاستحقاق</p>
                      </div>
                      <div className="p-3 bg-orange-50 rounded-lg border border-orange-200">
                        <h4 className="font-medium text-orange-900">تذكير متأخر</h4>
                        <p className="text-sm text-orange-700">يرسل عند تأخير السداد</p>
                      </div>
                      <div className="p-3 bg-red-50 rounded-lg border border-red-200">
                        <h4 className="font-medium text-red-900">إشعار نهائي</h4>
                        <p className="text-sm text-red-700">يرسل بعد 7 أيام من التأخير</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <h4 className="font-medium text-blue-900 mb-2">خطوات التكوين</h4>
                  <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
                    <li>اختر خدمة البريد الإلكتروني (SendGrid, AWS SES, إلخ)</li>
                    <li>احصل على مفتاح API من الخدمة</li>
                    <li>أدخل الإعدادات في تبويب "الإعدادات"</li>
                    <li>اختبر النظام في تبويب "اختبار النظام"</li>
                    <li>فعّل التذكيرات التلقائية</li>
                  </ol>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default EmailTest;
