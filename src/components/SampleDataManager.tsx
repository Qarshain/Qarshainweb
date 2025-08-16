import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Database, Plus, Trash2, CheckCircle, AlertTriangle } from 'lucide-react';
import { populateSampleData, clearSampleData, sampleLoanRequests } from '@/lib/sampleData';
import { useLanguage } from '@/contexts/LanguageContext';

const SampleDataManager: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const { language } = useLanguage();
  const isAr = language === 'ar';

  const handlePopulateData = async () => {
    setLoading(true);
    setMessage(null);
    
    try {
      const success = await populateSampleData();
      if (success) {
        setMessage({
          type: 'success',
          text: isAr 
            ? 'تم إضافة البيانات التجريبية بنجاح! يمكنك الآن رؤية فرص الاستثمار في صفحة الاستثمار.'
            : 'Sample data added successfully! You can now see investment opportunities on the invest page.'
        });
      } else {
        setMessage({
          type: 'error',
          text: isAr 
            ? 'حدث خطأ أثناء إضافة البيانات التجريبية'
            : 'Error occurred while adding sample data'
        });
      }
    } catch (error) {
      setMessage({
        type: 'error',
        text: isAr 
          ? 'حدث خطأ غير متوقع'
          : 'An unexpected error occurred'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleClearData = async () => {
    setLoading(true);
    setMessage(null);
    
    try {
      const success = await clearSampleData();
      if (success) {
        setMessage({
          type: 'success',
          text: isAr 
            ? 'تم طلب مسح البيانات التجريبية'
            : 'Sample data clear request submitted'
        });
      } else {
        setMessage({
          type: 'error',
          text: isAr 
            ? 'حدث خطأ أثناء محاولة مسح البيانات'
            : 'Error occurred while trying to clear data'
        });
      }
    } catch (error) {
      setMessage({
        type: 'error',
        text: isAr 
          ? 'حدث خطأ غير متوقع'
          : 'An unexpected error occurred'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="h-5 w-5" />
          {isAr ? "إدارة البيانات التجريبية" : "Sample Data Manager"}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="text-sm text-muted-foreground">
          {isAr 
            ? "هذا المكون يسمح للمسؤولين بإضافة بيانات تجريبية للاختبار. سيتم إنشاء طلبات قروض تجريبية تظهر كفرص استثمارية."
            : "This component allows administrators to add sample data for testing. Sample loan requests will be created that appear as investment opportunities."
          }
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <h4 className="font-medium">{isAr ? "البيانات المتاحة" : "Available Data"}</h4>
            <div className="space-y-1 text-sm">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>{sampleLoanRequests.length} {isAr ? "طلب قرض" : "loan requests"}</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>{isAr ? "مستويات مخاطر مختلفة" : "Different risk levels"}</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>{isAr ? "فئات متنوعة" : "Various categories"}</span>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="font-medium">{isAr ? "تفاصيل القروض" : "Loan Details"}</h4>
            <div className="space-y-1 text-sm text-muted-foreground">
              <div>SAR 800 - SAR 5,000</div>
              <div>2 - 12 {isAr ? "أشهر" : "months"}</div>
              <div>{isAr ? "معدلات فائدة 8-12%" : "8-12% interest rates"}</div>
            </div>
          </div>
        </div>

        {message && (
          <Alert className={message.type === 'success' ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}>
            {message.type === 'success' ? (
              <CheckCircle className="h-4 w-4 text-green-600" />
            ) : (
              <AlertTriangle className="h-4 w-4 text-red-600" />
            )}
            <AlertDescription className={message.type === 'success' ? 'text-green-800' : 'text-red-800'}>
              {message.text}
            </AlertDescription>
          </Alert>
        )}

        <div className="flex gap-3">
          <Button 
            onClick={handlePopulateData} 
            disabled={loading}
            className="flex-1 bg-green-600 hover:bg-green-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            {loading 
              ? (isAr ? "جاري الإضافة..." : "Adding...")
              : (isAr ? "إضافة بيانات تجريبية" : "Add Sample Data")
            }
          </Button>
          
          <Button 
            onClick={handleClearData} 
            disabled={loading}
            variant="outline"
            className="flex-1 border-red-200 text-red-700 hover:bg-red-50"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            {isAr ? "مسح البيانات" : "Clear Data"}
          </Button>
        </div>

        <div className="text-xs text-muted-foreground text-center">
          {isAr 
            ? "ملاحظة: البيانات التجريبية مخصصة للاختبار فقط. في الإنتاج، سيتم إنشاء طلبات قروض حقيقية من المستخدمين."
            : "Note: Sample data is for testing purposes only. In production, real loan requests will be created by users."
          }
        </div>
      </CardContent>
    </Card>
  );
};

export default SampleDataManager;
