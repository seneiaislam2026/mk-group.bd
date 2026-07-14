const fs = require('fs');
let code = fs.readFileSync('src/pages/AdminDashboard.tsx', 'utf8');

code = code.replace(/safeJSONParse\(stored, null\) \|\| /g, `safeJSONParse(stored, null)`);

// Now the code is `return stored ? safeJSONParse(stored, null) : [`
// But if safeJSONParse returns null, it will return null instead of the default array!
// We should fix that.
// `stored ? safeJSONParse(stored, null) : [`
// `stored ? (safeJSONParse(stored, null) || [) : [` 

// Let's replace:
// return stored ? safeJSONParse(stored, null) : [
// With:
// return (stored && safeJSONParse(stored, null)) || [

code = code.replace(/return stored \? safeJSONParse\(stored, null\) : \[/g, `return (stored && safeJSONParse(stored, null)) || [`);

// For the one that was `return stored ? safeJSONParse(stored, null) : [];`
code = code.replace(/return stored \? safeJSONParse\(stored, null\) : \[\];/g, `return (stored && safeJSONParse(stored, null)) || [];`);

// For `const existing = stored ? safeJSONParse(stored, null) : [];`
code = code.replace(/const existing = stored \? safeJSONParse\(stored, null\) : \[\];/g, `const existing = (stored && safeJSONParse(stored, null)) || [];`);

// For `setInvestorsList(safeJSONParse(stored, null));`
// It's fine.

fs.writeFileSync('src/pages/AdminDashboard.tsx', code);
console.log('Fixed syntax error in JSON.parse.');
