'use client';
import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, Clock, CalendarDays, Share2, ChevronRight } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import CTASection from '../components/CTASection';
import { db, doc, getDoc } from '../localDB';
import { blogPosts as defaultBlogPosts } from '../data/blogPosts';
import SEO from '../components/SEO';

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

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": post?.seoTitle || getLocalized('title'),
    "description": post?.seoDescription || getLocalized('excerpt'),
    "image": [post?.image],
    "datePublished": getLocalized('date'),
    "dateModified": getLocalized('date'),
    "author": [{ "@type": "Person", "name": "Chuyên gia Furano" }],
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col pt-28">
        <div className="max-w-4xl mx-auto w-full px-4 animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-24 mb-8"></div>
          <div className="h-12 bg-gray-200 rounded w-3/4 mb-4"></div>
          <div className="h-6 bg-gray-200 rounded w-1/2 mb-8"></div>
          <div className="h-[400px] bg-gray-200 rounded-3xl w-full mb-12"></div>
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

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col pt-[72px]">
      <SEO
        title={post.seoTitle || getLocalized('title')}
        description={post.seoDescription || getLocalized('excerpt')}
        image={post.image}
        url={typeof window !== 'undefined' ? window.location.href : ''}
        type="article"
        schema={articleSchema}
      />
      {/* Hero Header */}
      <div className="bg-white border-b border-gray-100 pt-16 pb-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link href="/blog" className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-brand-800 mb-8 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" />
            {t("Tất cả bài viết")}
          </Link>

          <div className="flex items-center gap-3 mb-6 flex-wrap">
            <span className="px-3 py-1 bg-brand-50 text-brand-800 text-xs font-bold rounded-full">
              {getLocalized('category')}
            </span>
            <span className="flex items-center text-gray-500 text-sm">
              <CalendarDays className="w-4 h-4 mr-1.5" />
              {getLocalized('date') || new Date().toLocaleDateString('vi-VN')}
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
            {post.seoDescription || getLocalized('excerpt')}
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex-grow w-full">
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden mb-12">
          {post.image && (
            <div className="aspect-[21/9] w-full bg-gray-100">
              <img
                src={post.image}
                alt={post.seoTitle || getLocalized('title')}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          <div className="p-8 md:p-12 lg:p-16">
            {post.blocks && post.blocks.length > 0 ? (
               <BlockRenderer blocks={post.blocks} showTOC={post.showTOC} />
            ) : (
               <div className="prose prose-lg md:prose-xl prose-brand max-w-none text-gray-700 view-markdown">
                 <ReactMarkdown>{getLocalized('content') || ''}</ReactMarkdown>
               </div>
            )}

            <div className="mt-16 pt-8 border-t border-gray-100 flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <span className="text-gray-900 font-medium">{t("Chia sẻ bài viết:")}</span>
                <button className="p-2 bg-gray-50 text-gray-600 rounded-full hover:bg-brand-50 hover:text-brand-800 transition-colors" title={t("Chia sẻ")}>
                  <Share2 className="w-5 h-5" />
                </button>
              </div>
              <Link href="/blog" className="px-6 py-3 bg-gray-900 text-white font-medium rounded-xl hover:bg-gray-800 transition-colors inline-flex items-center gap-2">
                {t("Đọc thêm bài khác")}
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      <CTASection />
    </div>
  );
}

function BlockRenderer({ blocks, showTOC }: { blocks: any[], showTOC?: boolean }) {
  // Generate Table of Contents automatically mapped by block ID
  const tocEntries: any[] = useMemo(() => {
    const toc: any[] = [];
    let h2Counter = 0;
    let h3Counter = 0;

    blocks.forEach(block => {
      if (block.type === 'h2') {
        h2Counter++;
        h3Counter = 0;
        toc.push({
          id: block.id,
          title: block.data.text,
          level: 2,
          number: `${h2Counter}`,
        });
      } else if (block.type === 'h3') {
        h3Counter++;
        const parentNumber = h2Counter > 0 ? h2Counter : 1;
        if(h2Counter === 0) h2Counter = 1; // Fallback if h3 comes before h2
        toc.push({
          id: block.id,
          title: block.data.text,
          level: 3,
          number: `${parentNumber}.${h3Counter}`,
        });
      }
    });
    return toc;
  }, [blocks]);

  const scrollToElement = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    const el = document.getElementById(`block-${id}`);
    if (el) {
      const headerOffset = 100;
      const elementPosition = el.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
    }
  };

  return (
    <div className="space-y-8 font-sans">
       {showTOC !== false && tocEntries.length > 0 && !blocks.find(b => b.type === 'toc') && (
         <div className="bg-gray-50 p-6 md:p-8 rounded-2xl border border-gray-100 mb-10">
           <h3 className="text-xl font-bold font-serif mb-4 flex items-center gap-2 text-gray-900">
             Mục lục bài viết
           </h3>
           <ul className="space-y-3">
             {tocEntries.map((entry, i) => (
               <li key={i} className={`${entry.level === 3 ? 'ml-6' : ''}`}>
                 <a 
                   href={`#block-${entry.id}`}
                   onClick={(e) => scrollToElement(e, entry.id)}
                   className={`flex hover:text-brand-700 transition-colors ${entry.level === 2 ? 'text-gray-900 font-medium' : 'text-gray-600'}`}
                 >
                   <span className="text-brand-600 mr-2 min-w-[24px] font-mono shrink-0">{entry.number}.</span>
                   <span>{entry.title}</span>
                 </a>
               </li>
             ))}
           </ul>
         </div>
       )}

       <div className="space-y-6 text-gray-800 text-lg leading-relaxed">
         {blocks.map((block: any) => {
            const data = block.data || {};
            // find matching TOC entry for numbering
            const tocEntry = tocEntries.find(t => t.id === block.id);

            switch(block.type) {
              case 'toc':
                  if (tocEntries.length === 0) return null;
                  return (
                    <div key={block.id} className="bg-gray-50 p-6 md:p-8 rounded-2xl border border-gray-100 my-10 w-full">
                       <h3 className="text-xl font-bold font-serif mb-4 flex items-center gap-2 text-gray-900">
                         Mục lục bài viết
                       </h3>
                       <ul className="space-y-3">
                         {tocEntries.map((entry, i) => (
                           <li key={i} className={`${entry.level === 3 ? 'ml-6' : ''}`}>
                             <a 
                               href={`#block-${entry.id}`}
                               onClick={(e) => scrollToElement(e, entry.id)}
                               className={`flex hover:text-brand-700 transition-colors ${entry.level === 2 ? 'text-gray-900 font-medium' : 'text-gray-600'}`}
                             >
                               <span className="text-brand-600 mr-2 min-w-[24px] font-mono shrink-0">{entry.number}.</span>
                               <span>{entry.title}</span>
                             </a>
                           </li>
                         ))}
                       </ul>
                    </div>
                  );
              case 'h2':
                return (
                  <h2 id={`block-${block.id}`} key={block.id} className="text-3xl font-bold text-gray-900 mt-12 mb-6 scroll-mt-24">
                    {tocEntry && <span className="text-brand-600 mr-2 font-mono select-none">{tocEntry.number}.</span>}
                    {data.text || ''}
                  </h2>
                );
              case 'h3':
                return (
                  <h3 id={`block-${block.id}`} key={block.id} className="text-2xl font-bold text-gray-900 mt-8 mb-4 scroll-mt-24">
                    {tocEntry && <span className="text-brand-600 mr-2 font-mono select-none">{tocEntry.number}.</span>}
                    {data.text || ''}
                  </h3>
                );
              case 'p':
                 return <div key={block.id} className="mb-4 prose prose-lg max-w-none text-gray-800 ql-editor" dangerouslySetInnerHTML={{ __html: data.text || '' }} />;
              case 'ul':
                 return (
                   <ul key={block.id} className="list-disc pl-6 mb-4 space-y-2">
                     {data.items?.map((item: string, i: number) => <li key={i}>{item}</li>)}
                   </ul>
                 );
              case 'ol':
                 return (
                   <ol key={block.id} className="list-decimal pl-6 mb-4 space-y-2 marker:text-brand-600 marker:font-bold">
                     {data.items?.map((item: string, i: number) => <li key={i}>{item}</li>)}
                   </ol>
                 );
              case 'note':
              case 'warning':
              case 'advice':
                 const styles = {
                   note: 'bg-blue-50 border-blue-500 text-blue-900',
                   warning: 'bg-amber-50 border-amber-500 text-amber-900',
                   advice: 'bg-green-50 border-green-500 text-green-900'
                 };
                 return (
                   <div key={block.id} className={`p-6 rounded-xl border-l-4 ${styles[block.type as keyof typeof styles]} my-8`}>
                     {data.title && <h4 className="font-bold text-lg mb-2">{data.title}</h4>}
                     <p className="whitespace-pre-wrap opacity-90">{data.content}</p>
                   </div>
                 );
              case 'table':
                 return (
                   <div key={block.id} className="overflow-x-auto w-full my-8">
                     <table className="w-full text-left border-collapse min-w-max">
                       <thead>
                         <tr>{data.headers?.map((h: string, i: number) => <th key={i} className="border border-gray-200 bg-gray-50 p-3 font-semibold text-gray-900">{h}</th>)}</tr>
                       </thead>
                       <tbody>
                         {data.rows?.map((row: any[], i: number) => (
                           <tr key={i} className="hover:bg-gray-50/50">
                             {row.map((cell: string, ci: number) => <td key={ci} className="border border-gray-200 p-3 text-gray-700 whitespace-pre-wrap">{cell}</td>)}
                           </tr>
                         ))}
                       </tbody>
                     </table>
                   </div>
                 );
              case 'image':
                 return (
                   <div key={block.id} className="my-10 w-full flex flex-col items-center text-center">
                     <img src={data.url} alt={data.alt} loading="lazy" className="max-w-full h-auto rounded-2xl mx-auto" />
                     {data.alt && <p className="text-sm text-gray-500 italic mt-3 text-center text-balance">{data.alt}</p>}
                   </div>
                 );
              case 'figure':
                 return (
                   <figure key={block.id} className="my-10 w-full flex flex-col items-center text-center">
                     <img src={data.url} alt={data.alt} loading="lazy" className="max-w-full h-auto rounded-2xl mb-3 mx-auto" />
                     {data.caption && <figcaption className="text-sm text-gray-500 italic text-center text-balance">{data.caption}</figcaption>}
                   </figure>
                 );
              case 'image-text':
                 return (
                   <div key={block.id} className={`my-10 flex flex-col md:flex-row gap-8 items-center ${data.layout === 'img-right' ? 'md:flex-row-reverse' : ''}`}>
                     <div className="w-full md:w-1/2">
                       <img src={data.url} alt={data.alt} loading="lazy" className="w-full rounded-2xl aspect-square md:aspect-auto object-cover" />
                     </div>
                     <div className="w-full md:w-1/2 prose prose-lg">
                       <p className="whitespace-pre-wrap">{data.text}</p>
                     </div>
                   </div>
                 );
              case 'images-2':
                 return (
                   <div key={block.id} className="my-10 grid grid-cols-1 md:grid-cols-2 gap-4">
                     <img src={data.url1} alt={data.alt1} loading="lazy" className="w-full aspect-[4/3] object-cover rounded-2xl" />
                     <img src={data.url2} alt={data.alt2} loading="lazy" className="w-full aspect-[4/3] object-cover rounded-2xl" />
                   </div>
                 );
              case 'gallery':
                 const imgs = data.images || [];
                 if (imgs.length === 0) return null;
                 const cols = imgs.length === 2 ? 'md:grid-cols-2' : imgs.length === 3 ? 'md:grid-cols-3' : 'md:grid-cols-2 lg:grid-cols-3';
                 return (
                   <div key={block.id} className={`my-10 grid grid-cols-1 gap-4 ${cols}`}>
                     {imgs.map((img: any, i: number) => (
                       <img key={i} src={img.url} alt={img.alt} loading="lazy" className="w-full aspect-square object-cover rounded-2xl" />
                     ))}
                   </div>
                 );
              default:
                 return null;
            }
         })}
       </div>
    </div>
  );
}
