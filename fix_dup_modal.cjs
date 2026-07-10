const fs = require('fs');
const file = 'src/pages/AdminDashboard.tsx';
let content = fs.readFileSync(file, 'utf8');

const badPart = `w-indigo-600/20"
              >
                <Check size={16} /> স্টক ইন করুন
              </button>
            </div>
          </div>
        </div>
      )}`;

content = content.replace(badPart, '');
fs.writeFileSync(file, content);
console.log("Fixed duplicate modal end");
