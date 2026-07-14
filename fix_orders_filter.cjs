const fs = require('fs');
let code = fs.readFileSync('src/pages/AdminDashboard.tsx', 'utf8');

const oldFilter = `  const filteredOrdersList = orders.filter(o => 
    o.customerName.toLowerCase().includes(orderSearch.toLowerCase()) || 
    o.phone.includes(orderSearch) || 
    o.id.toLowerCase().includes(orderSearch.toLowerCase())
  );`;

const newFilter = `  const filteredOrdersList = orders.filter(o => {
    const matchesSearch = o.customerName.toLowerCase().includes(orderSearch.toLowerCase()) || 
                          o.phone.includes(orderSearch) || 
                          o.id.toLowerCase().includes(orderSearch.toLowerCase());
    
    if (orderFilterDate) {
        const oDate = new Date(o.date).toISOString().split('T')[0];
        return matchesSearch && oDate === orderFilterDate;
    }
    return matchesSearch;
  });`;

if(code.includes(oldFilter)) {
  code = code.replace(oldFilter, newFilter);
  console.log("Replaced filter");
}
fs.writeFileSync('src/pages/AdminDashboard.tsx', code);
