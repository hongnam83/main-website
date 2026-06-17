'use client';
import { motion } from 'motion/react';
import { ArrowRight, Clock } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { db, collection, getDocs } from '../localDB';
import { blogPosts as defaultBlogPosts } from '../data/blogPosts';

export default function Blog() {
  const { t, i18n } = useTranslation();
  const [blogPosts, setBlogPosts] = useState<any[]>(() => defaultBlogPosts.filter((p: any) => p.status === 'published' || !p.status));

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const snapshot = await getDocs(collection(db, 'blogPosts'));
        let posts = snapshot.docs.map((doc: any) => ({ id: doc.id, ...doc.data() }));
        posts = posts.filter((p: any) => p.status === 'published' || !p.status);
        if (posts.length > 0) setBlogPosts(posts);
      } catch (err) {}
    };
    fetchPosts();

    const handleUpdate = () => {
      fetchPosts();
    };
    if (typeof window !== 'undefined') {
      window.addEventListener('localDB_updated', handleUpdate);
    }
    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('localDB_updated', handleUpdate);
      }
    };
  }, []);

  const latestPosts = blogPosts.slice(0, 4);

  const getLocalized = (post: any, field: string) => {
    if (i18n.language === 'en' && post[`${field}_en`]) {
      return post[`${field}_en`];
    }
    return post[field];
  };

  return (
    <section className="py-24 bg-white border-t border-gray-100" id="blog">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
          <div className="max-w-2xl">
            <h2 className="text-brand-800 font-semibold tracking-wider uppercase text-sm mb-3">{t("Góc Kiến Thức")}</h2>
            <h3 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight">
              {t("Cẩm Nang")} <span className="font-serif italic text-brand-800">{t("Chăm Sóc Nụ Cười")}</span>
            </h3>
          </div>
          <Link href="/blog" className="hidden md:inline-flex items-center text-brand-800 font-medium hover:text-brand-900 group">
            {t("Xem Tất Cả Bài Viết")}
            <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {latestPosts.map((post, index) => (
            <Link href={`/blog/${post.id}`} key={post.id} className="block group cursor-pointer flex flex-col h-full h-full">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3 }}
                className="flex flex-col h-full"
              >
                <div className="relative aspect-[4/3] rounded-2xl overflow-hidden mb-6 bg-gray-100">
                  <img 
                    src={post.image} 
                    alt={getLocalized(post, 'title')} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 bg-white/90 backdrop-blur text-brand-800 text-xs font-bold rounded-full shadow-sm">
                      {getLocalized(post, 'category')}
                    </span>
                  </div>
                </div>
                <div className="flex-grow flex flex-col">
                  <div className="flex items-center text-gray-500 text-xs mb-3">
                    <Clock className="w-3.5 h-3.5 mr-1" />
                    {getLocalized(post, 'date')}
                  </div>
                  <h4 className="text-lg font-bold text-gray-900 mb-3 group-hover:text-brand-800 transition-colors line-clamp-2">
                    {getLocalized(post, 'title')}
                  </h4>
                  <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-3">
                    {getLocalized(post, 'excerpt')}
                  </p>
                  <div className="mt-auto pt-4 flex items-center text-sm font-medium text-brand-800">
                    {t("Đọc tiếp")} <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </motion.div>
            </Link>
          ))}
        </div>
        
        <div className="mt-8 text-center md:hidden">
          <Link href="/blog" className="inline-flex items-center text-brand-800 font-medium hover:text-brand-900 group">
            {t("Xem Tất Cả Bài Viết")}
            <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  );
}
