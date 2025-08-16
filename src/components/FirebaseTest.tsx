import React, { useState, useEffect } from 'react';
import { auth, db } from '@/lib/firebase';
import { signInAnonymously, onAuthStateChanged } from 'firebase/auth';
import { collection, getDocs } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const FirebaseTest: React.FC = () => {
  const [status, setStatus] = useState<string>('Testing...');
  const [error, setError] = useState<string | null>(null);
  const [authStatus, setAuthStatus] = useState<string>('Unknown');

  useEffect(() => {
    testFirebaseConnection();
  }, []);

  const testFirebaseConnection = async () => {
    try {
      setStatus('Testing Firebase connection...');
      
      // Test 1: Check if Firebase app is initialized
      if (!auth) {
        throw new Error('Firebase Auth not initialized');
      }
      setStatus('✅ Firebase Auth initialized');

      // Test 2: Check if Firestore is accessible
      if (!db) {
        throw new Error('Firestore not initialized');
      }
      setStatus('✅ Firestore initialized');

      // Test 3: Test anonymous authentication
      setStatus('Testing anonymous authentication...');
      await signInAnonymously(auth);
      setStatus('✅ Anonymous authentication successful');

      // Test 4: Test Firestore read
      setStatus('Testing Firestore read...');
      const testCollection = collection(db, 'test');
      await getDocs(testCollection);
      setStatus('✅ Firestore read successful');

      setStatus('🎉 All Firebase tests passed!');
      setError(null);

    } catch (err: any) {
      setError(err.message);
      setStatus('❌ Firebase test failed');
      console.error('Firebase test error:', err);
    }
  };

  const testAuthState = () => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setAuthStatus(`✅ Authenticated as: ${user.uid}`);
      } else {
        setAuthStatus('❌ Not authenticated');
      }
      unsubscribe();
    });
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Firebase Connection Test</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <p className="text-sm font-medium">Status:</p>
          <p className="text-sm text-muted-foreground">{status}</p>
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded">
            <p className="text-sm text-red-800 font-medium">Error:</p>
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        <div className="space-y-2">
          <p className="text-sm font-medium">Auth Status:</p>
          <p className="text-sm text-muted-foreground">{authStatus}</p>
        </div>

        <div className="flex gap-2">
          <Button onClick={testFirebaseConnection} variant="outline">
            Test Connection
          </Button>
          <Button onClick={testAuthState} variant="outline">
            Test Auth State
          </Button>
        </div>

        <div className="text-xs text-muted-foreground space-y-1">
          <p><strong>Common Issues:</strong></p>
          <ul className="list-disc list-inside space-y-1">
            <li>Firebase project not created</li>
            <li>Authentication service not enabled</li>
            <li>Incorrect configuration values</li>
            <li>Firestore rules too restrictive</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default FirebaseTest;
