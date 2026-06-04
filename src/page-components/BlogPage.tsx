'use client';
import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Clock, ArrowRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import Link from 'next/link';
import { db, collection, getDocs } from '../localDB';
import { useSiteSettings } from '../contexts/SiteSettingsContext';
import { blogPosts as defaultBlogPosts } from '../data/blogPosts';
import SEO from '../components/SEO';

export default function BlogPage() {
  const { t, i18n } = useTranslation();
  const settings = useSiteSettings();
  const [visibleCount, setVisibleCount] = useState(12);
  const [blogPosts, setBlogPosts] = useState<any[]>(defaultBlogPosts);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const snapshot = await getDocs(collection(db, 'blogPosts'));
        const posts = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        if (posts.length > 0) setBlogPosts(posts);
      } catch (err) {
        // console.warn('Firebase fetch failed:', err);
      }
    };
    fetchPosts();
  }, []);

  const loadMore = () => {
    setVisibleCount(prev => Math.min(prev + 12, blogPosts.length));
  };
  
  const getLocalized = (post: any, field: string) => {
    if (i18n.language === 'en' && post[`${field}_en`]) {
      return post[`${field}_en`];
    }
    return post[field];
  };

  return (
    <main className="pt-24 pb-24 min-h-screen bg-gray-50">
      <SEO 
        title={t("Cẩm Nang Chăm Sóc Nụ Cười")}
        description={t("Kiến thức chuyên sâu và hướng dẫn chi tiết giúp bạn tự tin hơn trong suốt quá trình niềng răng.")}
      />
      {settings?.blogCoverImage && (
        <div className="w-full h-48 md:h-64 lg:h-80 relative overflow-hidden mb-12">
           <img src={settings.blogCoverImage} alt={t("Blog")} className="w-full h-full object-cover" />
           <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
             <h1 className="text-3xl md:text-5xl font-bold text-white tracking-widest uppercase">{t("Blog")}</h1>
           </div>
        </div>
      )}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {!settings?.blogCoverImage && (
          <div className="text-center max-w-2xl mx-auto mb-16 pt-8">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">{t("Cẩm Nang")} <span className="font-serif italic text-brand-800">{t("Chăm Sóc Nụ Cười")}</span></h1>
            <p className="text-lg text-gray-600">
              {t("Kiến thức chuyên sâu và hướng dẫn chi tiết giúp bạn tự tin hơn trong suốt quá trình niềng răng.")}
            </p>
          </div>
        )}

        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {blogPosts.slice(0, visibleCount).map((post, index) => (
            <Link href={`/blog/${post.id}`} key={post.id} className="block group cursor-pointer h-full">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col h-full hover:shadow-md transition-shadow"
              >
                <div className="relative aspect-[4/3] bg-gray-100 overflow-hidden">
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
                <div className="p-6 flex-grow flex flex-col">
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
                  <div className="mt-auto pt-4 flex items-center text-sm font-medium text-brand-800 border-t border-gray-50">
                    {t("Đọc tiếp")} <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </motion.div>
            </Link>
          ))}
        </div>

        {visibleCount < blogPosts.length && (
          <div className="mt-16 text-center">
            <button 
              onClick={loadMore}
              className="px-8 py-3 bg-white border border-gray-200 text-gray-700 font-medium rounded-full shadow-sm hover:bg-gray-50 hover:text-gray-900 transition-all active:scale-95"
            >
              {t("Xem thêm")} ({blogPosts.length - visibleCount})
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
