const fs = require('fs');
const file = 'src/pages/AdminDashboard.tsx';
let content = fs.readFileSync(file, 'utf8');

const oldButton = `<button 
                            className="px-3 py-1.5 text-xs font-bold text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer flex items-center gap-1"
                            title="ট্র্যাক করুন"
                            onClick={() => {
                               // Open stead fast tracking
                               window.open('https://steadfast.com.bd/tracking/' + delivery.tracking_code, '_blank');
                            }}
                          >
                            <ExternalLink size={14} /> ট্র্যাক
                          </button>`;

const newButton = `<a 
                            href={'https://steadfast.com.bd/tracking/' + delivery.tracking_code}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-3 py-1.5 text-xs font-bold text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer flex items-center gap-1"
                            title="ট্র্যাক করুন"
                          >
                            <ExternalLink size={14} /> ট্র্যাক
                          </a>`;

content = content.replace(oldButton, newButton);
fs.writeFileSync(file, content);
console.log("Fixed tracking link");
