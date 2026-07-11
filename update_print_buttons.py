import re

with open('src/pages/AdminDashboard.tsx', 'r') as f:
    content = f.read()

# Replace the top button group
top_btn_old = """                                <div className="flex gap-3">
                <button 
                  onClick={handleSaveInvestor}
                  className="bg-emerald-600 text-white px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-emerald-700 transition-colors flex items-center gap-2 shadow-lg shadow-emerald-600/20"
                >
                  <Users size={16} /> বিনিয়োগকারী হিসেবে সেভ করুন
                </button>
                <button 
                  onClick={() => {
                    const dataStr = encodeURIComponent(JSON.stringify(agreementData));
                    window.open(`/print-agreement?data=${dataStr}`, '_blank');
                  }}
                  className="bg-indigo-600 text-white px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-indigo-700 transition-colors flex items-center gap-2 shadow-lg shadow-indigo-600/20"
                >
                  <FileText size={16} /> প্রিন্ট করুন
                </button>
                </div>"""

top_btn_new = """                                <div className="flex gap-3">
                {!isAgreementSaved ? (
                  <button 
                    onClick={handleSaveInvestor}
                    className="bg-emerald-600 text-white px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-emerald-700 transition-colors flex items-center gap-2 shadow-lg shadow-emerald-600/20"
                  >
                    <Users size={16} /> বিনিয়োগকারী হিসেবে সেভ করুন
                  </button>
                ) : (
                  <button 
                    onClick={() => {
                      const dataStr = encodeURIComponent(JSON.stringify(agreementData));
                      window.open(`/print-agreement?data=${dataStr}`, '_blank');
                    }}
                    className="bg-indigo-600 text-white px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-indigo-700 transition-colors flex items-center gap-2 shadow-lg shadow-indigo-600/20"
                  >
                    <FileText size={16} /> প্রিন্ট করুন
                  </button>
                )}
                </div>"""

content = content.replace(top_btn_old, top_btn_new)

# Replace the bottom button group
bottom_btn_old = """              <div className="flex justify-end mt-8 gap-3">
                <button 
                  onClick={handleSaveInvestor}
                  className="bg-emerald-600 text-white px-8 py-3 rounded-xl font-bold text-sm hover:bg-emerald-700 transition-colors flex items-center gap-2 shadow-lg shadow-emerald-600/20"
                >
                  <Users size={18} /> বিনিয়োগকারী হিসেবে সেভ করুন
                </button>
                <button 
                  onClick={() => {
                    const dataStr = encodeURIComponent(JSON.stringify(agreementData));
                    window.open(`/print-agreement?data=${dataStr}`, '_blank');
                  }}
                  className="bg-indigo-600 text-white px-8 py-3 rounded-xl font-bold text-sm hover:bg-indigo-700 transition-colors flex items-center gap-2 shadow-lg shadow-indigo-600/20"
                >
                  <FileText size={18} /> প্রিন্ট করুন
                </button>
              </div>"""

bottom_btn_new = """              <div className="flex justify-end mt-8 gap-3">
                {!isAgreementSaved ? (
                  <button 
                    onClick={handleSaveInvestor}
                    className="bg-emerald-600 text-white px-8 py-3 rounded-xl font-bold text-sm hover:bg-emerald-700 transition-colors flex items-center gap-2 shadow-lg shadow-emerald-600/20"
                  >
                    <Users size={18} /> বিনিয়োগকারী হিসেবে সেভ করুন
                  </button>
                ) : (
                  <button 
                    onClick={() => {
                      const dataStr = encodeURIComponent(JSON.stringify(agreementData));
                      window.open(`/print-agreement?data=${dataStr}`, '_blank');
                    }}
                    className="bg-indigo-600 text-white px-8 py-3 rounded-xl font-bold text-sm hover:bg-indigo-700 transition-colors flex items-center gap-2 shadow-lg shadow-indigo-600/20"
                  >
                    <FileText size={18} /> প্রিন্ট করুন
                  </button>
                )}
              </div>"""

content = content.replace(bottom_btn_old, bottom_btn_new)

with open('src/pages/AdminDashboard.tsx', 'w') as f:
    f.write(content)

