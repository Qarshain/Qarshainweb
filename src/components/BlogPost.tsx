import React from 'react';
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

export const BlogPost: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
        <strong>Debug:</strong> BlogPost component is rendering!
      </div>
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            Featured Post
          </Badge>
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            How It Works
          </Badge>
        </div>
        
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          How Qarshain Works: Revolutionizing Digital Lending in Saudi Arabia
        </h1>
        
        <div className="flex items-center gap-4 text-sm text-gray-600 mb-6">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <span>December 2024</span>
          </div>
          <div className="flex items-center gap-2">
            <User className="h-4 w-4" />
            <span>Qarshain Team</span>
          </div>
          <div className="flex items-center gap-2">
            <Tag className="h-4 w-4" />
            <span>Fintech, Lending, Saudi Arabia</span>
          </div>
        </div>
        
        <div className="flex gap-3">
          <Button variant="outline" size="sm">
            <Share2 className="h-4 w-4 mr-2" />
            Share
          </Button>
          <Button size="sm" className="bg-[hsl(45,85%,55%)] hover:bg-[hsl(42,90%,40%)] text-white">
            <ArrowRight className="h-4 w-4 mr-2" />
            Get Started
          </Button>
        </div>
      </div>

      {/* Introduction */}
      <Card className="mb-8">
        <CardContent className="p-8">
          <p className="text-lg text-gray-700 leading-relaxed mb-6">
            In today's fast-paced digital economy, traditional lending processes can be slow, complex, and inaccessible to many individuals and small businesses. Qarshain is changing that narrative by providing a modern, transparent, and efficient peer-to-peer lending platform designed specifically for the Saudi Arabian market.
          </p>
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 className="text-xl font-semibold text-blue-900 mb-3">What is Qarshain?</h3>
            <p className="text-blue-800">
              Qarshain (قرشين) is a cutting-edge digital lending platform that connects borrowers with lenders in a secure, transparent, and efficient marketplace. Our platform leverages advanced technology to streamline the lending process while maintaining the highest standards of security and compliance with Saudi Arabian financial regulations.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* How It Works Section */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-gray-900">How the Platform Works</CardTitle>
        </CardHeader>
        <CardContent className="space-y-8">
          {/* For Borrowers */}
          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <User className="h-5 w-5 text-green-600" />
              For Borrowers (المقترضين)
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-green-600 font-semibold text-sm">1</span>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">Simple Registration</h4>
                    <p className="text-sm text-gray-600">Create account, complete KYC, get instant approval</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-green-600 font-semibold text-sm">2</span>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">Loan Application</h4>
                    <p className="text-sm text-gray-600">Submit requests with clear terms and documentation</p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-green-600 font-semibold text-sm">3</span>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">Smart Matching</h4>
                    <p className="text-sm text-gray-600">AI algorithm matches you with suitable lenders</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-green-600 font-semibold text-sm">4</span>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">Payment Management</h4>
                    <p className="text-sm text-gray-600">Automated reminders and payment tracking</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* For Lenders */}
          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-blue-600" />
              For Lenders (المقرضين)
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-blue-600 font-semibold text-sm">1</span>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">Browse Opportunities</h4>
                    <p className="text-sm text-gray-600">Explore verified loan requests with risk assessments</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-blue-600 font-semibold text-sm">2</span>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">Invest Smartly</h4>
                    <p className="text-sm text-gray-600">Choose loans that match your risk profile</p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-blue-600 font-semibold text-sm">3</span>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">Track Performance</h4>
                    <p className="text-sm text-gray-600">Monitor investments with real-time analytics</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-blue-600 font-semibold text-sm">4</span>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">Receive Returns</h4>
                    <p className="text-sm text-gray-600">Automated interest and principal payments</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Key Features */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-gray-900">Key Features</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="text-center p-6 border rounded-lg hover:shadow-md transition-shadow">
              <Shield className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <h3 className="font-semibold text-gray-900 mb-2">Security & Compliance</h3>
              <p className="text-sm text-gray-600">Bank-level encryption and regulatory compliance</p>
            </div>
            
            <div className="text-center p-6 border rounded-lg hover:shadow-md transition-shadow">
              <Smartphone className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <h3 className="font-semibold text-gray-900 mb-2">User Experience</h3>
              <p className="text-sm text-gray-600">Bilingual interface with responsive design</p>
            </div>
            
            <div className="text-center p-6 border rounded-lg hover:shadow-md transition-shadow">
              <Bot className="h-12 w-12 text-purple-600 mx-auto mb-4" />
              <h3 className="font-semibold text-gray-900 mb-2">Automation & AI</h3>
              <p className="text-sm text-gray-600">Smart matching and automated processes</p>
            </div>
            
            <div className="text-center p-6 border rounded-lg hover:shadow-md transition-shadow">
              <BarChart3 className="h-12 w-12 text-orange-600 mx-auto mb-4" />
              <h3 className="font-semibold text-gray-900 mb-2">Analytics & Reporting</h3>
              <p className="text-sm text-gray-600">Comprehensive insights and performance tracking</p>
            </div>
            
            <div className="text-center p-6 border rounded-lg hover:shadow-md transition-shadow">
              <Clock className="h-12 w-12 text-red-600 mx-auto mb-4" />
              <h3 className="font-semibold text-gray-900 mb-2">Fast Processing</h3>
              <p className="text-sm text-gray-600">Quick approvals and instant fund transfers</p>
            </div>
            
            <div className="text-center p-6 border rounded-lg hover:shadow-md transition-shadow">
              <Bell className="h-12 w-12 text-yellow-600 mx-auto mb-4" />
              <h3 className="font-semibold text-gray-900 mb-2">Smart Reminders</h3>
              <p className="text-sm text-gray-600">Automated payment reminders in Arabic</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Email Reminder System */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-gray-900">Automated Payment Reminders</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-700 mb-6">
            Our advanced email reminder system ensures borrowers never miss a payment, with beautiful Arabic RTL templates and smart scheduling.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <Clock className="h-5 w-5 text-green-600" />
                </div>
                <h3 className="font-semibold text-green-900">Upcoming Payment</h3>
              </div>
              <p className="text-sm text-green-800">Friendly reminder sent 3 days before due date</p>
            </div>
            
            <div className="p-6 bg-orange-50 border border-orange-200 rounded-lg">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                  <AlertTriangle className="h-5 w-5 text-orange-600" />
                </div>
                <h3 className="font-semibold text-orange-900">Overdue Warning</h3>
              </div>
              <p className="text-sm text-orange-800">Alert when payment is late with days overdue</p>
            </div>
            
            <div className="p-6 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                  <Bell className="h-5 w-5 text-red-600" />
                </div>
                <h3 className="font-semibold text-red-900">Final Notice</h3>
              </div>
              <p className="text-sm text-red-800">Urgent notice after 7 days overdue</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Call to Action */}
      <Card className="mb-8 bg-gradient-to-r from-[hsl(45,85%,55%)] to-[hsl(42,90%,40%)] text-white">
        <CardContent className="p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-lg mb-6 opacity-90">
            Join thousands of users who are already benefiting from Qarshain's innovative lending platform.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" className="bg-white text-[hsl(42,90%,40%)] hover:bg-gray-100">
              <User className="h-5 w-5 mr-2" />
              Apply for a Loan
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-[hsl(42,90%,40%)]">
              <TrendingUp className="h-5 w-5 mr-2" />
              Start Investing
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Footer */}
      <div className="text-center text-gray-600 text-sm">
        <p>Published by Qarshain Team • December 2024</p>
        <p className="mt-2">
          <a href="mailto:support@garshain.com" className="text-[hsl(45,85%,55%)] hover:underline">
            support@garshain.com
          </a>
          {' • '}
          <a href="tel:+966111234567" className="text-[hsl(45,85%,55%)] hover:underline">
            +966 11 123 4567
          </a>
        </p>
      </div>
    </div>
  );
};
