import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAnalytics } from '@/hooks/useAnalytics';
import { checkGAStatus } from '@/lib/analytics';

const AnalyticsTest: React.FC = () => {
  const { trackEvent, trackUserAction, trackLoanAction, trackAuthAction, trackInvestmentAction } = useAnalytics();
  const [gaStatus, setGaStatus] = useState<boolean>(false);
  const [testResults, setTestResults] = useState<string[]>([]);

  useEffect(() => {
    // Check GA status on mount
    const status = checkGAStatus();
    setGaStatus(status);
    
    if (status) {
      setTestResults(prev => [...prev, '✅ Google Analytics is loaded and ready']);
    } else {
      setTestResults(prev => [...prev, '❌ Google Analytics is not loaded']);
    }
  }, []);

  const runTest = (testName: string, testFunction: () => void) => {
    try {
      testFunction();
      setTestResults(prev => [...prev, `✅ ${testName} - Test executed successfully`]);
    } catch (error) {
      setTestResults(prev => [...prev, `❌ ${testName} - Error: ${error}`]);
    }
  };

  const testBasicEvent = () => {
    trackEvent('test_event', 'testing', 'analytics_test');
  };

  const testUserAction = () => {
    trackUserAction('test_user_action', { test: true, timestamp: Date.now() });
  };

  const testLoanEvent = () => {
    trackLoanAction('loan_requested', { test: true, amount: 1000 });
  };

  const testAuthEvent = () => {
    trackAuthAction('login', 'test_method');
  };

  const testInvestmentEvent = () => {
    trackInvestmentAction('investment_viewed', { test: true, investment_id: 'test_123' });
  };

  const testManualGtag = () => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'manual_test', { manual: true, timestamp: Date.now() });
      setTestResults(prev => [...prev, '✅ Manual gtag test executed']);
    } else {
      setTestResults(prev => [...prev, '❌ Manual gtag test failed - gtag not available']);
    }
  };

  const clearResults = () => {
    setTestResults([]);
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          🔍 Google Analytics Test Panel
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="text-sm">
            <strong>Status:</strong> {gaStatus ? '✅ Ready' : '❌ Not Ready'}
          </div>
          <div className="text-xs text-gray-600 mt-1">
            Check browser console for detailed analytics logs
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <Button onClick={() => runTest('Basic Event', testBasicEvent)} size="sm">
            Test Basic Event
          </Button>
          <Button onClick={() => runTest('User Action', testUserAction)} size="sm">
            Test User Action
          </Button>
          <Button onClick={() => runTest('Loan Event', testLoanEvent)} size="sm">
            Test Loan Event
          </Button>
          <Button onClick={() => runTest('Auth Event', testAuthEvent)} size="sm">
            Test Auth Event
          </Button>
          <Button onClick={() => runTest('Investment Event', testInvestmentEvent)} size="sm">
            Test Investment Event
          </Button>
          <Button onClick={() => runTest('Manual Gtag', testManualGtag)} size="sm">
            Test Manual Gtag
          </Button>
        </div>

        <div className="flex gap-2">
          <Button onClick={clearResults} variant="outline" size="sm">
            Clear Results
          </Button>
          <Button 
            onClick={() => checkGAStatus()} 
            variant="outline" 
            size="sm"
          >
            Check GA Status
          </Button>
        </div>

        {testResults.length > 0 && (
          <div className="border rounded-lg p-3 bg-gray-50">
            <h4 className="font-medium mb-2">Test Results:</h4>
            <div className="space-y-1 text-sm">
              {testResults.map((result, index) => (
                <div key={index} className="font-mono text-xs">
                  {result}
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="text-xs text-gray-600">
          <strong>Instructions:</strong>
          <ol className="list-decimal list-inside mt-1 space-y-1">
            <li>Open browser console (F12)</li>
            <li>Click test buttons</li>
            <li>Check console for analytics logs</li>
            <li>Verify events appear in Google Analytics Real-Time reports</li>
          </ol>
        </div>
      </CardContent>
    </Card>
  );
};

export default AnalyticsTest;
