const fs = require('fs');
const file = 'src/pages/AdminDashboard.tsx';
let content = fs.readFileSync(file, 'utf8');

// Update state initialization
content = content.replace(`    category: 'গরুর মাংস',`, `    category: '',`);

// Update the field
const targetSelect = `                  <select 
                    value={productFormData.category}
                    onChange={(e) => setProductFormData(p => ({ ...p, category: e.target.value }))}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 outline-none text-xs text-slate-700 font-bold cursor-pointer"
                  >
                    {categoriesList.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                  </select>`;

const replaceInput = `                  <input 
                    type="text"
                    value={productFormData.category}
                    onChange={(e) => setProductFormData(p => ({ ...p, category: e.target.value }))}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 outline-none focus:border-[#1b4332] text-xs text-slate-700 font-bold"
                    placeholder="ক্যাটাগরির নাম লিখুন (যেমন: গরুর মাংস)"
                    required
                  />`;

if (content.includes(targetSelect)) {
  content = content.replace(targetSelect, replaceInput);
} else {
  console.log("Could not find target select element.");
}

// Optionally, remove categoriesList
// But let's check if categoriesList is used elsewhere before removing
fs.writeFileSync(file, content);
console.log('Fixed category field');
