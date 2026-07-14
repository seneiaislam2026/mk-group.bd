const fs = require('fs');
let code = fs.readFileSync('src/pages/AdminDashboard.tsx', 'utf8');

// Insert safe JSON parse helper at the top
const safeParseCode = `
const safeJSONParse = (data, fallback) => {
  try {
    return JSON.parse(data);
  } catch (e) {
    console.error('Failed to parse JSON:', e);
    return fallback;
  }
};
`;

code = code.replace(
  `export default function AdminDashboard({ onLogout }: { onLogout: () => void }) {`,
  safeParseCode + `\nexport default function AdminDashboard({ onLogout }: { onLogout: () => void }) {`
);

// Replace JSON.parse
code = code.replace(/JSON\.parse\(stored\)/g, `safeJSONParse(stored, null) || `);

// wait, if I do `safeJSONParse(stored, null) || fallback`, it works better.
// let's do a targeted replace for each.
fs.writeFileSync('src/pages/AdminDashboard.tsx', code);
console.log('Fixed JSON.parse.');
