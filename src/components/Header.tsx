import { Button } from "@/components/ui/button";

const Header = () => {
  return (
    <header className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 w-full border-b border-border/40">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <img 
            src="/lovable-uploads/77a5bec9-d868-4103-b96b-c932ab5016f5.png" 
            alt="Logo" 
            className="h-10 w-10 object-contain"
          />
          <span className="text-xl font-bold text-foreground">فوشين</span>
        </div>
        
        <nav className="hidden md:flex items-center space-x-8">
          <a href="#home" className="text-foreground hover:text-primary transition-colors">الرئيسية</a>
          <a href="#how-it-works" className="text-foreground hover:text-primary transition-colors">كيف يعمل</a>
          <a href="#features" className="text-foreground hover:text-primary transition-colors">المميزات</a>
          <a href="#contact" className="text-foreground hover:text-primary transition-colors">اتصل بنا</a>
        </nav>
        
        <div className="flex items-center space-x-4">
          <Button variant="ghost">تسجيل الدخول</Button>
          <Button variant="golden">ابدأ الآن</Button>
        </div>
      </div>
    </header>
  );
};

export default Header;