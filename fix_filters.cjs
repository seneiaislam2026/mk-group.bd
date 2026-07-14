const fs = require('fs');
let code = fs.readFileSync('src/pages/AdminDashboard.tsx', 'utf8');

code = code.replace(
  `const filteredProductsList = products.filter(p => 
    p.name.toLowerCase().includes(productSearch.toLowerCase()) || 
    p.category.toLowerCase().includes(productSearch.toLowerCase())
  );`,
  `const filteredProductsList = products.filter(p => 
    (p.name || '').toLowerCase().includes((productSearch || '').toLowerCase()) || 
    (p.category || '').toLowerCase().includes((productSearch || '').toLowerCase()) ||
    (p.article || '').toLowerCase().includes((productSearch || '').toLowerCase())
  );`
);

code = code.replace(
  `const filteredOrdersList = orders.filter(o => {
    const matchesSearch = o.customerName.toLowerCase().includes(orderSearch.toLowerCase()) || 
                          o.phone.includes(orderSearch) || 
                          o.id.toLowerCase().includes(orderSearch.toLowerCase());`,
  `const filteredOrdersList = orders.filter(o => {
    const searchLow = (orderSearch || '').toLowerCase();
    const matchesSearch = (o.customerName || '').toLowerCase().includes(searchLow) || 
                          (o.phone || '').includes(searchLow) || 
                          (o.id || '').toLowerCase().includes(searchLow);`
);

fs.writeFileSync('src/pages/AdminDashboard.tsx', code);
console.log('Fixed filters.');
