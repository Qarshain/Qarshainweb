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
    <div className="max-w-4xl mx-auto px-6 py-12">
      {/* Article Header */}
      <header className="mb-12">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-6">
            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 px-3 py-1">
              Fintech
            </Badge>
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 px-3 py-1">
              Digital Lending
            </Badge>
            <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200 px-3 py-1">
              Saudi Arabia
            </Badge>
          </div>
          
          <h1 className="text-5xl font-bold text-gray-900 mb-6 leading-tight tracking-tight">
            How Qarshain Works: Revolutionizing Digital Lending in Saudi Arabia
          </h1>
          
          <p className="text-xl text-gray-600 leading-relaxed mb-8 max-w-3xl">
            Discover how Qarshain is transforming the financial landscape in Saudi Arabia through innovative peer-to-peer lending technology, automated payment systems, and user-centric design.
          </p>
          
          <div className="flex items-center gap-8 text-sm text-gray-500 mb-8">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>December 15, 2024</span>
            </div>
            <div className="flex items-center gap-2">
              <User className="h-4 w-4" />
              <span>Qarshain Editorial Team</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span>8 min read</span>
            </div>
          </div>
        </div>
      </header>

      {/* Article Introduction */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-6">Introduction</h2>
        <div className="prose prose-lg max-w-none">
        <p className="text-lg text-gray-700 leading-relaxed mb-6">
          The financial landscape in Saudi Arabia is undergoing a significant transformation. Traditional banking institutions, 
          while reliable, often struggle to meet the evolving needs of modern borrowers and investors. Long approval processes, 
          rigid requirements, and limited accessibility have created gaps in the market that innovative fintech solutions are 
          beginning to address.
        </p>
        
        <p className="text-lg text-gray-700 leading-relaxed mb-6">
          Enter Qarshain (قرشين), a digital lending platform that's reimagining how money moves between borrowers and lenders 
          in the Kingdom. This peer-to-peer lending solution combines cutting-edge technology with deep understanding of local 
          market needs, creating opportunities for both individuals seeking funding and those looking to invest their money 
          more effectively.
        </p>
        </div>
        
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-l-4 border-blue-500 p-8 my-10 rounded-r-lg">
          <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Shield className="h-6 w-6 text-blue-600" />
            Understanding Peer-to-Peer Lending
          </h3>
          <p className="text-gray-700 text-lg leading-relaxed">
            Peer-to-peer (P2P) lending eliminates traditional financial intermediaries by directly connecting borrowers 
            with individual or institutional lenders through a digital platform. This model often results in better 
            interest rates for borrowers and higher returns for lenders, while reducing the overhead costs associated 
            with traditional banking operations.
          </p>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-8">How the Platform Works</h2>
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-8">
          <div className="space-y-12">
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
          </div>
        </div>
      </section>

      {/* The Qarshain Advantage */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-8">The Qarshain Advantage</h2>
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-8">
          <div className="space-y-8">
          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">For Borrowers</h3>
            <p className="text-gray-700 mb-4">
              Traditional banks often require extensive paperwork, long waiting periods, and rigid approval processes. 
              Qarshain eliminates these barriers by offering fast approval times, competitive interest rates, and 
              a transparent process with no hidden fees. Our flexible terms allow you to choose repayment periods 
              that work for your financial situation, and you can manage your loans 24/7 through our intuitive platform.
            </p>
            <p className="text-gray-700">
              The platform's advanced risk assessment algorithms ensure that you receive fair interest rates based 
              on your actual creditworthiness, not just your credit score. This personalized approach means better 
              terms for responsible borrowers who might otherwise be overlooked by traditional financial institutions.
            </p>
          </div>
          
          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">For Lenders</h3>
            <p className="text-gray-700 mb-4">
              Qarshain provides an opportunity to earn higher returns than traditional savings accounts while 
              supporting the local economy. Our platform offers diversified investment options, allowing you to 
              spread risk across multiple loans. The automated management system handles the details, so you can 
              earn passive income with minimal effort.
            </p>
            <p className="text-gray-700">
              With full transparency into borrower profiles and comprehensive risk assessments, you can make 
              informed investment decisions. The platform's automated returns system ensures timely interest 
              payments and principal repayments, making it a reliable source of passive income.
            </p>
          </div>
          </div>
        </div>
      </section>

      {/* Email Reminder System */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-8">Automated Payment Reminders</h2>
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-8">
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
        </div>
      </section>

      {/* Conclusion */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-8">The Future of Digital Lending in Saudi Arabia</h2>
        <p className="text-lg text-gray-700 leading-relaxed mb-6">
          As Saudi Arabia continues its digital transformation journey under Vision 2030, platforms like Qarshain represent 
          the future of financial services. By combining traditional Islamic finance principles with modern technology, 
          these platforms are making financial services more accessible, efficient, and transparent for all Saudis.
        </p>
        
        <p className="text-lg text-gray-700 leading-relaxed mb-6">
          The success of peer-to-peer lending platforms depends not just on technology, but on building trust, ensuring 
          regulatory compliance, and creating value for all participants. Qarshain's approach to automated reminders, 
          risk assessment, and user experience demonstrates how thoughtful design can address real market needs.
        </p>
        
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-8 mt-8">
          <h3 className="text-xl font-bold text-blue-900 mb-4 flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Looking Ahead
          </h3>
          <p className="text-blue-800 text-lg leading-relaxed">
            The digital lending landscape in Saudi Arabia is still evolving, with new regulations and technologies 
            emerging regularly. Platforms that can adapt to these changes while maintaining focus on user needs and 
            regulatory compliance will likely shape the future of financial services in the region.
          </p>
        </div>
      </section>

      {/* Article Footer */}
      <footer className="border-t border-gray-200 pt-12 mt-16">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-8">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <span>Published December 15, 2024</span>
              <span>•</span>
              <span>Qarshain Editorial Team</span>
              <span>•</span>
              <span>8 min read</span>
            </div>
            <div className="flex items-center gap-3 mt-2">
              <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                Fintech
              </Badge>
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                Digital Lending
              </Badge>
              <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                Saudi Arabia
              </Badge>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm" className="flex items-center gap-2">
              <Share2 className="h-4 w-4" />
              Share Article
            </Button>
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200 rounded-xl p-6">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center flex-shrink-0">
              <AlertTriangle className="h-4 w-4 text-yellow-600" />
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Disclaimer</h4>
              <p className="text-sm text-gray-600 leading-relaxed">
                This article is for informational purposes only and does not constitute financial advice. 
                Please consult with qualified financial advisors before making investment decisions. 
                Qarshain is a registered financial services provider in Saudi Arabia.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
