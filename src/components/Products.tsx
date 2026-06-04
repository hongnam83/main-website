'use client';
import { motion } from 'motion/react';
import { ArrowRight, CircleCheck as CheckCircle2 } from 'lucide-react';
import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { db, collection, getDocs } from '../localDB';

export interface ProductDetail {
  id: string;
  name: string;
  tag?: string;
  image: string;
  features: string[];
  mainUses: string[];
  specs?: string;
  ingredients?: string[];
  materials?: string[];
  variants?: {
    name: string;
    image: string;
    colorClass: string;
  }[];
}

function ProductCard({ product }: { product: ProductDetail }) {
  const { t } = useTranslation();
  const hasVariants = product.variants && product.variants.length > 0;
  // Always initialize to 0 to prevent out of bounds when component is reused with different props
  const [selectedVariant, setSelectedVariant] = useState(0);
  
  // Safe bounded index for variant access
  const safeVariantIndex = useMemo(() => {
    if (!hasVariants || !product.variants) return 0;
    return selectedVariant >= 0 && selectedVariant < product.variants.length ? selectedVariant : 0;
  }, [selectedVariant, hasVariants, product.variants]);

  const currentImage = hasVariants && product.variants ? product.variants[safeVariantIndex].image : product.image;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-[1.5rem] p-4 border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 group flex flex-col h-full cursor-pointer h-[28rem]"
    >
      <Link href={`/product/${product.id}`} className="block flex-grow flex flex-col h-full relative">
        {product.tag && (
          <div className="absolute top-2 right-2 z-20 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
            {t(product.tag)}
          </div>
        )}
        <div className="relative aspect-square rounded-[1rem] overflow-hidden bg-gray-50 mb-4 mix-blend-multiply flex-shrink-0">
          <img
            src={currentImage}
            alt={t(product.name)}
            className="w-full h-full object-cover mix-blend-multiply group-hover:scale-105 transition-transform duration-500"
          />
        </div>
        
        {hasVariants && product.variants && (
          <div className="flex items-center gap-2 mb-4 px-1 flex-shrink-0 z-10" onClick={(e) => e.preventDefault()}>
            {product.variants.map((variant, idx) => (
              <button
                key={idx}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setSelectedVariant(idx);
                }}
                className={`w-6 h-6 rounded-full border-2 transition-all ${
                  safeVariantIndex === idx ? 'border-gray-900 scale-110' : 'border-transparent hover:scale-110'
                } flex items-center justify-center`}
                title={t(variant?.name)}
              >
                <span className={`w-full h-full rounded-full ${variant.colorClass} shadow-inner`}></span>
              </button>
            ))}
            <span className="text-xs text-gray-500 ml-2 truncate">{t(product.variants[safeVariantIndex]?.name)}</span>
          </div>
        )}
        
        <div className="flex-grow flex flex-col justify-end">
          <h5 className="text-lg font-bold text-gray-900 mb-2 truncate">{t(product?.name)}</h5>
          <ul className="space-y-1 mb-4">
            {product.features?.slice(0, 2).map((feature, fIndex) => (
              <li key={fIndex} className="flex items-start text-sm text-gray-600">
                <CheckCircle2 className="w-4 h-4 text-brand-500 mr-2 shrink-0 mt-0.5" />
                <span className="leading-tight line-clamp-1">{t(feature)}</span>
              </li>
            ))}
          </ul>
          
          <div className="mt-auto pt-3 border-t border-gray-100 font-medium text-brand-800 text-sm flex items-center group-hover:text-brand-900">
            {t("Xem thêm")} <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

import { categories as defaultCategories } from '../data/products';

export default function Products() {
  const { t } = useTranslation();
  const [categories, setCategories] = useState<any[]>([]);

  useEffect(() => {
    const fetchCats = async () => {
      try {
        const snap = await getDocs(collection(db, 'products'));
        let fetchedCategories = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        if (fetchedCategories.length === 0) {
          fetchedCategories = defaultCategories;
        }
        setCategories(fetchedCategories);
      } catch (e) {
        setCategories(defaultCategories);
      }
    };
    fetchCats();
  }, []);
  return (
    <section className="py-24 bg-gray-50" id="products">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-brand-800 font-semibold tracking-wider uppercase text-sm mb-3">{t("Danh Mục Sản Phẩm")}</h2>
          <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            {t("Thiết kế chuyên biệt cho")} <br className="hidden md:block" /> <span className="font-serif italic text-brand-800">{t("Từng giai đoạn chỉnh nha")}</span>
          </h3>
          <p className="text-gray-600 text-lg">
            {t("Sự kết hợp hoàn hảo giữa y khoa và dược liệu tự nhiên. Khám phá các dòng sản phẩm của FURANO giúp bảo vệ nụ cười của bạn.")}
          </p>
        </div>

        <div className="space-y-24">
          {categories.map((category, catIndex) => (
            <div key={category.id} id={category.id} className="scroll-mt-32">
              <div className="mb-10 text-center md:text-left flex flex-col md:flex-row items-center md:items-end justify-between gap-4 border-b border-gray-200 pb-4">
                <div>
                  <h4 className="text-2xl font-bold text-gray-900">{t(category.title)}</h4>
                  <p className="text-gray-500 mt-2">{t(category.description)}</p>
                </div>
                <Link href={`/products`} className="flex items-center text-brand-800 font-medium hover:text-brand-900 group whitespace-nowrap">
                  {t("Xem tất cả")} {t(category.title)} <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>

              {category.heroImage && (
                <div className="w-full h-48 md:h-64 lg:h-80 rounded-[2rem] overflow-hidden mb-12 shadow-sm block group">
                  <img 
                    src={category.heroImage} 
                    alt={t(category.title)}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" 
                  />
                </div>
              )}

              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {category.products?.map((product: any, pIndex: number) => (
                  <ProductCard key={product?.id || pIndex} product={product} />
                ))}
              </div>
            </div>
          ))}
        </div>
        
      </div>
    </section>
  );
}
