const fs = require('fs');
const file = 'src/pages/AdminDashboard.tsx';
let content = fs.readFileSync(file, 'utf8');

const target = `              </button>
            </div>
          </div>
        </div>
      )}`;

const replacement = `              </button>
            </div>
          </div>
        </div>
      )}

      {/* Box Receive Modal */}
      {isBoxReceiveModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setIsBoxReceiveModalOpen(false)}></div>
          <div className="bg-white rounded-2xl w-full max-w-md relative z-10 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="p-5 border-b border-gray-100 flex items-center justify-between">
              <h3 className="font-black text-slate-800">বক্স রিসিভ (২৪ পিস/বক্স)</h3>
              <button onClick={() => setIsBoxReceiveModalOpen(false)} className="text-slate-400 hover:text-rose-500 bg-slate-100 hover:bg-rose-50 p-1.5 rounded-lg transition-colors">
                <X size={18} />
              </button>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <label className="block text-xs text-slate-500 mb-1.5">আর্টিকেল নম্বর <span className="text-rose-500">*</span></label>
                <input 
                  type="text" 
                  value={boxReceiveData.article}
                  onChange={(e) => setBoxReceiveData(p => ({ ...p, article: e.target.value }))}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-indigo-600 outline-none text-xs text-slate-700 font-bold" 
                  placeholder="যেমন: ART-101"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-500 mb-1.5">বক্স সংখ্যা <span className="text-rose-500">*</span></label>
                <input 
                  type="number" 
                  value={boxReceiveData.boxCount}
                  onChange={(e) => setBoxReceiveData(p => ({ ...p, boxCount: e.target.value }))}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-indigo-600 outline-none text-xs text-slate-700 font-bold" 
                  placeholder="যেমন: ৫ (৫x২৪ = ১২০ পিস)"
                />
              </div>
              
              {boxReceiveData.boxCount && parseInt(boxReceiveData.boxCount) > 0 && (
                <div className="bg-indigo-50 p-3 rounded-xl border border-indigo-100 flex items-center gap-2">
                  <div className="bg-white p-2 rounded-lg text-indigo-600"><Check size={16} /></div>
                  <div>
                    <p className="text-[10px] text-indigo-600 font-bold uppercase tracking-wider">মোট রিসিভ হবে</p>
                    <p className="text-sm font-black text-indigo-900">{parseInt(boxReceiveData.boxCount) * 24} পিস</p>
                  </div>
                </div>
              )}
            </div>
            <div className="p-5 border-t border-gray-100 flex gap-3">
              <button 
                onClick={() => setIsBoxReceiveModalOpen(false)}
                className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-bold text-xs hover:bg-slate-50 transition-colors"
              >
                বাতিল
              </button>
              <button 
                onClick={() => {
                  if (!boxReceiveData.article || !boxReceiveData.boxCount) {
                    alert('আর্টিকেল এবং বক্স সংখ্যা দিন।');
                    return;
                  }
                  
                  const boxes = parseInt(boxReceiveData.boxCount);
                  if (isNaN(boxes) || boxes <= 0) {
                    alert('সঠিক বক্স সংখ্যা দিন।');
                    return;
                  }
                  
                  const totalItems = boxes * 24;
                  const existingProduct = products.find(p => p.article === boxReceiveData.article);
                  
                  if (existingProduct) {
                    const currentStock = existingProduct.stock || 0;
                    updateProduct({ ...existingProduct, stock: currentStock + totalItems });
                    alert(\`সফলভাবে \${totalItems} পিস স্টক আপডেট করা হয়েছে!\`);
                    setIsBoxReceiveModalOpen(false);
                    setBoxReceiveData({ article: '', boxCount: '' });
                  } else {
                    const confirmCreate = window.confirm('এই আর্টিকেলের কোন পণ্য পাওয়া যায়নি। নতুন পণ্য তৈরি করতে চান?');
                    if (confirmCreate) {
                      const newProduct = {
                        name: 'নতুন পণ্য (' + boxReceiveData.article + ')',
                        originalPrice: 0,
                        category: 'নতুন',
                        weight: '১ পিস',
                        image: 'https://images.unsplash.com/photo-1578916171728-46686eac8d58?auto=format&fit=crop&w=400&q=80',
                        stock: totalItems,
                        article: boxReceiveData.article
                      };
                      addProduct(newProduct);
                      alert(\`নতুন পণ্য তৈরি করা হয়েছে এবং \${totalItems} পিস স্টক যুক্ত করা হয়েছে!\`);
                      setIsBoxReceiveModalOpen(false);
                      setBoxReceiveData({ article: '', boxCount: '' });
                    }
                  }
                }}
                className="flex-1 px-4 py-2.5 rounded-xl bg-indigo-600 text-white font-bold text-xs hover:bg-indigo-700 transition-colors flex justify-center items-center gap-2 shadow-lg shadow-indigo-600/20"
              >
                <Check size={16} /> স্টক ইন করুন
              </button>
            </div>
          </div>
        </div>
      )}`;

if (content.includes(target)) {
  content = content.replace(target, replacement);
  fs.writeFileSync(file, content);
  console.log('Added box receive modal');
} else {
  console.log('Could not find custom receive modal end tag');
}
