const fs = require('fs');
let code = fs.readFileSync('src/components/admin/StaffPortal.tsx', 'utf8');

const targetDiv = `<div className="flex items-center gap-4 mb-4 pl-2 cursor-pointer" onClick={() => setSelectedStaff(staff)}>
                  <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-slate-100 shadow-sm shrink-0">
                    <img src={staff.photo} alt={staff.name} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h3 className="font-black text-slate-800 leading-tight">{staff.name}</h3>
                    <p className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded inline-block mt-1">{staff.designation}</p>
                    <p className="text-xs text-slate-600 mt-1">{staff.mobile}</p>
                  </div>
                </div>`;

const newDiv = `<div className="flex items-center justify-between gap-4 mb-4 pl-2">
                  <div className="flex items-center gap-4 cursor-pointer flex-1" onClick={() => setSelectedStaff(staff)}>
                    <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-slate-100 shadow-sm shrink-0">
                      <img src={staff.photo} alt={staff.name} className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <h3 className="font-black text-slate-800 leading-tight">{staff.name}</h3>
                      <p className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded inline-block mt-1">{staff.designation}</p>
                      <p className="text-xs text-slate-600 mt-1">{staff.mobile}</p>
                    </div>
                  </div>
                  <button 
                    onClick={(e) => handleDeleteStaff(staff.id, e)}
                    className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors"
                    title="স্টাফ মুছে ফেলুন"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>`;

code = code.replace(targetDiv, newDiv);

fs.writeFileSync('src/components/admin/StaffPortal.tsx', code);
console.log('Fixed staff list items delete button.');
