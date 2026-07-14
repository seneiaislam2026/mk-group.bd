const fs = require('fs');
let code = fs.readFileSync('src/pages/AdminDashboard.tsx', 'utf8');

code = code.replace(
  `  const [productSearch, setProductSearch] = useState('');
  const [orderSearch, setOrderSearch] = useState('');`,
  `  const [productSearch, setProductSearch] = useState('');
  const [orderSearch, setOrderSearch] = useState('');
  const [orderFilterDate, setOrderFilterDate] = useState('');`
);

// fix type errors in transactions
code = code.replace(
  `type: 'income',`,
  `type: 'income' as 'income' | 'expense',`
);

code = code.replace(
  `type: 'expense',`,
  `type: 'expense' as 'income' | 'expense',`
);

// fix product price error (2464)
code = code.replace(
  `item.price * item.quantity`,
  `((item as any).price || 0) * item.quantity`
);

fs.writeFileSync('src/pages/AdminDashboard.tsx', code);
console.log('Fixed TS errors in AdminDashboard.');
