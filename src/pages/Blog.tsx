import React from 'react';
import { BlogPost } from '@/components/BlogPost';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const Blog: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="pt-20">
        <BlogPost />
      </main>
      <Footer />
    </div>
  );
};

export default Blog;
