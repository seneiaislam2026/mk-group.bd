const fs = require('fs');
const file = 'src/pages/AdminDashboard.tsx';
let content = fs.readFileSync(file, 'utf8');

const target = `              <div>
                <label className="block text-xs text-slate-500 mb-1.5">পণ্যের বিবরণ (বাংলায়)</label>`;

const replacement = `              <div>
                <label className="block text-xs text-slate-500 mb-1.5">আর্টিকেল নম্বর</label>
                <input 
                  type="text"
                  value={productFormData.article || ''}
                  onChange={(e) => setProductFormData(p => ({ ...p, article: e.target.value }))}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 outline-none focus:border-[#1b4332] text-xs text-slate-700 font-bold mb-4"
                  placeholder="যেমন: ART-1234"
                />
              </div>

              <div>
                <label className="block text-xs text-slate-500 mb-1.5">পণ্যের বিবরণ (বাংলায়)</label>`;

if (content.includes(target)) {
  content = content.replace(target, replacement);
  fs.writeFileSync(file, content);
  console.log('Added article field');
} else {
  console.log('Could not find target');
}
