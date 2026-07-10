import re

with open("src/pages/HomePage.tsx", "r") as f:
    content = f.read()

old_block = """          <div className="flex flex-col lg:flex-row gap-8 items-start">
            {/* Sidebar quick switch inside the Catalog view */}
            <div className="hidden lg:block w-full lg:w-[260px] flex-shrink-0 bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
              <h3 className="text-[13px] font-black text-[#0b3d18] mb-5 uppercase tracking-wider flex items-center gap-2 pb-3 border-b border-gray-100">
                <Filter size={16} strokeWidth={2.5} />
                ক্যাটাগরি সমূহ
              </h3>
              <ul className="space-y-1.5 text-[13px] font-bold text-zinc-700">
                {[
                  { name: 'সকল পণ্য', slug: 'all' },
                  { name: 'মাছ', slug: 'fish' },
                  { name: 'মাংস', slug: 'beef' },
                  { name: 'চিকেন', slug: 'chicken' },
                  { name: 'ডিম', slug: 'egg' },
                  { name: 'দুধ ও ডেইরি', slug: 'dairy' },
                  { name: 'শাকসবজি ও ফল', slug: 'vegetables' },
                  { name: 'গ্রোসারি', slug: 'grocery' },
                  { name: 'ফ্রোজেন ফুড', slug: 'frozen' },
                  { name: 'বেভারেজ', slug: 'beverage' },
                  { name: 'পোষা প্রাণীর খাবার', slug: 'pet-food' }
                ].map((c) => (
                  <li key={c.slug}>
                    <button
                      onClick={() => { setActiveCategory(c.slug); setSearchQuery(''); }}
                      className={`w-full text-left px-4 py-3 rounded-xl transition-all flex items-center justify-between cursor-pointer ${activeCategory === c.slug ? 'bg-[#f0f7f2] text-[#0b3d18] font-black border border-[#0b3d18]/20' : 'hover:bg-gray-50 border border-transparent'}`}
                    >
                      {c.name}
                      <span className="text-[10px] opacity-40">➔</span>
                    </button>
                  </li>
                ))}
              </ul>
              
              <button
                onClick={() => { setActiveCategory(null); setSearchQuery(''); }}
                className="w-full mt-8 bg-zinc-100 hover:bg-zinc-200 text-zinc-800 text-[13px] font-black py-3.5 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <ArrowLeft size={16} strokeWidth={2.5} />
                হোম পেজে ফিরে যান
              </button>
            </div>

            {/* Catalog Grid results area */}
            <div className="flex-1 w-full">"""

new_block = """          <div className="flex flex-col gap-8 items-start">
            {/* Catalog Grid results area */}
            <div className="w-full">"""

content = content.replace(old_block, new_block)

with open("src/pages/HomePage.tsx", "w") as f:
    f.write(content)
