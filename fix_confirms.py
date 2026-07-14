import re

with open('src/pages/AdminDashboard.tsx', 'r') as f:
    content = f.read()

# 1. Add confirm dialog state
state_code = "  const [confirmDialog, setConfirmDialog] = useState<{ isOpen: boolean, message: string, onConfirm: () => void }>({ isOpen: false, message: '', onConfirm: () => {} });\n"
content = content.replace("  const [isProductModalOpen, setIsProductModalOpen] = useState(false);", "  const [isProductModalOpen, setIsProductModalOpen] = useState(false);\n" + state_code)

# 2. Add confirm modal at the end, just before the last </div> (or inside the return)
modal_code = """
      {/* Confirm Dialog Modal */}
      {confirmDialog.isOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setConfirmDialog({ ...confirmDialog, isOpen: false })}></div>
          <div className="bg-white rounded-2xl w-full max-w-sm overflow-hidden shadow-2xl relative z-10 p-6 animate-in fade-in zoom-in-95 duration-200">
            <h3 className="text-lg font-black text-slate-800 mb-2">নিশ্চিত করুন</h3>
            <p className="text-sm text-slate-600 font-bold mb-6">{confirmDialog.message}</p>
            <div className="flex gap-3">
              <button 
                onClick={() => setConfirmDialog({ ...confirmDialog, isOpen: false })}
                className="flex-1 bg-slate-100 text-slate-700 font-bold py-2.5 rounded-xl text-sm hover:bg-slate-200"
              >
                বাতিল
              </button>
              <button 
                onClick={() => {
                  confirmDialog.onConfirm();
                  setConfirmDialog({ ...confirmDialog, isOpen: false });
                }}
                className="flex-1 bg-rose-500 text-white font-bold py-2.5 rounded-xl text-sm hover:bg-rose-600 shadow-md shadow-rose-500/20"
              >
                হ্যাঁ, মুছে ফেলুন
              </button>
            </div>
          </div>
        </div>
      )}
"""
content = content.replace("{/* Product ADD / EDIT Modal */}", modal_code + "\n      {/* Product ADD / EDIT Modal */}")

# 3. Replace all confirms
content = content.replace(
    "onClick={(e) => { e.preventDefault(); e.stopPropagation(); if(confirm('পণ্যটি চিরতরে মুছে ফেলতে চান?')) deleteProduct(product.id); }}",
    "onClick={(e) => { e.preventDefault(); e.stopPropagation(); setConfirmDialog({ isOpen: true, message: 'পণ্যটি চিরতরে মুছে ফেলতে চান?', onConfirm: () => deleteProduct(product.id) }); }}"
)

content = content.replace(
    "if (window.confirm('আপনি কি এই বিনিয়োগকারীকে মুছে ফেলতে চান?')) {\n      deleteInvestor(id);\n    }",
    "setConfirmDialog({ isOpen: true, message: 'আপনি কি এই বিনিয়োগকারীকে মুছে ফেলতে চান?', onConfirm: () => deleteInvestor(id) });"
)

content = content.replace(
    "onClick={() => { if(confirm('অর্ডার রেকর্ডটি মুছে ফেলতে চান?')) deleteOrder(order.id); }}",
    "onClick={() => { setConfirmDialog({ isOpen: true, message: 'অর্ডার রেকর্ডটি মুছে ফেলতে চান?', onConfirm: () => deleteOrder(order.id) }); }}"
)

content = content.replace(
    "if (confirm('ক্যাম্পেইনটি ডিলিট করতে চান?')) {\n                                      setMetaCampaigns(prev => prev.filter(c => c.id !== campaign.id));\n                                    }",
    "setConfirmDialog({ isOpen: true, message: 'ক্যাম্পেইনটি ডিলিট করতে চান?', onConfirm: () => setMetaCampaigns(prev => prev.filter(c => c.id !== campaign.id)) });"
)

with open('src/pages/AdminDashboard.tsx', 'w') as f:
    f.write(content)
