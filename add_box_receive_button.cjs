const fs = require('fs');
const file = 'src/pages/AdminDashboard.tsx';
let content = fs.readFileSync(file, 'utf8');

const target = `                <button
                  onClick={() => setIsCustomReceiveModalOpen(true)}
                  className="bg-[#2e7d32] text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-emerald-700 transition-colors flex items-center gap-1.5 shadow-sm"
                >
                  <Plus size={14} /> কাস্টম রিসিভ
                </button>`;
const replacement = `                <button
                  onClick={() => setIsBoxReceiveModalOpen(true)}
                  className="bg-indigo-600 text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-indigo-700 transition-colors flex items-center gap-1.5 shadow-sm"
                >
                  <Plus size={14} /> বক্স রিসিভ
                </button>
                <button
                  onClick={() => setIsCustomReceiveModalOpen(true)}
                  className="bg-[#2e7d32] text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-emerald-700 transition-colors flex items-center gap-1.5 shadow-sm"
                >
                  <Plus size={14} /> কাস্টম রিসিভ
                </button>`;

if (content.includes(target)) {
  content = content.replace(target, replacement);
  fs.writeFileSync(file, content);
  console.log('Added box receive button');
} else {
  console.log('Target not found');
}
