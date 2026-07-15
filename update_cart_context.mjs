import fs from 'fs';
let content = fs.readFileSync('src/context/CartContext.tsx', 'utf8');

const target = `  const deleteOrder = async (id: string) => {
    try {
      await deleteDoc(doc(ordersCollection, id));
    } catch (e) {
      console.error(e);
    }
  };`;

const replacement = `  const deleteOrder = async (id: string) => {
    try {
      // First, restore stock
      const order = orders.find(o => o.id === id);
      if (order && order.status !== 'Cancelled') {
        for (const item of order.items) {
          const product = products.find(p => p.id === item.id);
          if (product) {
            await updateDoc(doc(productsCollection, product.id), { stock: (product.stock || 0) + item.quantity });
          }
        }
      }
      await deleteDoc(doc(ordersCollection, id));
    } catch (e) {
      console.error(e);
    }
  };`;

content = content.replace(target, replacement);
fs.writeFileSync('src/context/CartContext.tsx', content);
