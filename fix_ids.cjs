const fs = require('fs');

let cartCode = fs.readFileSync('src/context/CartContext.tsx', 'utf8');
cartCode = cartCode.replace(
  /const trackingId = `ORD-\$\{Math\.floor\(10000 \+ Math\.random\(\) \* 90000\)\}`;/,
  `const maxId = orders.reduce((max, o) => {
      const match = o.id.match(/^Ord-(\\d+)$/i);
      if (match) return Math.max(max, parseInt(match[1], 10));
      const matchLegacy = o.id.match(/^man-(\\d+)$/i);
      if (matchLegacy) return Math.max(max, parseInt(matchLegacy[1], 10));
      return max;
    }, 0);
    const trackingId = \`Ord-\${(maxId + 1).toString().padStart(3, '0')}\`;`
);
fs.writeFileSync('src/context/CartContext.tsx', cartCode);

let adminCode = fs.readFileSync('src/pages/AdminDashboard.tsx', 'utf8');
adminCode = adminCode.replace(
  /id: `man-\$\{Math\.floor\(1000 \+ Math\.random\(\) \* 9000\)\}`/,
  `id: (() => {
      const maxId = orders.reduce((max, o) => {
        const match = o.id.match(/^Ord-(\\d+)$/i);
        if (match) return Math.max(max, parseInt(match[1], 10));
        const matchLegacy = o.id.match(/^man-(\\d+)$/i);
        if (matchLegacy) return Math.max(max, parseInt(matchLegacy[1], 10));
        return max;
      }, 0);
      return \`Ord-\${(maxId + 1).toString().padStart(3, '0')}\`;
    })()`
);
fs.writeFileSync('src/pages/AdminDashboard.tsx', adminCode);

console.log('Fixed IDs');
