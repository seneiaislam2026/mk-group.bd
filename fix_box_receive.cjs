const fs = require('fs');
const file = 'src/pages/AdminDashboard.tsx';
let content = fs.readFileSync(file, 'utf8');

// Find the modal block
const modalStart = '{/* Box Receive Modal */}';
const modalEnd = '{/* Main Content Area */}';
const modalStartIndex = content.indexOf(modalStart);
const modalEndIndex = content.indexOf(modalEnd);

if (modalStartIndex === -1 || modalEndIndex === -1) {
  console.log("Could not find modal markers");
  process.exit(1);
}

// Add state for lastReceived if not exists
if (!content.includes('lastReceivedMsg')) {
  content = content.replace(
    "const [boxReceiveData, setBoxReceiveData] = useState({ article: '', boxCount: '' });",
    "const [boxReceiveData, setBoxReceiveData] = useState({ article: '', boxCount: '1' });\n  const [lastReceivedMsg, setLastReceivedMsg] = useState<{text: string, type: 'success' | 'error'} | null>(null);\n  const articleInputRef = useRef<HTMLInputElement>(null);"
  );
}

const newModal = `      {/* Box Receive Modal */}
      {isBoxReceiveModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsBoxReceiveModalOpen(false)}></div>
          <div className="bg-white rounded-2xl w-full max-w-md relative z-10 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-indigo-50/50 rounded-t-2xl">
              <div>
                <h3 className="font-black text-slate-800 flex items-center gap-2"><PackagePlus size={18} className="text-indigo-600" /> র‍্যাপিড বক্স রিসিভ</h3>
                <p className="text-[10px] text-slate-500 mt-1">প্রতি বক্সে ২৪ পিস করে হিসাব হবে। আর্টিকেল লিখে এন্টার চাপুন।</p>
              </div>
              <button onClick={() => setIsBoxReceiveModalOpen(false)} className="text-slate-400 hover:text-rose-500 bg-white hover:bg-rose-50 p-1.5 rounded-lg transition-colors shadow-sm border border-slate-100">
                <X size={18} />
              </button>
            </div>
            
            <div className="p-5 space-y-4">
              {lastReceivedMsg && (
                <div className={\`p-3 rounded-xl text-xs font-bold \${lastReceivedMsg.type === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-rose-50 text-rose-700 border border-rose-100'}\`}>
                  {lastReceivedMsg.text}
                </div>
              )}
              
              <form onSubmit={(e) => {
                e.preventDefault();
                
                if (!boxReceiveData.article) {
                  setLastReceivedMsg({ text: 'দয়া করে আর্টিকেল নম্বর দিন।', type: 'error' });
                  return;
                }
                
                const boxes = parseInt(boxReceiveData.boxCount || '1');
                if (isNaN(boxes) || boxes <= 0) {
                  setLastReceivedMsg({ text: 'সঠিক বক্স সংখ্যা দিন।', type: 'error' });
                  return;
                }
                
                const totalItems = boxes * 24;
                const existingProduct = products.find(p => p.article === boxReceiveData.article);
                
                if (existingProduct) {
                  const currentStock = existingProduct.stock || 0;
                  updateProduct({ ...existingProduct, stock: currentStock + totalItems });
                  
                  setLastReceivedMsg({ text: \`সফল: \${existingProduct.name} এ \${boxes} বক্স (\${totalItems} পিস) যোগ হয়েছে! নতুন স্টক: \${currentStock + totalItems} পিস\`, type: 'success' });
                  setBoxReceiveData({ article: '', boxCount: '1' });
                  
                  // Keep focus
                  setTimeout(() => {
                    articleInputRef.current?.focus();
                  }, 50);
                } else {
                  // Auto create new product
                  const newProduct = {
                    name: 'পণ্য (' + boxReceiveData.article + ')',
                    originalPrice: 0,
                    category: 'নতুন',
                    weight: '১ পিস',
                    image: 'https://images.unsplash.com/photo-1578916171728-46686eac8d58?auto=format&fit=crop&w=400&q=80',
                    stock: totalItems,
                    article: boxReceiveData.article
                  };
                  addProduct(newProduct);
                  
                  setLastReceivedMsg({ text: \`সফল: নতুন পণ্য তৈরি হয়েছে এবং \${boxes} বক্স (\${totalItems} পিস) যোগ হয়েছে!\`, type: 'success' });
                  setBoxReceiveData({ article: '', boxCount: '1' });
                  
                  setTimeout(() => {
                    articleInputRef.current?.focus();
                  }, 50);
                }
              }}>
                <div className="flex gap-3">
                  <div className="flex-1">
                    <label className="block text-[11px] font-bold text-slate-500 mb-1.5 uppercase tracking-wider">আর্টিকেল নম্বর <span className="text-rose-500">*</span></label>
                    <input 
                      ref={articleInputRef}
                      type="text" 
                      value={boxReceiveData.article}
                      onChange={(e) => setBoxReceiveData(p => ({ ...p, article: e.target.value }))}
                      className="w-full px-4 py-3 rounded-xl border-2 border-indigo-100 focus:border-indigo-600 outline-none text-sm text-slate-800 font-black uppercase transition-colors" 
                      placeholder="যেমন: ART-101"
                      autoFocus
                    />
                  </div>
                  <div className="w-24">
                    <label className="block text-[11px] font-bold text-slate-500 mb-1.5 uppercase tracking-wider">বক্স <span className="text-rose-500">*</span></label>
                    <input 
                      type="number" 
                      value={boxReceiveData.boxCount}
                      onChange={(e) => setBoxReceiveData(p => ({ ...p, boxCount: e.target.value }))}
                      className="w-full px-4 py-3 rounded-xl border-2 border-slate-100 focus:border-indigo-600 outline-none text-sm text-slate-800 font-black text-center transition-colors" 
                      min="1"
                    />
                  </div>
                </div>
                
                <div className="mt-6">
                  <button 
                    type="submit"
                    className="w-full py-3.5 rounded-xl bg-indigo-600 text-white font-black text-sm hover:bg-indigo-700 transition-colors flex justify-center items-center gap-2 shadow-lg shadow-indigo-600/20 active:scale-[0.98]"
                  >
                    <Check size={18} /> রিসিভ করুন (Enter)
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
`;

content = content.substring(0, modalStartIndex) + newModal + content.substring(modalEndIndex);

// Add missing imports
if (!content.includes('PackagePlus')) {
  content = content.replace("import { ", "import { PackagePlus, ");
}

fs.writeFileSync(file, content);
console.log("Box Receive Modal updated successfully.");
