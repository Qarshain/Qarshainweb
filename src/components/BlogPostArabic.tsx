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
  Smartphone,
  Bot,
  BarChart3,
  Clock,
  CheckCircle,
  AlertTriangle,
  Bell
} from 'lucide-react';

export const BlogPostArabic: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto px-6 py-12" dir="rtl">
      {/* Article Hero Section */}
      <header className="mb-16">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-8">
            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 px-4 py-2 text-sm font-medium">
              التكنولوجيا المالية
            </Badge>
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 px-4 py-2 text-sm font-medium">
              الإقراض الرقمي
            </Badge>
            <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200 px-4 py-2 text-sm font-medium">
              المملكة العربية السعودية
            </Badge>
          </div>
          
          <h1 className="text-6xl font-bold text-gray-900 mb-8 leading-tight tracking-tight max-w-4xl mx-auto">
            كيف يعمل قرشين: ثورة في الإقراض الرقمي في المملكة العربية السعودية
          </h1>
          
          <p className="text-2xl text-gray-600 leading-relaxed mb-12 max-w-4xl mx-auto font-light">
            اكتشف كيف يحول قرشين المشهد المالي في المملكة العربية السعودية من خلال تقنيات الإقراض من نظير إلى نظير المبتكرة، وأنظمة الدفع الآلية، والتصميم المرتكز على المستخدم.
          </p>
          
          <div className="flex items-center justify-center gap-12 text-sm text-gray-500 mb-8">
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              <span className="font-medium">15 ديسمبر 2024</span>
            </div>
            <div className="flex items-center gap-2">
              <User className="h-5 w-5" />
              <span className="font-medium">فريق تحرير قرشين</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              <span className="font-medium">8 دقائق قراءة</span>
            </div>
          </div>
        </div>
        
        {/* Featured Image Placeholder */}
        <div className="w-full h-96 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-2xl mb-12 flex items-center justify-center border border-gray-200">
          <div className="text-center">
            <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <TrendingUp className="h-12 w-12 text-blue-600" />
            </div>
            <p className="text-gray-600 font-medium">صورة مميزة: منصة الإقراض الرقمي</p>
          </div>
        </div>
      </header>

      {/* Table of Contents */}
      <div className="bg-gray-50 border border-gray-200 rounded-xl p-8 mb-16">
        <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
          <Tag className="h-5 w-5" />
          جدول المحتويات
        </h3>
        <nav className="space-y-3">
          <a href="#introduction" className="block text-gray-700 hover:text-blue-600 transition-colors">
            <span className="font-medium">1.</span> المقدمة
          </a>
          <a href="#how-it-works" className="block text-gray-700 hover:text-blue-600 transition-colors">
            <span className="font-medium">2.</span> كيف تعمل المنصة
          </a>
          <a href="#advantage" className="block text-gray-700 hover:text-blue-600 transition-colors">
            <span className="font-medium">3.</span> ميزة قرشين
          </a>
          <a href="#reminders" className="block text-gray-700 hover:text-blue-600 transition-colors">
            <span className="font-medium">4.</span> تذكيرات الدفع الآلية
          </a>
          <a href="#conclusion" className="block text-gray-700 hover:text-blue-600 transition-colors">
            <span className="font-medium">5.</span> مستقبل الإقراض الرقمي
          </a>
        </nav>
      </div>

      {/* Article Introduction */}
      <section id="introduction" className="mb-16">
        <h2 className="text-4xl font-bold text-gray-900 mb-8">المقدمة</h2>
        <div className="prose prose-xl max-w-none">
          <p className="text-lg text-gray-700 leading-relaxed mb-6">
            يشهد المشهد المالي في المملكة العربية السعودية تحولاً جذرياً. المؤسسات المصرفية التقليدية، رغم موثوقيتها، غالباً ما تواجه صعوبات في تلبية الاحتياجات المتطورة للمقترضين والمستثمرين المعاصرين. عمليات الموافقة الطويلة، والمتطلبات الصارمة، والوصول المحدود خلقت فجوات في السوق بدأت الحلول المالية التقنية المبتكرة في معالجتها.
          </p>
          
          <p className="text-lg text-gray-700 leading-relaxed mb-6">
            هنا يأتي قرشين، منصة الإقراض الرقمي التي تعيد تصور كيفية انتقال الأموال بين المقترضين والمقرضين في المملكة. هذا الحل للإقراض من نظير إلى نظير يجمع بين التكنولوجيا المتطورة والفهم العميق لاحتياجات السوق المحلية، مما يخلق فرصاً للأفراد الذين يسعون للحصول على التمويل وأولئك الذين يتطلعون لاستثمار أموالهم بشكل أكثر فعالية.
          </p>
        </div>
        
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-l-4 border-blue-500 p-8 my-10 rounded-r-lg">
          <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Shield className="h-6 w-6 text-blue-600" />
            فهم الإقراض من نظير إلى نظير
          </h3>
          <p className="text-gray-700 text-lg leading-relaxed">
            يلغي الإقراض من نظير إلى نظير (P2P) الوسطاء الماليين التقليديين من خلال ربط المقترضين مباشرة بالأفراد أو المؤسسات المقرضة عبر منصة رقمية. هذا النموذج غالباً ما يؤدي إلى أسعار فائدة أفضل للمقترضين وعوائد أعلى للمقرضين، مع تقليل التكاليف العامة المرتبطة بعمليات البنوك التقليدية.
          </p>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="mb-16">
        <h2 className="text-4xl font-bold text-gray-900 mb-8">كيف تعمل المنصة</h2>
        
        <div className="prose prose-lg max-w-none">
          <p className="text-lg text-gray-700 leading-relaxed mb-8">
            يعمل قرشين على نموذج سوق مزدوج الجانب متطور يربط بسلاسة بين المقترضين الذين يسعون للحصول على التمويل والمقرضين الذين يبحثون عن فرص الاستثمار. تم تصميم هندسة المنصة لإزالة الاحتكاك المصرفي التقليدي مع الحفاظ على أعلى معايير الأمان والشفافية وتجربة المستخدم.
          </p>
        </div>

        <div className="space-y-12">
          {/* For Borrowers */}
          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <User className="h-4 w-4 text-green-600" />
              </div>
              للمقترضين: رحلة مبسطة نحو التمويل
            </h3>
            
            <div className="prose prose-lg max-w-none">
              <p className="text-lg text-gray-700 leading-relaxed mb-6">
                تم تصميم تجربة المقترض على قرشين حول البساطة والسرعة. على عكس البنوك التقليدية التي تتطلب أوراقاً مكثفة وعمليات موافقة طويلة، تستفيد منصتنا من التكنولوجيا المتطورة لتقديم قرارات التمويل في دقائق بدلاً من أسابيع.
              </p>
              
              <p className="text-gray-700 leading-relaxed mb-6">
                تبدأ الرحلة بعملية تسجيل مباشرة تجمع بين التحقق من الهوية وإجراءات "اعرف عميلك" (KYC) الشاملة. يتكامل نظامنا مع البنية التحتية للهوية الوطنية في المملكة العربية السعودية لضمان التحقق السريع والشامل. بمجرد التسجيل، يمكن للمقترضين الوصول فوراً إلى واجهة طلب القرض، حيث يمكنهم تحديد متطلبات التمويل والشروط المفضلة وتقديم الوثائق الداعمة.
              </p>
              
              <p className="text-gray-700 leading-relaxed mb-6">
                يحلل خوارزمية المطابقة الذكية في المنصة طلب القرض مقابل شبكة المقرضين المعتمدين، مع مراعاة عوامل مثل شهية المخاطر والتفضيلات الاستثمارية واحتياجات تنويع المحفظة. يضمن هذا النهج المدعوم بالذكاء الاصطناعي أن يتم ربط المقترضين بالمقرضين المهتمين حقاً بنوع القرض المحدد، مما يؤدي إلى موافقات أسرع وأسعار فائدة أكثر تنافسية.
              </p>
              
              <p className="text-gray-700 leading-relaxed">
                بمجرد تأمين التمويل، يستفيد المقترضون من نظام إدارة المدفوعات الشامل، والذي يتضمن تذكيرات آلية وخيارات دفع مرنة وتتبع القروض في الوقت الفعلي. تم تصميم النظام لمساعدة المقترضين على الحفاظ على تاريخ دفع جيد مع توفير المرونة لضبط جداول الدفع عند الحاجة.
              </p>
            </div>
          </div>

          {/* For Lenders */}
          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <TrendingUp className="h-4 w-4 text-blue-600" />
              </div>
              للمقرضين: فرص استثمار ذكية
            </h3>
            
            <div className="prose prose-lg max-w-none">
              <p className="text-lg text-gray-700 leading-relaxed mb-6">
                يحصل المقرضون على قرشين على الوصول إلى سوق منظم لفرص القروض المعتمدة، كل منها مصحوب بتقييمات مخاطر شاملة وملفات المقترضين. تحول منصتنا الإقراض التقليدي من نشاط سلبي إلى استراتيجية استثمار نشطة مدفوعة بالبيانات.
              </p>
              
              <p className="text-gray-700 leading-relaxed mb-6">
                تبدأ عملية الاستثمار بنظام اكتشاف الفرص المتطور، والذي يعرض على المقرضين طلبات القروض التي تطابق تحمل المخاطر المحدد ومعايير الاستثمار. تتضمن كل فرصة معلومات مفصلة عن المقترض وتقييمات الائتمان والتحقق من غرض القرض وبيانات الأداء التاريخية عند توفرها. تسمح هذه الشفافية للمقرضين باتخاذ قرارات مدروسة بناءً على بيانات شاملة بدلاً من نماذج الطلبات المحدودة.
              </p>
              
              <p className="text-gray-700 leading-relaxed mb-6">
                تمكن أدوات إدارة المخاطر في منصتنا المقرضين من تنويع محافظهم عبر قروض متعددة، مما يقلل من التعرض الإجمالي للمخاطر مع تعظيم العوائد المحتملة. يوفر النظام تحليلات في الوقت الفعلي وتتبع الأداء، مما يسمح للمقرضين بمراقبة استثماراتهم وضبط استراتيجياتهم بناءً على ظروف السوق وأداء المحفظة.
              </p>
              
              <p className="text-gray-700 leading-relaxed">
                يضمن نظام العوائد الآلي أن يحصل المقرضون على مدفوعات الفوائد ومدفوعات رأس المال في الموعد المحدد، مع شفافية كاملة في حالة الدفع والتواصل مع المقترض. يسمح هذا النهج غير التدخلي للمقرضين بالتركيز على تحسين المحفظة بينما تتعامل المنصة مع تعقيدات إدارة القروض والتحصيل التشغيلية.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* The Qarshain Advantage */}
      <section id="advantage" className="mb-16">
        <h2 className="text-4xl font-bold text-gray-900 mb-8">ميزة قرشين</h2>
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-8">
          <div className="space-y-8">
          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">للمقترضين</h3>
            <p className="text-gray-700 mb-4">
              غالباً ما تتطلب البنوك التقليدية أوراقاً مكثفة وفترات انتظار طويلة وعمليات موافقة صارمة. يلغي قرشين هذه الحواجز من خلال تقديم أوقات موافقة سريعة وأسعار فائدة تنافسية وعملية شفافة بدون رسوم مخفية. تسمح شروطنا المرنة لك باختيار فترات السداد التي تناسب وضعك المالي، ويمكنك إدارة قروضك على مدار الساعة طوال أيام الأسبوع من خلال منصتنا البديهية.
            </p>
            <p className="text-gray-700">
              تضمن خوارزميات تقييم المخاطر المتطورة في المنصة أن تحصل على أسعار فائدة عادلة بناءً على جدارتك الائتمانية الفعلية، وليس فقط نقاط الائتمان. يعني هذا النهج الشخصي شروطاً أفضل للمقترضين المسؤولين الذين قد يتم تجاهلهم من قبل المؤسسات المالية التقليدية.
            </p>
          </div>
          
          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">للمقرضين</h3>
            <p className="text-gray-700 mb-4">
              يوفر قرشين فرصة لكسب عوائد أعلى من حسابات التوفير التقليدية مع دعم الاقتصاد المحلي. تقدم منصتنا خيارات استثمار متنوعة، مما يسمح لك بتوزيع المخاطر عبر قروض متعددة. يتعامل نظام الإدارة الآلي مع التفاصيل، بحيث يمكنك كسب دخل سلبي بأقل جهد.
            </p>
            <p className="text-gray-700">
              مع الشفافية الكاملة في ملفات المقترضين وتقييمات المخاطر الشاملة، يمكنك اتخاذ قرارات استثمار مدروسة. يضمن نظام العوائد الآلي في المنصة مدفوعات الفوائد في الوقت المناسب ومدفوعات رأس المال، مما يجعله مصدراً موثوقاً للدخل السلبي.
            </p>
          </div>
          </div>
        </div>
      </section>

      {/* Email Reminder System */}
      <section id="reminders" className="mb-16">
        <h2 className="text-4xl font-bold text-gray-900 mb-8">تذكيرات الدفع الآلية</h2>
        
        <div className="prose prose-lg max-w-none">
          <p className="text-lg text-gray-700 leading-relaxed mb-8">
            يضمن نظام تذكيرات البريد الإلكتروني المتقدم لدينا عدم تفويت المقترضين لأي دفعة، مع قوالب عربية جميلة من اليمين إلى اليسار وجدولة ذكية. يعمل هذا النظام الشامل على مستويات متعددة للحفاظ على علاقات قروض صحية وتقليل التخلف عن السداد.
          </p>
        </div>

        <div className="space-y-8">
          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <Clock className="h-4 w-4 text-green-600" />
              </div>
              تذكيرات الدفعات القادمة
            </h3>
            <p className="text-lg text-gray-700 leading-relaxed mb-4">
              يرسل نظامنا تذكيرات ودودة للمقترضين قبل ثلاثة أيام من تاريخ استحقاق الدفعة. تم تصميم هذه الإشعارات لتكون مفيدة بدلاً من تدخلية، وتوفر معلومات واضحة عن مبلغ الدفعة القادمة وتاريخ الاستحقاق وطرق الدفع المتاحة.
            </p>
            <p className="text-gray-700 leading-relaxed">
              تتضمن التذكيرات روابط مباشرة لبوابات الدفع ومعلومات الاتصال للمقترضين الذين قد يحتاجون إلى مساعدة أو لديهم أسئلة حول شروط القرض. ثبت أن نظام الإشعار المبكر هذا يقلل بشكل كبير من المدفوعات المتأخرة ويحسن رضا المقترضين بشكل عام.
            </p>
          </div>

          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
              <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                <AlertTriangle className="h-4 w-4 text-orange-600" />
              </div>
              تحذيرات الدفعات المتأخرة
            </h3>
            <p className="text-lg text-gray-700 leading-relaxed mb-4">
              عندما تصبح الدفعة متأخرة، يرفع نظامنا تلقائياً استراتيجية التواصل. يتلقى المقترضون تحذيرات واضحة حول حالة التأخير، بما في ذلك عدد الأيام المتأخرة وأي رسوم تأخير أو غرامات قابلة للتطبيق.
            </p>
            <p className="text-gray-700 leading-relaxed">
              تم تصميم هذه التحذيرات لتكون حازمة ولكن عادلة، مع التركيز على أهمية الحفاظ على تاريخ دفع جيد مع تقديم الدعم وخيارات الدفع المرنة عند الاقتضاء. يوفر النظام أيضاً للمقرضين تحديثات في الوقت الفعلي حول حالة الدفع والتواصل مع المقترض.
            </p>
          </div>

          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
              <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                <Bell className="h-4 w-4 text-red-600" />
              </div>
              الإشعار النهائي والتصعيد
            </h3>
            <p className="text-lg text-gray-700 leading-relaxed mb-4">
              بعد سبعة أيام من حالة التأخير، يصدر النظام إشعارات نهائية للمقترضين. هذه الاتصالات أكثر إلحاحاً في النبرة مع الحفاظ على المهنية وتقديم مسارات واضحة للحل.
            </p>
            <p className="text-gray-700 leading-relaxed">
              يتضمن نظام الإشعار النهائي التصعيد التلقائي إلى فريق دعم العملاء، وعند الضرورة، التنسيق مع قسم إدارة المخاطر. يضمن هذا معالجة مشاكل الدفع الخطيرة بسرعة مع الحفاظ على التزام المنصة بممارسات الإقراض العادلة والشفافة.
            </p>
          </div>
        </div>
      </section>

      {/* Conclusion */}
      <section id="conclusion" className="mb-16">
        <h2 className="text-4xl font-bold text-gray-900 mb-8">مستقبل الإقراض الرقمي في المملكة العربية السعودية</h2>
        <p className="text-lg text-gray-700 leading-relaxed mb-6">
          مع استمرار المملكة العربية السعودية في رحلة التحول الرقمي تحت رؤية 2030، تمثل منصات مثل قرشين مستقبل الخدمات المالية. من خلال الجمع بين مبادئ التمويل الإسلامي التقليدية والتكنولوجيا الحديثة، تجعل هذه المنصات الخدمات المالية أكثر سهولة وكفاءة وشفافية لجميع السعوديين.
        </p>
        
        <p className="text-lg text-gray-700 leading-relaxed mb-6">
          يعتمد نجاح منصات الإقراض من نظير إلى نظير ليس فقط على التكنولوجيا، ولكن على بناء الثقة وضمان الامتثال التنظيمي وخلق قيمة لجميع المشاركين. يوضح نهج قرشين في التذكيرات الآلية وتقييم المخاطر وتجربة المستخدم كيف يمكن للتصميم المدروس معالجة احتياجات السوق الحقيقية.
        </p>
        
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-8 mt-8">
          <h3 className="text-xl font-bold text-blue-900 mb-4 flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            النظر إلى المستقبل
          </h3>
          <p className="text-blue-800 text-lg leading-relaxed">
            مشهد الإقراض الرقمي في المملكة العربية السعودية لا يزال يتطور، مع ظهور لوائح وتقنيات جديدة بانتظام. المنصات التي يمكنها التكيف مع هذه التغييرات مع الحفاظ على التركيز على احتياجات المستخدمين والامتثال التنظيمي ستشكل على الأرجح مستقبل الخدمات المالية في المنطقة.
          </p>
        </div>
      </section>

      {/* Author Bio */}
      <div className="bg-gray-50 border border-gray-200 rounded-xl p-8 mb-12">
        <div className="flex items-start gap-6">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center flex-shrink-0">
            <User className="h-10 w-10 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-bold text-gray-900 mb-2">فريق تحرير قرشين</h3>
            <p className="text-gray-600 mb-4">
              يتكون فريق التحرير لدينا من خبراء ماليين ومتخصصين في التكنولوجيا ومحللين للسوق مكرسين لتقديم محتوى دقيق ومفيد حول المشهد المتطور للتمويل الرقمي في المملكة العربية السعودية.
            </p>
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <span>نُشر في 15 ديسمبر 2024</span>
              <span>•</span>
              <span>8 دقائق قراءة</span>
              <span>•</span>
              <span>تم التحديث منذ يومين</span>
            </div>
          </div>
        </div>
      </div>

      {/* Article Footer */}
      <footer className="border-t border-gray-200 pt-12 mt-16">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-8">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-3 mt-2">
              <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                التكنولوجيا المالية
              </Badge>
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                الإقراض الرقمي
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
        
        {/* Related Articles */}
        <div className="mt-12">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">مقالات ذات صلة</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 bg-gradient-to-br from-green-50 to-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <TrendingUp className="h-8 w-8 text-green-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">فهم مخاطر الإقراض من نظير إلى نظير</h4>
                  <p className="text-gray-600 text-sm mb-3">تعلم عن استراتيجيات إدارة المخاطر لمنصات الإقراض من نظير إلى نظير.</p>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <Calendar className="h-3 w-3" />
                    <span>10 ديسمبر 2024</span>
                    <span>•</span>
                    <span>5 دقائق قراءة</span>
                  </div>
                </div>
              </div>
            </Card>
            
            <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Shield className="h-8 w-8 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">لوائح التكنولوجيا المالية السعودية 2024</h4>
                  <p className="text-gray-600 text-sm mb-3">دليل شامل لأحدث التغييرات التنظيمية في التكنولوجيا المالية السعودية.</p>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <Calendar className="h-3 w-3" />
                    <span>8 ديسمبر 2024</span>
                    <span>•</span>
                    <span>7 دقائق قراءة</span>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200 rounded-xl p-6">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center flex-shrink-0">
              <AlertTriangle className="h-4 w-4 text-yellow-600" />
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">إخلاء المسؤولية</h4>
              <p className="text-sm text-gray-600 leading-relaxed">
                هذا المقال لأغراض إعلامية فقط ولا يشكل نصيحة مالية. يرجى استشارة مستشارين ماليين مؤهلين قبل اتخاذ قرارات الاستثمار.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
