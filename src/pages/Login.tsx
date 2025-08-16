import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../contexts/LanguageContext";
import { Home, ArrowLeft, Globe } from "lucide-react";
import { Button } from "../components/ui/button";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [resetSent, setResetSent] = useState(false);
  const { login, resetPassword, loading, error, user, emailVerified } = useAuth();
  const navigate = useNavigate();
  const { language, t, setLanguage } = useLanguage();
  const isAr = language === 'ar';

  // Check language consistency on page load
  useEffect(() => {
    const savedLanguage = localStorage.getItem('preferred-language');
    if (savedLanguage && savedLanguage !== language) {
      console.log(`🔄 Login: Language mismatch detected. Fixing...`);
      setLanguage(savedLanguage as 'ar' | 'en');
    }
  }, [language, setLanguage]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await login(email, password);
    if (!error) navigate("/dashboard");
  };

  const handleReset = async () => {
    await resetPassword(email);
    setResetSent(true);
  };

  if (user) {
    if (!emailVerified) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-background">
          <div className="bg-card p-8 rounded shadow-md w-full max-w-md space-y-4 text-center">
            <h2 className="text-2xl font-bold mb-4">Verify your email</h2>
            <p className="mb-4">Please check your inbox and verify your email address to continue.</p>
            <button className="w-full bg-gold text-white p-2 rounded" onClick={() => window.location.reload()}>I've verified my email</button>
          </div>
        </div>
      );
    }
    navigate("/dashboard");
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="w-full max-w-md space-y-6">
        {/* Navigation Buttons */}
        <div className="flex gap-2 justify-center">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/')}
            className="flex items-center gap-2"
          >
            <Home className="h-4 w-4" />
            Home
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
        
        <form onSubmit={handleSubmit} className="bg-card p-8 rounded shadow-md space-y-4">
          <h2 className="text-2xl font-bold mb-4">Login</h2>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-gold"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-gold"
            required
          />
          {error && <div className="text-red-500 text-sm">{error}</div>}
          <button type="submit" className="w-full bg-gold hover:bg-gold-light text-white p-2 rounded transition" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
          <div className="flex justify-between items-center text-sm mt-2">
            <span>Don't have an account? <a href="/signup" className="text-gold hover:underline">Sign Up</a></span>
            <button type="button" className="text-blue-600 hover:underline" onClick={handleReset} disabled={loading || !email}>Forgot password?</button>
          </div>
          {resetSent && <div className="text-green-600 text-xs">Password reset email sent!</div>}
        </form>


      </div>
    </div>
  );
};

export default Login;