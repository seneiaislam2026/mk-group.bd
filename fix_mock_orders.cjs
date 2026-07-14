const fs = require('fs');
let code = fs.readFileSync('src/context/CartContext.tsx', 'utf8');

// Remove the logic that inserts mock orders if length is 0
code = code.replace(
  `      if (ords.length === 0) {
          initialMockOrders.forEach(async (o) => {
              await setDoc(doc(ordersCollection, o.id), o);
          });
      } else {
          setOrders(ords.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
      }`,
  `      setOrders(ords.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));`
);

// Same for products? Let's check!
code = code.replace(
  `      if (prods.length === 0) {
        // If empty, seed with initial products
        initialProducts.forEach(async (p) => {
          await setDoc(doc(productsCollection, p.id), p);
        });
      } else {
        setProducts(prods);
      }`,
  `      setProducts(prods);`
);

fs.writeFileSync('src/context/CartContext.tsx', code);
console.log('Fixed repopulation of dummy data.');
