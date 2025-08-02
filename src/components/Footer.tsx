import { Separator } from "@/components/ui/separator";

const Footer = () => {
  return (
    <footer className="bg-foreground text-background py-16">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8 mb-12">
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <img 
                src="/lovable-uploads/77a5bec9-d868-4103-b96b-c932ab5016f5.png" 
                alt="Logo" 
                className="h-10 w-10 object-contain"
              />
              <span className="text-xl font-bold">فوشين</span>
            </div>
            <p className="text-background/80 leading-relaxed">
              منصة الإقراض الند للند الرائدة في المنطقة. نربط المستثمرين مع المقترضين في بيئة آمنة وشفافة.
            </p>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4 text-gold">الخدمات</h3>
            <ul className="space-y-2 text-background/80">
              <li><a href="#" className="hover:text-gold-light transition-colors">القروض الشخصية</a></li>
              <li><a href="#" className="hover:text-gold-light transition-colors">قروض الأعمال</a></li>
              <li><a href="#" className="hover:text-gold-light transition-colors">الاستثمار</a></li>
              <li><a href="#" className="hover:text-gold-light transition-colors">إدارة المحافظ</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4 text-gold">الشركة</h3>
            <ul className="space-y-2 text-background/80">
              <li><a href="#" className="hover:text-gold-light transition-colors">من نحن</a></li>
              <li><a href="#" className="hover:text-gold-light transition-colors">الفريق</a></li>
              <li><a href="#" className="hover:text-gold-light transition-colors">الوظائف</a></li>
              <li><a href="#" className="hover:text-gold-light transition-colors">الأخبار</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4 text-gold">الدعم</h3>
            <ul className="space-y-2 text-background/80">
              <li><a href="#" className="hover:text-gold-light transition-colors">مركز المساعدة</a></li>
              <li><a href="#" className="hover:text-gold-light transition-colors">الأسئلة الشائعة</a></li>
              <li><a href="#" className="hover:text-gold-light transition-colors">اتصل بنا</a></li>
              <li><a href="#" className="hover:text-gold-light transition-colors">سياسة الخصوصية</a></li>
            </ul>
          </div>
        </div>
        
        <Separator className="bg-background/20 mb-8" />
        
        <div className="flex flex-col md:flex-row justify-between items-center text-background/80">
          <p>&copy; 2024 فوشين. جميع الحقوق محفوظة.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="hover:text-gold-light transition-colors">الشروط والأحكام</a>
            <a href="#" className="hover:text-gold-light transition-colors">سياسة الخصوصية</a>
            <a href="#" className="hover:text-gold-light transition-colors">ملفات تعريف الارتباط</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;