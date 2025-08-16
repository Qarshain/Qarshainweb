import React, { createContext, useContext, useState, useEffect } from "react";
import { auth, db, googleProvider } from "../lib/firebase";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User,
  sendPasswordResetEmail,
  signInWithPopup,
  sendEmailVerification
} from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string, userType: 'borrower' | 'lender') => Promise<void>;
  logout: () => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  sendVerification: () => Promise<void>;
  userName: string | null;
  userType: 'borrower' | 'lender' | null;
  emailVerified: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null);
  const [userType, setUserType] = useState<'borrower' | 'lender' | null>(null);
  const [emailVerified, setEmailVerified] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);
      setEmailVerified(!!firebaseUser?.emailVerified);
      if (firebaseUser) {
        // Try to get name and userType from Firestore
        const docRef = doc(db, "users", firebaseUser.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const userData = docSnap.data();
          setUserName(userData.name || null);
          setUserType(userData.userType || null);
        } else {
          setUserName(firebaseUser.displayName || null);
          setUserType(null);
        }
      } else {
        setUserName(null);
        setUserType(null);
      }
    });
    return () => unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    setError(null);
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const signup = async (name: string, email: string, password: string, userType: 'borrower' | 'lender') => {
    setError(null);
    setLoading(true);
    try {
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      
      // Store complete user data in Firestore with proper KYC status
      const userData = {
        name,
        email,
        userType,
        kycStatus: 'pending', // Always start with pending status
        createdAt: new Date(),
        updatedAt: new Date(),
        mobileNumber: '', // Empty by default
        idNumber: '', // Empty by default
        idPhotoUrl: '', // Empty by default
        verifiedAt: null, // Not verified yet
        adminAction: null, // No admin action yet
        adminId: null, // No admin ID yet
        adminEmail: null // No admin email yet
      };
      
      await setDoc(doc(db, "users", cred.user.uid), userData);
      await sendEmailVerification(cred.user);
      
      console.log("✅ User created successfully with pending KYC status:", userData);
    } catch (err: any) {
      setError(err.message);
      console.error("❌ Error creating user:", err);
    } finally {
      setLoading(false);
    }
  };

  const loginWithGoogle = async () => {
    setError(null);
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      // Store name in Firestore if new user
      if (result.user) {
        const docRef = doc(db, "users", result.user.uid);
        const docSnap = await getDoc(docRef);
        
        if (!docSnap.exists()) {
          // New Google user - create with pending KYC status
          const userData = {
            name: result.user.displayName,
            email: result.user.email,
            userType: 'borrower', // Default to borrower for Google users
            kycStatus: 'pending', // Always start with pending status
            createdAt: new Date(),
            updatedAt: new Date(),
            mobileNumber: '',
            idNumber: '',
            idPhotoUrl: '',
            verifiedAt: null,
            adminAction: null,
            adminId: null,
            adminEmail: null
          };
          
          await setDoc(docRef, userData);
          console.log("✅ Google user created successfully with pending KYC status:", userData);
        } else {
          // Existing user - just update name if needed
          await setDoc(docRef, { 
            name: result.user.displayName, 
            email: result.user.email,
            updatedAt: new Date()
          }, { merge: true });
        }
      }
    } catch (err: any) {
      setError(err.message);
      console.error("❌ Error with Google login:", err);
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (email: string) => {
    setError(null);
    setLoading(true);
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const sendVerification = async () => {
    setError(null);
    setLoading(true);
    try {
      if (auth.currentUser) {
        await sendEmailVerification(auth.currentUser);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setError(null);
    setLoading(true);
    try {
      await signOut(auth);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, error, login, signup, logout, loginWithGoogle, resetPassword, sendVerification, userName, userType, emailVerified }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};