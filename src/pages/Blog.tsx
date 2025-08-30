import React from 'react';
import { BlogPost } from '@/components/BlogPost';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

const Blog: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="pt-20">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">Blog Test</h1>
          <p className="text-lg text-gray-700">If you can see this, the blog page is working!</p>
        </div>
        <BlogPost />
      </main>
      <Footer />
    </div>
  );
};

export default Blog;
