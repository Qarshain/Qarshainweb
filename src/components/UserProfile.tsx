import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  User, 
  Mail, 
  Phone, 
  CreditCard, 
  Shield, 
  Edit3, 
  Save, 
  X,
  Users,
  Calendar,
  CheckCircle,
  Clock,
  Globe,
  ArrowLeft
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface UserProfile {
  name: string;
  email: string;
  mobileNumber: string;
  idNumber: string;
  userType: 'borrower' | 'lender';
  kycStatus: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  idPhotoUrl?: string;
}

const UserProfile: React.FC = () => {
  const { user, logout } = useAuth();
  const { language, t, setLanguage } = useLanguage();
  const isAr = language === 'ar';
  const navigate = useNavigate();
  
  // Check language consistency on component load
  useEffect(() => {
    const savedLanguage = localStorage.getItem('preferred-language');
    if (savedLanguage && savedLanguage !== language) {
      console.log(`🔄 UserProfile: Language mismatch detected. Fixing...`);
      setLanguage(savedLanguage as 'ar' | 'en');
    }
  }, [language, setLanguage]);

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [editForm, setEditForm] = useState<Partial<UserProfile>>({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user) {
      loadUserProfile();
    }
  }, [user]);

  const loadUserProfile = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const docRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        const userData = docSnap.data() as UserProfile;
        setProfile(userData);
        setEditForm(userData);
      }
    } catch (error) {
      console.error("Error loading profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!user || !profile) return;
    
    try {
      setSaving(true);
      const docRef = doc(db, "users", user.uid);
      await updateDoc(docRef, editForm);
      
      setProfile(prev => prev ? { ...prev, ...editForm } : null);
      setEditing(false);
    } catch (error) {
      console.error("Error updating profile:", error);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setEditForm(profile || {});
    setEditing(false);
  };

  const getKycStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-yellow-100 text-yellow-800';
    }
  };

  const getKycStatusIcon = (status: string) => {
    switch (status) {
      case 'approved': return <CheckCircle className="h-4 w-4" />;
      case 'rejected': return <X className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gold mx-auto mb-4"></div>
          <p className="text-muted-foreground">
            {isAr ? "جاري تحميل الملف الشخصي..." : "Loading profile..."}
          </p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="text-center p-8">
        <p className="text-muted-foreground">
          {isAr ? "لم يتم العثور على الملف الشخصي" : "Profile not found"}
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      {/* Header with Back Button */}
      <div className="flex items-center gap-4 mb-4">
        <Button 
          onClick={() => navigate(-1)} 
          variant="outline" 
          size="sm"
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          {isAr ? "رجوع" : "Back"}
        </Button>
        <h1 className="text-2xl font-bold">
          {isAr ? "الملف الشخصي" : "User Profile"}
        </h1>
      </div>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            {isAr ? "الملف الشخصي" : "User Profile"}
          </CardTitle>
          {!editing && (
            <div className="flex gap-2">
              <Button onClick={() => setEditing(true)} variant="outline" size="sm">
                <Edit3 className="h-4 w-4 mr-2" />
                {isAr ? "تعديل" : "Edit"}
              </Button>
              <Button 
                onClick={() => setLanguage(language === 'ar' ? 'en' : 'ar')} 
                variant="outline" 
                size="sm"
                className="bg-purple-50 hover:bg-purple-100 text-purple-700 border-purple-200"
              >
                <Globe className="h-4 w-4 mr-2" />
                {language === 'ar' ? 'English' : 'العربية'}
              </Button>
            </div>
          )}
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="flex items-center gap-2 text-sm font-medium">
                <User className="h-4 w-4" />
                {isAr ? "الاسم" : "Name"}
              </Label>
              {editing ? (
                <Input
                  value={editForm.name || ''}
                  onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
                  className="mt-1"
                />
              ) : (
                <p className="mt-1 text-sm text-muted-foreground">{profile.name}</p>
              )}
            </div>

            <div>
              <Label className="flex items-center gap-2 text-sm font-medium">
                <Mail className="h-4 w-4" />
                {isAr ? "البريد الإلكتروني" : "Email"}
              </Label>
              <p className="mt-1 text-sm text-muted-foreground">{profile.email}</p>
            </div>

            <div>
              <Label className="flex items-center gap-2 text-sm font-medium">
                <Phone className="h-4 w-4" />
                {isAr ? "رقم الجوال" : "Mobile Number"}
              </Label>
              {editing ? (
                <Input
                  value={editForm.mobileNumber || ''}
                  onChange={(e) => setEditForm(prev => ({ ...prev, mobileNumber: e.target.value }))}
                  className="mt-1"
                />
              ) : (
                <p className="mt-1 text-sm text-muted-foreground">{profile.mobileNumber}</p>
              )}
            </div>

            <div>
              <Label className="flex items-center gap-2 text-sm font-medium">
                <CreditCard className="h-4 w-4" />
                {isAr ? "رقم الهوية" : "ID Number"}
              </Label>
              <p className="mt-1 text-sm text-muted-foreground">{profile.idNumber}</p>
            </div>
          </div>

          {/* User Type */}
          <div>
            <Label className="flex items-center gap-2 text-sm font-medium">
              <Users className="h-4 w-4" />
              {isAr ? "نوع المستخدم" : "User Type"}
            </Label>
            {editing ? (
              <Select
                value={editForm.userType}
                onValueChange={(value: 'borrower' | 'lender') => 
                  setEditForm(prev => ({ ...prev, userType: value }))
                }
              >
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="borrower">
                    {isAr ? "مقترض" : "Borrower"}
                  </SelectItem>
                  <SelectItem value="lender">
                    {isAr ? "مقرض" : "Lender"}
                  </SelectItem>
                </SelectContent>
              </Select>
            ) : (
              <div className="mt-1 flex items-center gap-2">
                <Badge variant={profile.userType === 'borrower' ? 'default' : 'secondary'}>
                  {profile.userType === 'borrower' 
                    ? (isAr ? "مقترض" : "Borrower")
                    : (isAr ? "مقرض" : "Lender")
                  }
                </Badge>
                <p className="text-xs text-muted-foreground">
                  {profile.userType === 'borrower'
                    ? (isAr ? "يمكنك طلب قروض" : "You can request loans")
                    : (isAr ? "يمكنك الاستثمار في القروض" : "You can invest in loans")
                  }
                </p>
              </div>
            )}
          </div>

          {/* KYC Status */}
          <div>
            <Label className="flex items-center gap-2 text-sm font-medium">
              <Shield className="h-4 w-4" />
              {isAr ? "حالة التحقق" : "KYC Status"}
            </Label>
            <div className="mt-1 flex items-center gap-2">
              <Badge className={getKycStatusColor(profile.kycStatus)}>
                {getKycStatusIcon(profile.kycStatus)}
                <span className="ml-1">
                  {profile.kycStatus === 'approved' && (isAr ? 'تم التحقق' : 'Verified')}
                  {profile.kycStatus === 'rejected' && (isAr ? 'مرفوض' : 'Rejected')}
                  {profile.kycStatus === 'pending' && (isAr ? 'قيد المراجعة' : 'Pending')}
                </span>
              </Badge>
            </div>
          </div>

          {/* Account Creation Date */}
          <div>
            <Label className="flex items-center gap-2 text-sm font-medium">
              <Calendar className="h-4 w-4" />
              {isAr ? "تاريخ إنشاء الحساب" : "Account Created"}
            </Label>
            <p className="mt-1 text-sm text-muted-foreground">
              {new Date(profile.createdAt).toLocaleDateString(
                isAr ? 'ar-SA' : 'en-US',
                { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                }
              )}
            </p>
          </div>

          {/* Edit Actions */}
          {editing && (
            <div className="flex gap-2 pt-4 border-t">
              <Button onClick={handleSave} disabled={saving} className="flex-1">
                {saving 
                  ? (isAr ? "جاري الحفظ..." : "Saving...")
                  : (isAr ? "حفظ التغييرات" : "Save Changes")
                }
              </Button>
              <Button onClick={handleCancel} variant="outline" className="flex-1">
                {isAr ? "إلغاء" : "Cancel"}
              </Button>
            </div>
          )}

          {/* Sign Out Button */}
          <div className="pt-4 border-t">
            <Button 
              onClick={logout} 
              variant="destructive" 
              className="w-full"
            >
              {isAr ? "تسجيل الخروج" : "Sign Out"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserProfile;
