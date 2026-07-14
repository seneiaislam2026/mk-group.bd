const fs = require('fs');
let code = fs.readFileSync('src/pages/AdminDashboard.tsx', 'utf8');

// Replace the `<div className="overflow-x-auto">` inside the receiving tab ONLY!
// We know it's after `filteredProductsList.map`. Wait, no, it's before it.
// The line `) : (` followed by `<div className="overflow-x-auto">`

// Let's just find the exact block:
const targetBlock = `                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-xs md:text-sm font-bold">
                      <thead>
                        <tr className="bg-slate-50 border-b border-slate-100 text-slate-400 uppercase text-[11px] select-none text-left">
                          <th className="p-4 font-bold text-center">সিরিয়াল</th>
                          <th className="p-4 font-bold">আর্টিকেল</th>
                          <th className="p-4 font-bold">বর্তমান স্টক</th>
                          <th className="p-4 font-bold">নতুন রিসিভ (জোড়া)</th>
                        </tr>
                      </thead>`;

const replaceBlock = `                ) : (
                  <>
                  <div className="hidden md:block overflow-x-auto">
                    <table className="w-full text-left border-collapse text-xs md:text-sm font-bold">
                      <thead>
                        <tr className="bg-slate-50 border-b border-slate-100 text-slate-400 uppercase text-[11px] select-none text-left">
                          <th className="p-4 font-bold text-center">সিরিয়াল</th>
                          <th className="p-4 font-bold">আর্টিকেল</th>
                          <th className="p-4 font-bold">বর্তমান স্টক</th>
                          <th className="p-4 font-bold">নতুন রিসিভ (জোড়া)</th>
                        </tr>
                      </thead>`;

code = code.replace(targetBlock, replaceBlock);

fs.writeFileSync('src/pages/AdminDashboard.tsx', code);
console.log('Fixed JSX final.');
