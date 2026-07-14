import re
with open("src/pages/AdminDashboard.tsx", "r") as f:
    content = f.read()

# Add a state for new created order
state_insert = """  const [createdOrderForActions, setCreatedOrderForActions] = useState<any>(null);"""
content = content.replace("const [manualConditionCharge, setManualConditionCharge] = useState<number>(0);", "const [manualConditionCharge, setManualConditionCharge] = useState<number>(0);\n" + state_insert)

target = """                  }
                  
                  setIsManualOrderModalOpen(false);
                  setManualOrderCustomerName('');
                  setManualOrderPhone('');
                  setManualOrderAddress('');
                  setManualOrderItems([]);
                  setManualOrderIsDue(false);
                  addNotification('সফল', 'ম্যানুয়াল ক্যাশ-অন-ডেলিভারি অর্ডার তৈরি হয়েছে।');
                }}"""

replacement = """                  }
                  
                  setIsManualOrderModalOpen(false);
                  setCreatedOrderForActions(newManualOrderObj);
                  
                  setManualOrderCustomerName('');
                  setManualOrderPhone('');
                  setManualOrderAddress('');
                  setManualOrderItems([]);
                  setManualOrderIsDue(false);
                  addNotification('সফল', 'অর্ডার সফলভাবে তৈরি হয়েছে।');
                }}"""

content = content.replace(target, replacement)

# Add the Post-Creation Modal
post_modal = """
      {/* Post-Order Actions Modal */}
      {createdOrderForActions && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl w-full max-w-sm p-6 text-center shadow-2xl relative animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle size={32} />
            </div>
            <h3 className="text-lg font-black text-slate-800 mb-1">অর্ডার তৈরি সম্পন্ন</h3>
            <p className="text-xs font-bold text-slate-500 mb-6">অর্ডার আইডি: #{createdOrderForActions.id}</p>
            
            <div className="space-y-3">
              <button
                onClick={() => {
                  window.open(`/print-invoice?orderId=${createdOrderForActions.id}`, '_blank');
                }}
                className="w-full bg-[#1b4332] text-white py-3 rounded-xl font-bold text-sm shadow-md hover:bg-emerald-800 transition-colors flex items-center justify-center gap-2"
              >
                <FileText size={16} /> ইনভয়েস প্রিন্ট করুন
              </button>
              
              <button
                onClick={() => {
                  setNewBooking({
                     customer_name: createdOrderForActions.customerName,
                     customer_phone: createdOrderForActions.phone,
                     customer_address: createdOrderForActions.address,
                     amount: createdOrderForActions.total
                  });
                  setIsCourierBookingOpen(true);
                  setCreatedOrderForActions(null);
                }}
                className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold text-sm shadow-md hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
              >
                <Truck size={16} /> স্টেডফাস্ট কুরিয়ার বুকিং
              </button>
              
              <button
                onClick={() => setCreatedOrderForActions(null)}
                className="w-full bg-slate-100 text-slate-600 py-3 rounded-xl font-bold text-sm hover:bg-slate-200 transition-colors"
              >
                বন্ধ করুন
              </button>
            </div>
          </div>
        </div>
      )}
"""

content = content.replace("{/* Manual Order Modal */}", post_modal + "\n      {/* Manual Order Modal */}")

with open("src/pages/AdminDashboard.tsx", "w") as f:
    f.write(content)
