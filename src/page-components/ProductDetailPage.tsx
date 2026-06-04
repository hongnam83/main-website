'use client';
import Link from 'next/link';
import { ArrowLeft, CircleCheck as CheckCircle2 } from 'lucide-react';
import { useState, useEffect, useMemo } from 'react';
import CTASection from '../components/CTASection';
import { useTranslation } from 'react-i18next';
import { db, collection, getDocs } from '../localDB';
import { categories as defaultCategories } from '../data/products';
import ProductReviews from '../components/ProductReviews';
import SEO from '../components/SEO';

export default function ProductDetailPage({ params }: { params?: { id?: string } }) {
  const id = params?.id;
  const { t } = useTranslation();

  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedVariant, setSelectedVariant] = useState(0);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const snap = await getDocs(collection(db, 'products'));
        let allCategories = snap.docs.map(doc => doc.data());
        if (allCategories.length === 0) {
          allCategories = defaultCategories;
        }
        const found = allCategories.flatMap(cat => cat.products || []).find((p: any) => p.id === id);
        setProduct(found || null);
        setSelectedVariant(0);
      } catch (err) {
        const found = defaultCategories.flatMap(cat => cat.products || []).find((p: any) => p.id === id);
        setProduct(found || null);
        setSelectedVariant(0);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
    window.scrollTo(0, 0);
  }, [id]);

  const hasVariants = product?.variants && product.variants.length > 0;

  const safeVariantIndex = useMemo(() => {
    if (!hasVariants || !product?.variants) return 0;
    return selectedVariant >= 0 && selectedVariant < product.variants.length ? selectedVariant : 0;
  }, [selectedVariant, hasVariants, product?.variants]);

  useEffect(() => {
    // moved to fetch fn
  }, [product?.id]);

  if (loading) {
    return (
      <div className="min-h-screen pt-32 px-4 max-w-7xl mx-auto flex flex-col lg:flex-row gap-12 animate-pulse">
        <div className="w-full lg:w-1/2 h-[500px] bg-gray-200 rounded-3xl"></div>
        <div className="w-full lg:w-1/2 flex flex-col gap-6 mt-8 lg:mt-0">
          <div className="h-6 bg-gray-200 rounded w-24"></div>
          <div className="h-12 bg-gray-200 rounded w-3/4"></div>
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="h-24 bg-gray-200 rounded w-full mt-4"></div>
          <div className="h-16 bg-gray-200 rounded w-full mt-4"></div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen pt-32 px-4 text-center">
        <h2 className="text-2xl font-bold mb-4">{t("Không tìm thấy sản phẩm")}</h2>
        <Link href="/products" className="text-brand-800 font-medium hover:underline">
          {t("Quay lại danh sách sản phẩm")}
        </Link>
      </div>
    );
  }

  const currentImage = hasVariants && product.variants ? product.variants[safeVariantIndex]?.image : product.image;

  const productSchema = {
    "@context": "https://schema.org/",
    "@type": "Product",
    "name": t(product.name),
    "image": currentImage,
    "description": t(product.mainUses?.[0] || ''),
    "brand": { "@type": "Brand", "name": "Furano" },
  };

  return (
    <main className="pt-24 min-h-screen bg-gray-50 flex flex-col">
      <SEO
        title={t(product.name)}
        description={t(product.mainUses?.[0] || '')}
        image={currentImage}
        schema={productSchema}
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex-grow w-full">
        <Link href="/products" className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-brand-800 mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" />
          {t("Tất cả sản phẩm")}
        </Link>

        <div className="grid md:grid-cols-2 gap-12 lg:gap-16 bg-white p-6 md:p-12 rounded-[2rem] shadow-sm border border-gray-100 items-start">
          {/* Image Gallery */}
          <div className="space-y-6 sticky top-24">
            <div className="aspect-square bg-gray-50 rounded-2xl overflow-hidden mix-blend-multiply flex items-center justify-center border border-gray-100">
              <img
                src={currentImage}
                alt={product.name}
                className="w-full h-full object-cover mix-blend-multiply rounded-2xl"
              />
            </div>

            {hasVariants && product.variants && (
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium text-gray-500">{t("Lựa chọn phân loại:")}</span>
                <div className="flex gap-3">
                  {product.variants.map((variant: any, idx: number) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedVariant(idx)}
                      className={`relative w-8 h-8 rounded-full border-2 transition-all ${
                        selectedVariant === idx ? 'border-gray-900 scale-110' : 'border-transparent hover:scale-110'
                      } flex items-center justify-center`}
                      title={t(variant?.name)}
                    >
                      <span className={`w-full h-full rounded-full ${variant.colorClass} shadow-inner`}></span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {hasVariants && product.variants && (
              <div className="p-4 bg-brand-50 rounded-xl">
                <p className="text-brand-800 font-medium">{t("Đang chọn:")} <span className="font-bold">{t(product.variants[safeVariantIndex]?.name)}</span></p>
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="flex flex-col">
            <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">{t(product?.name)}</h1>

            {product.specs && (
              <div className="inline-block px-4 py-2 bg-gray-100 rounded-lg text-sm font-medium text-gray-700 mb-6 w-fit">
                {t(product.specs)}
              </div>
            )}

            <div className="space-y-10">
              {product.mainUses && (
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4 border-b border-gray-100 pb-2">{t("Ưu Điểm Nổi Bật")}</h3>
                  <ul className="space-y-3">
                    {product.mainUses.map((use: string, i: number) => (
                      <li key={i} className="flex text-gray-600 leading-relaxed">
                        <CheckCircle2 className="w-5 h-5 text-brand-500 mr-3 shrink-0 mt-0.5" />
                        <span>{t(use)}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {product.ingredients && (
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4 border-b border-gray-100 pb-2">{t("Thành Phần & Công Thức")}</h3>
                  <ul className="space-y-3">
                    {product.ingredients.map((ing: string, i: number) => (
                      <li key={i} className="flex text-gray-600 leading-relaxed items-start">
                        <div className="w-1.5 h-1.5 rounded-full bg-brand-400 mr-3 mt-2 shrink-0"></div>
                        <span>{t(ing)}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {product.materials && (
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4 border-b border-gray-100 pb-2">{t("Cấu Tạo Bàn Chải")}</h3>
                  <ul className="space-y-3">
                    {product.materials.map((mat: string, i: number) => (
                      <li key={i} className="flex text-gray-600 leading-relaxed items-start">
                        <div className="w-1.5 h-1.5 rounded-full bg-brand-400 mr-3 mt-2 shrink-0"></div>
                        <span>{t(mat)}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <div className="mt-12 pt-8 border-t border-gray-100">
              <button className="w-full sm:w-auto px-8 py-4 bg-brand-800 hover:bg-brand-900 text-white font-bold rounded-xl transition-all shadow-md hover:shadow-xl hover:-translate-y-0.5 flex items-center justify-center text-lg">
                {t("Nhận Tư Vấn Cho Sản Phẩm Này")}
              </button>
            </div>

            <ProductReviews reviews={product.reviews} />
          </div>
        </div>
      </div>
      <CTASection />
    </main>
  );
}
