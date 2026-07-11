import re

with open('src/pages/AdminDashboard.tsx', 'r') as f:
    content = f.read()

# 1. Add save investor function inside AdminDashboard
save_fn = """  // Handle saving agreement as investor
  const handleSaveInvestor = () => {
    if (!agreementData.party1.name || !agreementData.party1.mobile || !agreementData.details.totalAmount) {
      alert("১ম পক্ষ ক্রেতার নাম, মোবাইল এবং চুক্তির মোট টাকার পরিমান অবশ্যই পূরণ করতে হবে।");
      return;
    }
    
    // Calculate values
    const totalAmount = parseFloat(agreementData.details.totalAmount) || 0;
    const dueAmount = parseFloat(agreementData.details.dueAmount) || 0;
    const paidAmount = totalAmount - dueAmount;
    
    const newInvestor = {
      id: Math.random().toString(36).substr(2, 9),
      accountNumber: Math.floor(1000000 + Math.random() * 9000000).toString(),
      name: agreementData.party1.name,
      fname: agreementData.party1.fname,
      mobile: agreementData.party1.mobile,
      nid: agreementData.party1.nid,
      address: agreementData.party1.address,
      totalAmount: totalAmount,
      dueAmount: dueAmount,
      paidAmount: paidAmount,
      date: new Date().toISOString()
    };
    
    // Save to localStorage
    const stored = localStorage.getItem('mega_investors');
    const existing = stored ? JSON.parse(stored) : [];
    localStorage.setItem('mega_investors', JSON.stringify([newInvestor, ...existing]));
    
    alert(`বিনিয়োগকারী সফলভাবে সংরক্ষিত হয়েছে! একাউন্ট নম্বর: ${newInvestor.accountNumber}`);
  };

  const [agreementData"""

content = re.sub(
    r"const \[agreementData",
    save_fn,
    content,
    count=1
)

# 2. Add button to the top
buttons_top = """                <div className="flex gap-3">
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

content = re.sub(
    r"<button \s*onClick=\{\(\) => \{\s*const dataStr = encodeURIComponent\(JSON\.stringify\(agreementData\)\);\s*window\.open\(`/print-agreement\?data=\$\{dataStr\}`,\s*'_blank'\);\s*\}\}\s*className=\"bg-indigo-600 text-white px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-indigo-700 transition-colors flex items-center gap-2 shadow-lg shadow-indigo-600/20\"\s*>\s*<FileText size=\{16\} /> প্রিন্ট করুন\s*</button>",
    buttons_top,
    content,
    count=1
)

# 3. Add button to the bottom
buttons_bottom = """              <div className="flex justify-end mt-8 gap-3">
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

content = re.sub(
    r"<div className=\"flex justify-end mt-8\">\s*<button \s*onClick=\{\(\) => \{\s*const dataStr = encodeURIComponent\(JSON\.stringify\(agreementData\)\);\s*window\.open\(`/print-agreement\?data=\$\{dataStr\}`,\s*'_blank'\);\s*\}\}\s*className=\"bg-indigo-600 text-white px-8 py-3 rounded-xl font-bold text-sm hover:bg-indigo-700 transition-colors flex items-center gap-2 shadow-lg shadow-indigo-600/20\"\s*>\s*<FileText size=\{18\} /> প্রিন্ট করুন\s*</button>\s*</div>",
    buttons_bottom,
    content,
    count=1
)

with open('src/pages/AdminDashboard.tsx', 'w') as f:
    f.write(content)

print("Updates applied to AdminDashboard.")
