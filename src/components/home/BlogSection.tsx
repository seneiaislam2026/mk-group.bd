import { ArrowRight } from 'lucide-react';

export default function BlogSection() {
  const blogs = [
    {
      id: 1,
      image: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=600&q=80",
      category: "স্বাস্থ্য ও পুষ্টি",
      title: "প্রতিদিনের খাদ্যতালিকায় প্রোটিনের গুরুত্ব ও উপকারিতা",
      date: "২০ ফাল্গুন, ১৪৩০"
    },
    {
      id: 2,
      image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80",
      category: "ফিটনেস",
      title: "ওজন কমাতে কোন ধরনের মাংস আপনার জন্য উপযুক্ত?",
      date: "১৮ ফাল্গুন, ১৪৩০"
    },
    {
      id: 3,
      image: "https://images.unsplash.com/photo-1505253758473-96b7015fcd40?auto=format&fit=crop&w=600&q=80",
      category: "রান্নার টিপস",
      title: "মাংস নরম ও সুস্বাদু করার ৫টি জাদুকরী উপায়",
      date: "১৫ ফাল্গুন, ১৪৩০"
    }
  ];

  return (
    <section className="py-16 bg-transparent border-t border-gray-100">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex justify-between items-end mb-8 pb-4 border-b border-gray-100">
          <div>
            <h2 className="text-2xl font-extrabold text-secondary">পুষ্টি ও স্বাস্থ্য ব্লগ</h2>
            <p className="text-xs text-gray-500 mt-2">সুস্থ জীবনের জন্য প্রয়োজনীয় টিপস ও আর্টিকেল</p>
          </div>
          <button className="text-xs font-bold text-primary flex items-center gap-1 hover:text-primary-dark transition-colors bg-primary/5 px-4 py-2 rounded-full">
            সবগুলো পড়ুন <ArrowRight size={14} />
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {blogs.map(blog => (
            <div key={blog.id} className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group cursor-pointer flex flex-col">
              <div className="h-52 overflow-hidden relative">
                <img loading="lazy" src={blog.image} alt={blog.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <span className="absolute top-4 left-4 bg-white/95 backdrop-blur text-primary text-[10px] font-bold px-3 py-1.5 rounded-full shadow-sm z-10">
                  {blog.category}
                </span>
              </div>
              <div className="p-6 flex flex-col flex-1">
                <span className="text-[10px] text-gray-400 mb-3 block">{blog.date}</span>
                <h3 className="text-[15px] font-bold text-slate-800 leading-snug mb-4 group-hover:text-primary transition-colors flex-1">
                  {blog.title}
                </h3>
                <div className="flex items-center gap-2 text-xs font-bold text-secondary mt-auto border-t border-gray-50 pt-4">
                  বিস্তারিত পড়ুন <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
