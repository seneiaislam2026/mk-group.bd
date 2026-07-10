import { Star, Quote } from 'lucide-react';
import { mockReviews } from '../../data/mock';

export default function CustomerReviews() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="text-center mb-10">
          <h2 className="text-2xl font-extrabold text-secondary mb-2">গ্রাহকদের মতামত</h2>
          <p className="text-sm text-gray-500">আমাদের সার্ভিস সম্পর্কে যারা কিনেছেন তারা কি বলছেন</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {mockReviews.map(review => (
            <div key={review.id} className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 relative group hover:-translate-y-1 transition-transform duration-300">
              <Quote className="absolute top-6 right-6 text-gray-50 group-hover:text-primary/10 transition-colors duration-300" size={60} />
              <div className="flex items-center gap-1 mb-6 relative z-10">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className={`w-4 h-4 ${i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-200'}`} />
                ))}
              </div>
              <p className="text-sm text-slate-600 mb-8 leading-relaxed relative z-10 italic">"{review.comment}"</p>
              <div className="flex items-center gap-4 relative z-10">
                <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center text-secondary font-bold text-xl uppercase ring-2 ring-white shadow-sm">
                  {review.customerName.charAt(0)}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-800">{review.customerName}</h4>
                  <span className="text-[10px] text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full mt-1 inline-block">{review.date}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
