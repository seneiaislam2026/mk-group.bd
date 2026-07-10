const fs = require('fs');
const file = 'src/pages/AdminDashboard.tsx';
let content = fs.readFileSync(file, 'utf8');

const regex = /<LogOut size=\{16\} \/> \{t\.logout\}\n              <\/button>\n            <\/div>\n            <\/>\n            \) : \([\s\S]*?বন্ধ করুন\n                    <\/button>\n                  <\/div>\n                <\/div>\n            \)}\n          <\/div>/;

const replacement = `<LogOut size={16} /> {t.logout}
              </button>
            </div>
          </div>`;

content = content.replace(regex, replacement);
fs.writeFileSync(file, content);
console.log('Fixed syntax error');
