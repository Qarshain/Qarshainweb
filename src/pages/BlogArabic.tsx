import React from 'react';
import { BlogPostArabic } from '@/components/BlogPostArabic';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const BlogArabic: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="pt-20">
        <BlogPostArabic />
      </main>
      <Footer />
    </div>
  );
};

export default BlogArabic;
