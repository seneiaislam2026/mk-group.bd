const fs = require('fs');
const file = 'src/pages/AdminDashboard.tsx';
let content = fs.readFileSync(file, 'utf8');

const badStr = 'transition-all tex      {/* Box Receive Modal */}';
const goodStr = 'transition-all text-left text-rose-400 hover:text-rose-50 hover:bg-rose-500/20" title="লগআউট">\n                <LogOut size={16} /> লগআউট\n              </button>\n            </div>\n          </div>\n        </div>\n      </aside>\n      \n      {/* Box Receive Modal */}';

if (content.includes(badStr)) {
  content = content.replace(badStr, goodStr);
  fs.writeFileSync(file, content);
  console.log("Syntax fixed");
} else {
  console.log("Could not find the bad string");
}
