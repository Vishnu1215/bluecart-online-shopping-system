import React, { useEffect, useState } from 'react';
import { ConsoleLayout } from '../../components/layout/ConsoleLayout';
import { Button } from '../../components/ui/Button';
import { StarRating } from '../../components/ui/StarRating';
import { reviewsApi } from '../../api/reviews.api';
import { useToast } from '../../context/ToastContext';
import { Review } from '../../types';
import { Star, Trash2, ShieldCheck, AlertCircle } from 'lucide-react';

export const AdminReviews: React.FC = () => {
  const { success, error } = useToast();
  const [reviews, setReviews] = useState<Review[]>([]);

  const loadReviews = async () => {
    const res = await reviewsApi.getAllReviews();
    if (res.success && res.data) {
      setReviews(res.data);
    }
  };

  useEffect(() => {
    loadReviews();
  }, []);

  const handleRemoveReview = async (reviewId: string) => {
    const res = await reviewsApi.removeReview(reviewId, 'Violation of community content policy', 'admin');
    if (res.success) {
      success('Review removed. Product average rating automatically recalculated (FR-27).');
      loadReviews();
    } else {
      error(res.error || 'Failed to remove review');
    }
  };

  return (
    <ConsoleLayout role="admin" title="Customer Reviews Moderation (FR-27)">
      <div className="space-y-6">
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-sm flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Star className="w-5 h-5 text-amber-500 fill-amber-500" /> Customer Feedback & Ratings Ledger
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Per FR-27, removing spam or inappropriate reviews triggers automated recalculation of product score and review count.
            </p>
          </div>
          <span className="text-xs font-bold px-3 py-1.5 rounded-xl bg-blue-50 text-primary border border-blue-200">
            Total Reviews: {reviews.length}
          </span>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-950 text-slate-500 uppercase tracking-wider font-bold border-b">
                <tr>
                  <th className="py-3 px-4">SKU</th>
                  <th className="py-3 px-4">Author</th>
                  <th className="py-3 px-4">Score</th>
                  <th className="py-3 px-4">Headline</th>
                  <th className="py-3 px-4">Comment</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4 text-right">Moderation Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {reviews.map(rev => (
                  <tr key={rev.id} className="hover:bg-slate-50/50">
                    <td className="py-3.5 px-4 font-mono font-bold text-primary">{rev.sku}</td>
                    <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-white">{rev.userName}</td>
                    <td className="py-3.5 px-4">
                      <StarRating rating={rev.rating} size="sm" />
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-slate-800 dark:text-slate-200">{rev.title}</td>
                    <td className="py-3.5 px-4 text-slate-600 dark:text-slate-400 max-w-xs">{rev.comment}</td>
                    <td className="py-3.5 px-4 text-slate-400">
                      {new Date(rev.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleRemoveReview(rev.id)}
                        className="text-rose-600 border-rose-200 hover:bg-rose-50"
                      >
                        <Trash2 className="w-3.5 h-3.5 mr-1" /> Remove
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </ConsoleLayout>
  );
};
