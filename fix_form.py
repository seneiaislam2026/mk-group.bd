import re
with open('src/pages/AdminDashboard.tsx', 'r') as f:
    content = f.read()

old_form = """<div className="flex gap-2 items-end">
                  <div className="flex-1">
                    <label className="block text-[10px] text-slate-500 font-bold mb-1">আর্টিকেল নম্বর</label>
                    <input 
                      type="text" """

new_form = """<form 
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (!manualArticleInput || manualRateInput === '') return;
                    // Attempt to find product matching article
                    const product = products?.find(p => p?.article === manualArticleInput || p.id === manualArticleInput);
                    const id = product ? product.id : `custom-${Date.now()}`;
                    const name = product ? product.name : `Custom Article ${manualArticleInput}`;
                    
                    const existingIndex = manualOrderItems.findIndex(item => item.article === manualArticleInput && item.price === manualRateInput);
                    if (existingIndex > -1) {
                      const updated = [...manualOrderItems];
                      updated[existingIndex].quantity += manualQuantityInput;
                      setManualOrderItems(updated);
                    } else {
                      setManualOrderItems(prev => [...prev, {
                        id,
                        name,
                        article: manualArticleInput,
                        quantity: manualQuantityInput,
                        price: Number(manualRateInput)
                      }]);
                    }
                    setManualArticleInput('');
                    setManualQuantityInput(1);
                    setManualRateInput('');
                    setTimeout(() => {
                      document.getElementById('manual-article-input')?.focus();
                    }, 0);
                  }}
                  className="flex gap-2 items-end"
                >
                  <div className="flex-1">
                    <label className="block text-[10px] text-slate-500 font-bold mb-1">আর্টিকেল নম্বর</label>
                    <input 
                      id="manual-article-input"
                      type="text" """

content = content.replace(old_form, new_form)

old_button = """                  <button 
                    type="button"
                    onClick={() => {
                      if (!manualArticleInput || manualRateInput === '') return;
                      // Attempt to find product matching article
                      const product = products?.find(p => p?.article === manualArticleInput || p.id === manualArticleInput);
                      const id = product ? product.id : `custom-${Date.now()}`;
                      const name = product ? product.name : `Custom Article ${manualArticleInput}`;
                      
                      const existingIndex = manualOrderItems.findIndex(item => item.article === manualArticleInput && item.price === manualRateInput);
                      if (existingIndex > -1) {
                        const updated = [...manualOrderItems];
                        updated[existingIndex].quantity += manualQuantityInput;
                        setManualOrderItems(updated);
                      } else {
                        setManualOrderItems(prev => [...prev, {
                          id,
                          name,
                          article: manualArticleInput,
                          quantity: manualQuantityInput,
                          price: Number(manualRateInput)
                        }]);
                      }
                      setManualArticleInput('');
                      setManualQuantityInput(1);
                      setManualRateInput('');
                    }}
                    className="bg-[#2e7d32] hover:bg-emerald-700 text-white px-4 py-2 rounded-xl text-xs font-black h-[38px] transition-all cursor-pointer"
                  >
                    যোগ করুন
                  </button>
                </div>"""

new_button = """                  <button 
                    type="submit"
                    className="bg-[#2e7d32] hover:bg-emerald-700 text-white px-4 py-2 rounded-xl text-xs font-black h-[38px] transition-all cursor-pointer"
                  >
                    যোগ করুন
                  </button>
                </form>"""

content = content.replace(old_button, new_button)

with open('src/pages/AdminDashboard.tsx', 'w') as f:
    f.write(content)
