import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Calendar, 
  User, 
  Tag, 
  Share2, 
  ArrowRight,
  TrendingUp,
  Shield,
  Clock,
  CheckCircle,
  AlertTriangle,
  Bell,
  BookOpen,
  Target,
  Zap
} from 'lucide-react';

export const BlogPostArabic: React.FC = () => {
  return (
    <article className="max-w-4xl mx-auto px-6 py-12" dir="rtl">
      {/* Article Header */}
      <header className="mb-16 text-center">
        <div className="mb-8">
          <div className="flex items-center justify-center gap-3 mb-6">
            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 px-4 py-2">
              <BookOpen className="h-4 w-4 ml-2" />
              دليل التكنولوجيا المالية
            </Badge>
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 px-4 py-2">
              <Target className="h-4 w-4 ml-2" />
              الإقراض من نظير إلى نظير
            </Badge>
            <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200 px-4 py-2">
              <Zap className="h-4 w-4 ml-2" />
              المملكة العربية السعودية
            </Badge>
          </div>
          
          <h1 className="text-5xl font-bold text-gray-900 mb-6 leading-tight">
            كيف يعمل الإقراض من نظير إلى نظير: دليل شامل للمملكة العربية السعودية
          </h1>
          
          <p className="text-xl text-gray-600 leading-relaxed mb-8 max-w-3xl mx-auto">
            اكتشف كيف يحول الإقراض من نظير إلى نظير المشهد المالي في المملكة العربية السعودية. تعلم الأساسيات والمزايا وكيف تجعل منصات مثل قرشين الإقراض أكثر سهولة وربحية للجميع.
          </p>
          
          <div className="flex items-center justify-center gap-8 text-sm text-gray-500 mb-8">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>15 ديسمبر 2024</span>
            </div>
            <div className="flex items-center gap-2">
              <User className="h-4 w-4" />
              <span>فريق قرشين</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span>6 دقائق قراءة</span>
            </div>
          </div>
        </div>
        
        {/* Featured Image */}
        <div className="w-full h-80 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-2xl mb-12 flex items-center justify-center border border-gray-200">
          <div className="text-center">
            <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <TrendingUp className="h-10 w-10 text-blue-600" />
            </div>
            <p className="text-gray-600 font-medium">منصة الإقراض من نظير إلى نظير</p>
          </div>
        </div>
      </header>

      {/* Article Content */}
      <div className="prose prose-lg max-w-none">
        
        {/* Introduction */}
      <section className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">ما هو الإقراض من نظير إلى نظير؟</h2>
          <p className="text-lg text-gray-700 leading-relaxed mb-6">
            الإقراض من نظير إلى نظير (P2P) هو نموذج مالي ثوري يربط المقترضين مباشرة بالمقرضين عبر المنصات الرقمية، مما يلغي البنوك التقليدية كوسطاء. في المملكة العربية السعودية، يكتسب هذا النهج المبتكر زخماً كجزء من أهداف التحول الرقمي في رؤية 2030.
          </p>
          <p className="text-lg text-gray-700 leading-relaxed mb-6">
            بدلاً من المرور عبر عمليات البنوك الطويلة، يمكن للأفراد والشركات الآن الوصول إلى التمويل مباشرة من أفراد أو مؤسسات آخرين يريدون استثمار أموالهم للحصول على عوائد أفضل. هذا يخلق وضعاً مربحاً للطرفين.
          </p>
          
          <div className="bg-blue-50 border-r-4 border-blue-500 p-6 my-8 rounded-l-lg">
            <h3 className="text-xl font-bold text-blue-900 mb-3 flex items-center gap-2">
              <Shield className="h-5 w-5" />
              الامتثال للشريعة الإسلامية
          </h3>
            <p className="text-blue-800">
              جميع عمليات الإقراض من نظير إلى نظير على قرشين تتبع مبادئ التمويل الإسلامي، مما يضمن عدم فرض أي فائدة (ربا). بدلاً من ذلك، نستخدم نماذج المشاركة في الأرباح المتوافقة بالكامل مع الشريعة الإسلامية.
          </p>
        </div>
      </section>

        {/* How It Works */}
      <section className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">كيف يعمل الإقراض من نظير إلى نظير</h2>
          
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <Card className="p-6 border-2 border-green-200 bg-green-50">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                    <User className="h-5 w-5 text-white" />
        </div>
                  <CardTitle className="text-xl text-green-900">للمقترضين</CardTitle>
              </div>
              </CardHeader>
              <CardContent>
                <ol className="space-y-3 text-green-800">
                  <li className="flex items-start gap-3">
                    <span className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-bold">1</span>
                    <span>تقديم طلب القرض مع الوثائق المطلوبة</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-bold">2</span>
                    <span>الحصول على التحقق وتقييم المخاطر</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-bold">3</span>
                    <span>يقوم المقرضون بتمويل طلب القرض</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-bold">4</span>
                    <span>استلام الأموال وبدء السداد</span>
                  </li>
                </ol>
              </CardContent>
            </Card>

            <Card className="p-6 border-2 border-blue-200 bg-blue-50">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                    <TrendingUp className="h-5 w-5 text-white" />
            </div>
                  <CardTitle className="text-xl text-blue-900">للمقرضين</CardTitle>
          </div>
              </CardHeader>
              <CardContent>
                <ol className="space-y-3 text-blue-800">
                  <li className="flex items-start gap-3">
                    <span className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">1</span>
                    <span>تصفح فرص القروض المعتمدة</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">2</span>
                    <span>مراجعة ملفات المقترضين وتقييمات المخاطر</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">3</span>
                    <span>اختيار القروض التي تطابق ملف المخاطر</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">4</span>
                    <span>كسب العوائد من خلال المشاركة في الأرباح</span>
                  </li>
                </ol>
              </CardContent>
            </Card>
        </div>
      </section>

        {/* Benefits */}
      <section className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">لماذا تختار الإقراض من نظير إلى نظير؟</h2>
          
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="p-6 text-center hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="h-8 w-8 text-green-600" />
          </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">وصول أسرع</h3>
              <p className="text-gray-600">احصل على التمويل في أيام، وليس أسابيع. لا توجد إجراءات بنكية طويلة أو تأخيرات في الأوراق.</p>
            </Card>

            <Card className="p-6 text-center hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="h-8 w-8 text-blue-600" />
          </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">عوائد أفضل</h3>
              <p className="text-gray-600">اكسب عوائد أعلى من حسابات التوفير التقليدية مع دعم الشركات المحلية.</p>
            </Card>

            <Card className="p-6 text-center hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-purple-600" />
          </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">شفاف وآمن</h3>
              <p className="text-gray-600">شفافية كاملة مع تقييمات مخاطر شاملة ومعاملات آمنة.</p>
            </Card>
        </div>
      </section>

        {/* Getting Started */}
      <section className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">البدء مع قرشين</h2>
          
          <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">مستعد لبدء رحلة الإقراض من نظير إلى نظير؟</h3>
            <p className="text-lg text-gray-700 mb-6">
              سواء كنت تبحث عن الاقتراض للاحتياجات الشخصية أو التجارية، أو تريد استثمار أموالك للحصول على عوائد أفضل، يوفر قرشين منصة آمنة ومتوافقة مع الشريعة للإقراض من نظير إلى نظير في المملكة العربية السعودية.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="bg-green-600 hover:bg-green-700" asChild>
                <Link to="/loan-request">
                  <User className="h-5 w-5 ml-2" />
                  طلب قرض
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link to="/invest">
                  <TrendingUp className="h-5 w-5 ml-2" />
                  ابدأ الاستثمار
                </Link>
              </Button>
          </div>
        </div>
      </section>

        </div>

      {/* Article Footer */}
      <footer className="border-t border-gray-200 pt-12 mt-16">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-8">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-3">
              <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                دليل التكنولوجيا المالية
              </Badge>
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                الإقراض من نظير إلى نظير
              </Badge>
              <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                المملكة العربية السعودية
              </Badge>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm" className="flex items-center gap-2">
              <Share2 className="h-4 w-4" />
              مشاركة المقال
            </Button>
            <Button variant="outline" size="sm" className="flex items-center gap-2" asChild>
              <Link to="/blog">English</Link>
            </Button>
          </div>
        </div>
        
        {/* Author Info */}
        <div className="bg-gray-50 rounded-xl p-6">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center flex-shrink-0">
              <User className="h-8 w-8 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">فريق قرشين</h3>
              <p className="text-gray-600 mb-3">
                فريقنا من الخبراء الماليين ومتخصصي التكنولوجيا ملتزم بجعل الإقراض من نظير إلى نظير سهلاً وآمناً ومربحاً للجميع في المملكة العربية السعودية.
              </p>
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <span>نُشر في 15 ديسمبر 2024</span>
                <span>•</span>
                <span>6 دقائق قراءة</span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </article>
  );
};
