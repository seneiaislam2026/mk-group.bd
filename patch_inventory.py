import re
with open("src/pages/AdminDashboard.tsx", "r") as f:
    content = f.read()

target = """                  <button className="flex items-center gap-1.5 bg-[#2e7d32] text-white px-3.5 py-2 rounded-xl text-xs font-bold shadow-md hover:bg-emerald-700 transition-colors cursor-pointer">
                    <SlidersHorizontal size={14} /> স্টক সমন্বয়
                  </button>"""

replacement = """                  <button onClick={() => {
                    const article = prompt('যে পণ্যের স্টক আপডেট করতে চান তার আর্টিকেল নম্বর বা নাম লিখুন:');
                    if (article) {
                      const prod = products.find(p => p.article === article || p.name.includes(article));
                      if (prod) {
                        const newStockStr = prompt(`"${prod.name}" এর বর্তমান স্টক: ${prod.stock || 0}\\nনতুন স্টক পরিমাণ লিখুন:`, String(prod.stock || 0));
                        if (newStockStr !== null) {
                          const newStock = parseInt(newStockStr);
                          if (!isNaN(newStock)) {
                            updateProduct({ ...prod, stock: newStock });
                            addNotification('স্টক আপডেট', `"${prod.name}" এর স্টক সফলভাবে আপডেট করা হয়েছে।`);
                          }
                        }
                      } else {
                        alert('পণ্যটি পাওয়া যায়নি!');
                      }
                    }
                  }} className="flex items-center gap-1.5 bg-[#2e7d32] text-white px-3.5 py-2 rounded-xl text-xs font-bold shadow-md hover:bg-emerald-700 transition-colors cursor-pointer">
                    <SlidersHorizontal size={14} /> স্টক সমন্বয়
                  </button>"""

content = content.replace(target, replacement)

with open("src/pages/AdminDashboard.tsx", "w") as f:
    f.write(content)
