'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, Clock, CalendarDays, Share2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import CTASection from '../components/CTASection';
import { db, doc, getDoc } from '../localDB';
import { blogPosts as defaultBlogPosts } from '../data/blogPosts';
import SEO from '../components/SEO';
import BlogBlockRenderer from '../components/BlogBlockRenderer';

export default function BlogDetailPage({ params }: { params?: { id?: string } }) {
  const id = params?.id;
  const { t, i18n } = useTranslation();

  const [post, setPost] = useState<any>(() => defaultBlogPosts.find(p => p.id === id) || null);
  const [loading, setLoading] = useState(!post);

  useEffect(() => {
    const fetchPost = async () => {
      if (!id) return;
      try {
        const docSnap = await getDoc(doc(db, 'blogPosts', id));
        if (docSnap.exists()) {
          setPost({ id: docSnap.id, ...docSnap.data() });
        }
      } catch (err) {
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
    window.scrollTo(0, 0);

    const handleUpdate = () => {
      fetchPost();
    };
    if (typeof window !== 'undefined') {
      window.addEventListener('localDB_updated', handleUpdate);
    }
    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('localDB_updated', handleUpdate);
      }
    };
  }, [id]);

  const getLocalized = (field: string) => {
    if (!post) return '';
    if (i18n.language === 'en' && post[`${field}_en`]) {
      return post[`${field}_en`];
    }
    return post[field];
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col pt-28">
        <div className="max-w-4xl mx-auto w-full px-4 animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-24 mb-8"></div>
          <div className="h-12 bg-gray-200 rounded w-3/4 mb-4"></div>
          <div className="h-6 bg-gray-200 rounded w-1/2 mb-8"></div>
          <div className="h-[400px] bg-gray-200 rounded-3xl w-full mb-12"></div>
          <div className="space-y-4">
            <div className="h-4 bg-gray-200 rounded w-full"></div>
            <div className="h-4 bg-gray-200 rounded w-full"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen pt-32 px-4 text-center">
        <h2 className="text-2xl font-bold mb-4">{t("Không tìm thấy bài viết")}</h2>
        <Link href="/blog" className="text-brand-800 font-medium hover:underline">
          {t("Quay lại danh sách bài viết")}
        </Link>
      </div>
    );
  }

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": getLocalized('title'),
    "image": [post.image],
    "datePublished": getLocalized('date'),
    "dateModified": getLocalized('date'),
    "author": [{ "@type": "Person", "name": "Chuyên gia Furano" }],
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <SEO
        title={getLocalized('title')}
        description={getLocalized('excerpt')}
        image={post.image}
        type="article"
        schema={articleSchema}
      />
      {/* Hero Header */}
      <div className="bg-white border-b border-gray-100 pt-28 pb-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link href="/blog" className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-brand-800 mb-8 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" />
            {t("Tất cả bài viết")}
          </Link>

          <div className="flex items-center gap-3 mb-6">
            <span className="px-3 py-1 bg-brand-50 text-brand-800 text-xs font-bold rounded-full">
              {getLocalized('category')}
            </span>
            <span className="flex items-center text-gray-500 text-sm">
              <CalendarDays className="w-4 h-4 mr-1.5" />
              {getLocalized('date')}
            </span>
            <span className="flex items-center text-gray-500 text-sm ml-2">
              <Clock className="w-4 h-4 mr-1.5" />
              5 {t("phút đọc")}
            </span>
          </div>

          <h1 className="text-3xl md:text-5xl font-bold text-gray-900 leading-tight mb-6">
            {getLocalized('title')}
          </h1>

          <p className="text-xl text-gray-600 leading-relaxed">
            {getLocalized('excerpt')}
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex-grow w-full view-markdown">
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden mb-12">
          <div className="aspect-[21/9] w-full bg-gray-100">
            <img
              src={post.image}
              alt={getLocalized('title')}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="p-8 md:p-12 lg:p-16">
            {post.blocks && post.blocks.length > 0 ? (
              <BlogBlockRenderer blocks={post.blocks} />
            ) : (
              <div className="prose prose-lg md:prose-xl prose-brand max-w-none text-gray-700">
                <ReactMarkdown>{getLocalized('content') || ''}</ReactMarkdown>
              </div>
            )}

            <div className="mt-16 pt-8 border-t border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <span className="text-gray-900 font-medium">{t("Chia sẻ bài viết:")}</span>
                <button className="p-2 bg-gray-50 text-gray-600 rounded-full hover:bg-brand-50 hover:text-brand-800 transition-colors" title={t("Chia sẻ")}>
                  <Share2 className="w-5 h-5" />
                </button>
              </div>
              <Link href="/blog" className="px-6 py-2 bg-gray-900 text-white font-medium rounded-xl hover:bg-gray-800 transition-colors">
                {t("Đọc thêm bài khác")}
              </Link>
            </div>
          </div>
        </div>
      </div>

      <CTASection />
    </div>
  );
}
