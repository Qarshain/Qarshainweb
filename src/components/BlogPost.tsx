import React from 'react';
import { Link } from 'react-router-dom';
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
    <div className="max-w-5xl mx-auto px-6 py-12">
      {/* Article Hero Section */}
      <header className="mb-16">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-8">
            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 px-4 py-2 text-sm font-medium">
              Fintech
            </Badge>
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 px-4 py-2 text-sm font-medium">
              Digital Lending
            </Badge>
            <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200 px-4 py-2 text-sm font-medium">
              Saudi Arabia
            </Badge>
          </div>
          
          <h1 className="text-6xl font-bold text-gray-900 mb-8 leading-tight tracking-tight max-w-4xl mx-auto">
            How Qarshain Works: Revolutionizing Digital Lending in Saudi Arabia
          </h1>
          
          <p className="text-2xl text-gray-600 leading-relaxed mb-12 max-w-4xl mx-auto font-light">
            Discover how Qarshain is transforming the financial landscape in Saudi Arabia through innovative peer-to-peer lending technology, automated payment systems, and user-centric design.
          </p>
          
          <div className="flex items-center justify-center gap-12 text-sm text-gray-500 mb-8">
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              <span className="font-medium">December 15, 2024</span>
            </div>
            <div className="flex items-center gap-2">
              <User className="h-5 w-5" />
              <span className="font-medium">Qarshain Editorial Team</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              <span className="font-medium">8 min read</span>
            </div>
          </div>
        </div>
        
        {/* Featured Image Placeholder */}
        <div className="w-full h-96 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-2xl mb-12 flex items-center justify-center border border-gray-200">
          <div className="text-center">
            <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <TrendingUp className="h-12 w-12 text-blue-600" />
            </div>
            <p className="text-gray-600 font-medium">Featured Image: Digital Lending Platform</p>
          </div>
        </div>
      </header>

      {/* Table of Contents */}
      <div className="bg-gray-50 border border-gray-200 rounded-xl p-8 mb-16">
        <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
          <Tag className="h-5 w-5" />
          Table of Contents
        </h3>
        <nav className="space-y-3">
          <a href="#introduction" className="block text-gray-700 hover:text-blue-600 transition-colors">
            <span className="font-medium">1.</span> Introduction
          </a>
          <a href="#how-it-works" className="block text-gray-700 hover:text-blue-600 transition-colors">
            <span className="font-medium">2.</span> How the Platform Works
          </a>
          <a href="#advantage" className="block text-gray-700 hover:text-blue-600 transition-colors">
            <span className="font-medium">3.</span> The Qarshain Advantage
          </a>
          <a href="#reminders" className="block text-gray-700 hover:text-blue-600 transition-colors">
            <span className="font-medium">4.</span> Automated Payment Reminders
          </a>
          <a href="#conclusion" className="block text-gray-700 hover:text-blue-600 transition-colors">
            <span className="font-medium">5.</span> The Future of Digital Lending
          </a>
        </nav>
      </div>

      {/* Article Introduction */}
      <section id="introduction" className="mb-16">
        <h2 className="text-4xl font-bold text-gray-900 mb-8">Introduction</h2>
        <div className="prose prose-xl max-w-none">
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
      <section id="how-it-works" className="mb-16">
        <h2 className="text-4xl font-bold text-gray-900 mb-8">How the Platform Works</h2>
        
        <div className="prose prose-lg max-w-none">
          <p className="text-lg text-gray-700 leading-relaxed mb-8">
            Qarshain operates on a sophisticated dual-sided marketplace model that seamlessly connects borrowers seeking funding with lenders looking for investment opportunities. The platform's architecture is designed to eliminate traditional banking friction while maintaining the highest standards of security, transparency, and user experience.
          </p>
        </div>

        <div className="space-y-16">
          {/* For Borrowers */}
          <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm">
            <h3 className="text-3xl font-bold text-gray-900 mb-8 flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center">
                <User className="h-6 w-6 text-white" />
              </div>
              For Borrowers: A Streamlined Journey to Funding
            </h3>
            
            <div className="prose prose-lg max-w-none">
              <p className="text-lg text-gray-700 leading-relaxed mb-6">
                The borrower experience on Qarshain is designed around simplicity and speed. Unlike traditional banks that require extensive paperwork and lengthy approval processes, our platform leverages advanced technology to deliver funding decisions in minutes rather than weeks.
              </p>
              
              <p className="text-gray-700 leading-relaxed mb-6">
                The journey begins with a straightforward registration process that combines identity verification with comprehensive Know Your Customer (KYC) procedures. Our system integrates with Saudi Arabia's national identity infrastructure to ensure rapid yet thorough verification. Once registered, borrowers can immediately access the loan application interface, where they can specify their funding requirements, preferred terms, and provide supporting documentation.
              </p>
              
              <p className="text-gray-700 leading-relaxed mb-6">
                The platform's intelligent matching algorithm then analyzes the loan request against our network of verified lenders, considering factors such as risk appetite, investment preferences, and portfolio diversification needs. This AI-driven approach ensures that borrowers are connected with lenders who are genuinely interested in their specific type of loan, resulting in faster approvals and more competitive interest rates.
              </p>
              
              <p className="text-gray-700 leading-relaxed">
                Once funding is secured, borrowers benefit from our comprehensive payment management system, which includes automated reminders, flexible payment options, and real-time loan tracking. The system is designed to help borrowers maintain good payment history while providing the flexibility to adjust payment schedules when needed.
              </p>
            </div>
          </div>

          {/* For Lenders */}
          <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm">
            <h3 className="text-3xl font-bold text-gray-900 mb-8 flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-white" />
              </div>
              For Lenders: Intelligent Investment Opportunities
            </h3>
            
            <div className="prose prose-lg max-w-none">
              <p className="text-lg text-gray-700 leading-relaxed mb-6">
                Lenders on Qarshain gain access to a curated marketplace of verified loan opportunities, each accompanied by comprehensive risk assessments and borrower profiles. Our platform transforms traditional lending from a passive activity into an active, data-driven investment strategy.
              </p>
              
              <p className="text-gray-700 leading-relaxed mb-6">
                The investment process begins with our sophisticated opportunity discovery system, which presents lenders with loan requests that match their specific risk tolerance and investment criteria. Each opportunity includes detailed borrower information, credit assessments, loan purpose verification, and historical performance data when available. This transparency allows lenders to make informed decisions based on comprehensive data rather than limited application forms.
              </p>
              
              <p className="text-gray-700 leading-relaxed mb-6">
                Our platform's risk management tools enable lenders to diversify their portfolios across multiple loans, reducing overall risk exposure while maximizing potential returns. The system provides real-time analytics and performance tracking, allowing lenders to monitor their investments and adjust their strategies based on market conditions and portfolio performance.
              </p>
              
              <p className="text-gray-700 leading-relaxed">
                The automated returns system ensures that lenders receive their interest payments and principal repayments on schedule, with full transparency into payment status and borrower communication. This hands-off approach allows lenders to focus on portfolio optimization while the platform handles the operational complexities of loan management and collection.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Section Divider */}
      <div className="flex items-center justify-center my-16">
        <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
        <div className="mx-8 w-3 h-3 bg-blue-500 rounded-full"></div>
        <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
      </div>

      {/* The Qarshain Advantage */}
      <section id="advantage" className="mb-16">
        <h2 className="text-4xl font-bold text-gray-900 mb-12 text-center">The Qarshain Advantage</h2>
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-2xl p-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center">
                <User className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900">For Borrowers</h3>
            </div>
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
          
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-2xl p-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900">For Lenders</h3>
            </div>
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
      </section>

      {/* Section Divider */}
      <div className="flex items-center justify-center my-16">
        <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
        <div className="mx-8 w-3 h-3 bg-green-500 rounded-full"></div>
        <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
      </div>

      {/* Email Reminder System */}
      <section id="reminders" className="mb-16">
        <h2 className="text-4xl font-bold text-gray-900 mb-8">Automated Payment Reminders</h2>
        
        <div className="prose prose-lg max-w-none">
          <p className="text-lg text-gray-700 leading-relaxed mb-8">
            Our advanced email reminder system ensures borrowers never miss a payment, with beautiful Arabic RTL templates and smart scheduling. This comprehensive system operates on multiple levels to maintain healthy loan relationships and minimize defaults.
          </p>
        </div>

        <div className="space-y-12">
          <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm">
            <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center">
                <Clock className="h-6 w-6 text-white" />
              </div>
              Upcoming Payment Reminders
            </h3>
            <p className="text-lg text-gray-700 leading-relaxed mb-4">
              Our system proactively sends friendly reminders to borrowers three days before their payment due date. These notifications are designed to be helpful rather than intrusive, providing clear information about the upcoming payment amount, due date, and available payment methods.
            </p>
            <p className="text-gray-700 leading-relaxed">
              The reminders include direct links to payment portals and contact information for borrowers who may need assistance or have questions about their loan terms. This early notification system has proven to significantly reduce late payments and improve overall borrower satisfaction.
            </p>
            </div>
            
          <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm">
            <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center">
                <AlertTriangle className="h-6 w-6 text-white" />
              </div>
              Overdue Payment Warnings
            </h3>
            <p className="text-lg text-gray-700 leading-relaxed mb-4">
              When a payment becomes overdue, our system automatically escalates the communication strategy. Borrowers receive clear warnings about their overdue status, including the number of days past due and any applicable late fees or penalties.
            </p>
            <p className="text-gray-700 leading-relaxed">
              These warnings are designed to be firm but fair, emphasizing the importance of maintaining good payment history while offering support and flexible payment options when appropriate. The system also provides lenders with real-time updates on payment status and borrower communication.
            </p>
            </div>
            
          <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm">
            <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center">
                <Bell className="h-6 w-6 text-white" />
              </div>
              Final Notice and Escalation
            </h3>
            <p className="text-lg text-gray-700 leading-relaxed mb-4">
              After seven days of overdue status, the system issues final notices to borrowers. These communications are more urgent in tone while still maintaining professionalism and offering clear paths to resolution.
            </p>
            <p className="text-gray-700 leading-relaxed">
              The final notice system includes automatic escalation to our customer support team and, when necessary, coordination with our risk management department. This ensures that serious payment issues are addressed promptly while maintaining the platform's commitment to fair and transparent lending practices.
            </p>
          </div>
        </div>
      </section>

      {/* Section Divider */}
      <div className="flex items-center justify-center my-16">
        <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
        <div className="mx-8 w-3 h-3 bg-purple-500 rounded-full"></div>
        <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
      </div>

      {/* Conclusion */}
      <section id="conclusion" className="mb-16">
        <div className="bg-gradient-to-br from-gray-50 to-white border border-gray-200 rounded-3xl p-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-8 text-center">The Future of Digital Lending in Saudi Arabia</h2>
          
          <div className="prose prose-xl max-w-none text-center mb-8">
            <p className="text-xl text-gray-700 leading-relaxed mb-6">
              As Saudi Arabia continues its digital transformation journey under Vision 2030, platforms like Qarshain represent 
              the future of financial services. By combining traditional Islamic finance principles with modern technology, 
              these platforms are making financial services more accessible, efficient, and transparent for all Saudis.
            </p>
            
            <p className="text-lg text-gray-700 leading-relaxed mb-8">
              The success of peer-to-peer lending platforms depends not just on technology, but on building trust, ensuring 
              regulatory compliance, and creating value for all participants. Qarshain's approach to automated reminders, 
              risk assessment, and user experience demonstrates how thoughtful design can address real market needs.
            </p>
          </div>
          
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-8">
            <h3 className="text-2xl font-bold text-blue-900 mb-6 flex items-center justify-center gap-3">
              <TrendingUp className="h-6 w-6" />
              Looking Ahead
            </h3>
            <p className="text-blue-800 text-lg leading-relaxed text-center">
              The digital lending landscape in Saudi Arabia is still evolving, with new regulations and technologies 
              emerging regularly. Platforms that can adapt to these changes while maintaining focus on user needs and 
              regulatory compliance will likely shape the future of financial services in the region.
            </p>
          </div>
        </div>
      </section>

      {/* Author Bio */}
      <div className="bg-gray-50 border border-gray-200 rounded-xl p-8 mb-12">
        <div className="flex items-start gap-6">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center flex-shrink-0">
            <User className="h-10 w-10 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-bold text-gray-900 mb-2">Qarshain Editorial Team</h3>
            <p className="text-gray-600 mb-4">
              Our editorial team consists of financial experts, technology specialists, and market analysts dedicated to providing accurate, 
              insightful content about the evolving landscape of digital finance in Saudi Arabia.
            </p>
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <span>Published December 15, 2024</span>
              <span>•</span>
              <span>8 min read</span>
              <span>•</span>
              <span>Updated 2 days ago</span>
            </div>
          </div>
        </div>
      </div>

      {/* Article Footer */}
      <footer className="border-t border-gray-200 pt-12 mt-16">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-8">
          <div className="flex flex-col gap-2">
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
            <Button variant="outline" size="sm" className="flex items-center gap-2" asChild>
              <Link to="/blog-ar">العربية</Link>
            </Button>
          </div>
        </div>
        
        {/* Related Articles */}
        <div className="mt-12">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">Related Articles</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 bg-gradient-to-br from-green-50 to-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <TrendingUp className="h-8 w-8 text-green-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Understanding P2P Lending Risks</h4>
                  <p className="text-gray-600 text-sm mb-3">Learn about risk management strategies for peer-to-peer lending platforms.</p>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <Calendar className="h-3 w-3" />
                    <span>Dec 10, 2024</span>
                    <span>•</span>
                    <span>5 min read</span>
                  </div>
                </div>
              </div>
            </Card>
            
            <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Shield className="h-8 w-8 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Saudi Fintech Regulations 2024</h4>
                  <p className="text-gray-600 text-sm mb-3">A comprehensive guide to the latest regulatory changes in Saudi fintech.</p>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <Calendar className="h-3 w-3" />
                    <span>Dec 8, 2024</span>
                    <span>•</span>
                    <span>7 min read</span>
                  </div>
                </div>
              </div>
            </Card>
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
