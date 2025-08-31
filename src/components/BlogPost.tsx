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
  Clock,
  CheckCircle,
  AlertTriangle,
  Bell,
  BookOpen,
  Target,
  Zap
} from 'lucide-react';

export const BlogPost: React.FC = () => {
  return (
    <article className="max-w-4xl mx-auto px-6 py-12">
      {/* Article Header */}
      <header className="mb-16 text-center">
        <div className="mb-8">
          <div className="flex items-center justify-center gap-3 mb-6">
            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 px-4 py-2">
              <BookOpen className="h-4 w-4 mr-2" />
              Fintech Guide
            </Badge>
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 px-4 py-2">
              <Target className="h-4 w-4 mr-2" />
              P2P Lending
            </Badge>
            <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200 px-4 py-2">
              <Zap className="h-4 w-4 mr-2" />
              Saudi Arabia
            </Badge>
          </div>
          
          <h1 className="text-5xl font-bold text-gray-900 mb-6 leading-tight">
            How Peer-to-Peer Lending Works: A Complete Guide for Saudi Arabia
          </h1>
          
          <p className="text-xl text-gray-600 leading-relaxed mb-8 max-w-3xl mx-auto">
            Discover how peer-to-peer lending is revolutionizing finance in Saudi Arabia. Learn the basics, benefits, and how platforms like Qarshain are making lending more accessible and profitable for everyone.
          </p>
          
          <div className="flex items-center justify-center gap-8 text-sm text-gray-500 mb-8">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>December 15, 2024</span>
            </div>
            <div className="flex items-center gap-2">
              <User className="h-4 w-4" />
              <span>Qarshain Team</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span>6 min read</span>
            </div>
          </div>
        </div>
        
        {/* Featured Image */}
        <div className="w-full h-80 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-2xl mb-12 flex items-center justify-center border border-gray-200">
          <div className="text-center">
            <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <TrendingUp className="h-10 w-10 text-blue-600" />
            </div>
            <p className="text-gray-600 font-medium">Peer-to-Peer Lending Platform</p>
          </div>
        </div>
      </header>

      {/* Article Content */}
      <div className="prose prose-lg max-w-none">
        
        {/* Introduction */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">What is Peer-to-Peer Lending?</h2>
          <p className="text-lg text-gray-700 leading-relaxed mb-6">
            Peer-to-peer (P2P) lending is a revolutionary financial model that connects borrowers directly with lenders through digital platforms, eliminating traditional banks as intermediaries. In Saudi Arabia, this innovative approach is gaining momentum as part of Vision 2030's digital transformation goals.
          </p>
          <p className="text-lg text-gray-700 leading-relaxed mb-6">
            Instead of going through lengthy bank processes, individuals and businesses can now access funding directly from other individuals or institutions who want to invest their money for better returns. This creates a win-win situation for both parties.
          </p>
          
          <div className="bg-blue-50 border-l-4 border-blue-500 p-6 my-8 rounded-r-lg">
            <h3 className="text-xl font-bold text-blue-900 mb-3 flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Shariah Compliance
            </h3>
            <p className="text-blue-800">
              All P2P lending on Qarshain follows Islamic finance principles, ensuring no interest (riba) is charged. Instead, we use profit-sharing models that are fully compliant with Shariah law.
            </p>
          </div>
        </section>

        {/* How It Works */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">How P2P Lending Works</h2>
          
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <Card className="p-6 border-2 border-green-200 bg-green-50">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                    <User className="h-5 w-5 text-white" />
                  </div>
                  <CardTitle className="text-xl text-green-900">For Borrowers</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <ol className="space-y-3 text-green-800">
                  <li className="flex items-start gap-3">
                    <span className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-bold">1</span>
                    <span>Submit loan application with required documents</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-bold">2</span>
                    <span>Get verified and receive risk assessment</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-bold">3</span>
                    <span>Lenders fund your loan request</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-bold">4</span>
                    <span>Receive funds and start repayment</span>
                  </li>
                </ol>
              </CardContent>
            </Card>

            <Card className="p-6 border-2 border-blue-200 bg-blue-50">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                    <TrendingUp className="h-5 w-5 text-white" />
                  </div>
                  <CardTitle className="text-xl text-blue-900">For Lenders</CardTitle>
          </div>
              </CardHeader>
              <CardContent>
                <ol className="space-y-3 text-blue-800">
                  <li className="flex items-start gap-3">
                    <span className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">1</span>
                    <span>Browse verified loan opportunities</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">2</span>
                    <span>Review borrower profiles and risk assessments</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">3</span>
                    <span>Choose loans that match your risk profile</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">4</span>
                    <span>Earn returns through profit-sharing</span>
                  </li>
                </ol>
              </CardContent>
            </Card>
        </div>
      </section>

        {/* Benefits */}
      <section className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Why Choose P2P Lending?</h2>
          
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="p-6 text-center hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Faster Access</h3>
              <p className="text-gray-600">Get funding in days, not weeks. No lengthy bank procedures or paperwork delays.</p>
            </Card>

            <Card className="p-6 text-center hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Better Returns</h3>
              <p className="text-gray-600">Earn higher returns than traditional savings accounts while supporting local businesses.</p>
            </Card>

            <Card className="p-6 text-center hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Transparent & Secure</h3>
              <p className="text-gray-600">Full transparency with comprehensive risk assessments and secure transactions.</p>
            </Card>
        </div>
      </section>

        {/* Getting Started */}
      <section className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Getting Started with Qarshain</h2>
          
          <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Ready to Begin Your P2P Lending Journey?</h3>
            <p className="text-lg text-gray-700 mb-6">
              Whether you're looking to borrow for personal or business needs, or want to invest your money for better returns, Qarshain provides a secure, Shariah-compliant platform for peer-to-peer lending in Saudi Arabia.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="bg-green-600 hover:bg-green-700" asChild>
                <Link to="/loan-request">
                  <User className="h-5 w-5 mr-2" />
                  Request a Loan
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link to="/invest">
                  <TrendingUp className="h-5 w-5 mr-2" />
                  Start Investing
                </Link>
              </Button>
            </div>
        </div>
      </section>

      </div>

      {/* Article Footer */}
      <footer className="border-t border-gray-200 pt-12 mt-16">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-8">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-3">
              <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                Fintech Guide
              </Badge>
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                P2P Lending
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
        
        {/* Author Info */}
        <div className="bg-gray-50 rounded-xl p-6">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center flex-shrink-0">
              <User className="h-8 w-8 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Qarshain Team</h3>
              <p className="text-gray-600 mb-3">
                Our team of financial experts and technology specialists is dedicated to making peer-to-peer lending accessible, secure, and profitable for everyone in Saudi Arabia.
              </p>
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <span>Published December 15, 2024</span>
                <span>•</span>
                <span>6 min read</span>
              </div>
        </div>
      </div>
        </div>
      </footer>
    </article>
  );
};
