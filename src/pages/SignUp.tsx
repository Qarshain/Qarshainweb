import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useLanguage } from "../contexts/LanguageContext";
import { Home, ArrowLeft, Globe } from "lucide-react";

const SignUp = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [userType, setUserType] = useState<'borrower' | 'lender'>('borrower');
  const { signup, loading, error } = useAuth();
  const navigate = useNavigate();
  const { language, t, setLanguage } = useLanguage();
  const isAr = language === 'ar';

  // Check language consistency on page load
  useEffect(() => {
    const savedLanguage = localStorage.getItem('preferred-language');
    if (savedLanguage && savedLanguage !== language) {
      console.log(`🔄 SignUp: Language mismatch detected. Fixing...`);
      setLanguage(savedLanguage as 'ar' | 'en');
    }
  }, [language, setLanguage]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Passwords don't match");
      return;
    }
    try {
      await signup(name, email, password, userType);
      navigate("/dashboard");
    } catch (error) {
      console.error("Signup error:", error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background py-8">
      <Card className="w-full max-w-md">
        {/* Navigation Buttons */}
        <div className="flex gap-2 p-4 border-b">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/')}
            className="flex items-center gap-2"
          >
            <Home className="h-4 w-4" />
            {isAr ? 'الرئيسية' : 'Home'}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate(-1)}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            {isAr ? 'رجوع' : 'Back'}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setLanguage(language === 'ar' ? 'en' : 'ar')}
            className="flex items-center gap-2 bg-purple-50 hover:bg-purple-100 text-purple-700 border-purple-200"
          >
            <Globe className="h-4 w-4" />
            {language === 'ar' ? 'English' : 'العربية'}
          </Button>
        </div>
        
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">
            {isAr ? 'إنشاء حساب جديد' : 'Create Account'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">
                {isAr ? 'الاسم' : 'Full Name'}
              </Label>
              <Input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder={isAr ? 'أدخل اسمك الكامل' : 'Enter your full name'}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">
                {isAr ? 'البريد الإلكتروني' : 'Email'}
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder={isAr ? 'أدخل بريدك الإلكتروني' : 'Enter your email'}
              />
            </div>

            <div className="space-y-2">
              <Label>
                {isAr ? 'نوع المستخدم' : 'User Type'}
              </Label>
              <RadioGroup
                value={userType}
                onValueChange={(value: 'borrower' | 'lender') => setUserType(value)}
                className="flex flex-col space-y-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="borrower" id="borrower" />
                  <Label htmlFor="borrower" className="cursor-pointer">
                    {isAr ? 'مقترض - أحتاج قرض' : 'Borrower - I need a loan'}
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="lender" id="lender" />
                  <Label htmlFor="lender" className="cursor-pointer">
                    {isAr ? 'مقرض - أريد استثمار أموالي' : 'Lender - I want to invest my money'}
                  </Label>
                </div>
              </RadioGroup>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">
                {isAr ? 'كلمة المرور' : 'Password'}
              </Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder={isAr ? 'أدخل كلمة المرور' : 'Enter your password'}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">
                {isAr ? 'تأكيد كلمة المرور' : 'Confirm Password'}
              </Label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                placeholder={isAr ? 'أكد كلمة المرور' : 'Confirm your password'}
              />
            </div>

            {error && (
              <div className="text-red-500 text-sm text-center">
                {error}
              </div>
            )}

            <Button
              type="submit"
              className="w-full bg-[hsl(45,85%,55%)] hover:bg-[hsl(42,90%,40%)] text-white"
              disabled={loading}
            >
              {loading ? (
                isAr ? 'جاري الإنشاء...' : 'Creating Account...'
              ) : (
                isAr ? 'إنشاء الحساب' : 'Create Account'
              )}
            </Button>
          </form>

          <div className="mt-4 text-center">
            <p className="text-sm text-muted-foreground">
              {isAr ? 'لديك حساب بالفعل؟' : 'Already have an account?'}
              <Button
                variant="link"
                className="p-0 h-auto text-[hsl(45,85%,55%)] hover:text-[hsl(42,90%,40%)]"
                onClick={() => navigate("/login")}
              >
                {isAr ? 'تسجيل الدخول' : 'Sign In'}
              </Button>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SignUp;