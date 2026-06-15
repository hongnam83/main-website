'use client';
import { Star } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function ProductReviews({ reviews = [] }: { reviews?: any[] }) {
  const { t } = useTranslation();

  if (!reviews || reviews.length === 0) {
    return (
      <div className="mt-12 pt-8 border-t border-gray-100">
        <h3 className="text-xl font-bold text-gray-900 mb-6">{t("Đánh giá từ khách hàng")}</h3>
        <p className="text-gray-500 italic">{t("Chưa có đánh giá nào cho sản phẩm này.")}</p>
      </div>
    );
  }

  const averageRating = reviews.reduce((acc, curr) => acc + (Number(curr.rating) || 0), 0) / reviews.length;

  return (
    <div className="mt-12 pt-8 border-t border-gray-100">
      <h3 className="text-xl font-bold text-gray-900 mb-6">{t("Đánh giá từ khách hàng")} ({reviews.length})</h3>
      
      <div className="flex items-center gap-2 mb-8">
        <div className="flex text-yellow-400">
           {[...Array(5)].map((_, i) => (
             <Star key={i} className={`w-6 h-6 ${i < Math.round(averageRating) ? 'fill-current' : 'text-gray-300'}`} />
           ))}
        </div>
        <span className="text-lg font-medium text-gray-700">{averageRating.toFixed(1)} / 5</span>
      </div>

      <div className="space-y-6">
        {reviews.map((review, idx) => (
          <div key={idx} className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
            <div className="flex items-center justify-between mb-3">
              <span className="font-bold text-gray-900">{review.authorName || review.name}</span>
              <span className="text-sm text-gray-500">{review.date}</span>
            </div>
            <div className="flex text-yellow-400 mb-3">
              {[...Array(5)].map((_, i) => (
                 <Star key={i} className={`w-4 h-4 ${i < (Number(review.rating) || 0) ? 'fill-current' : 'text-gray-300'}`} />
               ))}
            </div>
            <p className="text-gray-700 leading-relaxed mb-3">{review.comment}</p>
            {review.image && (
              <img src={review.image} alt="User upload" className="max-w-[150px] max-h-[150px] rounded-lg border object-cover" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
