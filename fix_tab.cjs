const fs = require('fs');
const file = 'src/pages/AdminDashboard.tsx';
let content = fs.readFileSync(file, 'utf8');

const tabTarget = `          <button 
            onClick={() => setActiveTab('dues')} 
            className={\`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all text-left \${activeTab === 'dues' ? 'bg-[#2e7d32] text-white shadow-lg shadow-[#2e7d32]/20' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}\`}
          >
            <BookOpen size={18} /> {t.dues}
          </button>`;
          
const tabReplacement = `          <button 
            onClick={() => setActiveTab('dues')} 
            className={\`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all text-left \${activeTab === 'dues' ? 'bg-[#2e7d32] text-white shadow-lg shadow-[#2e7d32]/20' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}\`}
          >
            <BookOpen size={18} /> {t.dues}
          </button>
          
          <button 
            onClick={() => setActiveTab('agreement')} 
            className={\`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all text-left \${activeTab === 'agreement' ? 'bg-[#2e7d32] text-white shadow-lg shadow-[#2e7d32]/20' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}\`}
          >
            <FileText size={18} /> চুক্তিনামা প্রিন্ট
          </button>`;

if(content.includes(tabTarget)) {
  content = content.replace(tabTarget, tabReplacement);
  console.log("Desktop tab updated");
}

const tabTargetMobile = `              <button 
                onClick={() => { setActiveTab('dues'); setIsMobileMenuOpen(false); }} 
                className={\`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-all text-left \${activeTab === 'dues' ? 'bg-[#2e7d32] text-white' : 'text-slate-400 hover:bg-slate-800'}\`}
              >
                <BookOpen size={16} /> {t.dues}
              </button>`;

const tabReplacementMobile = `              <button 
                onClick={() => { setActiveTab('dues'); setIsMobileMenuOpen(false); }} 
                className={\`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-all text-left \${activeTab === 'dues' ? 'bg-[#2e7d32] text-white' : 'text-slate-400 hover:bg-slate-800'}\`}
              >
                <BookOpen size={16} /> {t.dues}
              </button>
              
              <button 
                onClick={() => { setActiveTab('agreement'); setIsMobileMenuOpen(false); }} 
                className={\`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-all text-left \${activeTab === 'agreement' ? 'bg-[#2e7d32] text-white' : 'text-slate-400 hover:bg-slate-800'}\`}
              >
                <FileText size={16} /> চুক্তিনামা প্রিন্ট
              </button>`;
              
if(content.includes(tabTargetMobile)) {
  content = content.replace(tabTargetMobile, tabReplacementMobile);
  console.log("Mobile tab updated");
}

fs.writeFileSync(file, content);
