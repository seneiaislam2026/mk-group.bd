import re

with open('src/context/CartContext.tsx', 'r') as f:
    content = f.read()

# Add useEffect for Firebase sync
firebase_sync_effect = """
  // Sync with Firebase
  useEffect(() => {
    if (!isClient) return;

    const unsubProducts = onSnapshot(productsCollection, (snapshot) => {
      const prods: Product[] = [];
      snapshot.forEach(doc => {
        prods.push({ ...doc.data(), id: doc.id } as Product);
      });
      if (prods.length === 0) {
          // Add default mock products if empty
          mockProducts.forEach(async (p) => {
              await setDoc(doc(productsCollection, p.id), p);
          });
      } else {
          setProducts(prods);
      }
    });

    const unsubOrders = onSnapshot(ordersCollection, (snapshot) => {
      const ords: Order[] = [];
      snapshot.forEach(doc => {
        ords.push({ ...doc.data(), id: doc.id } as Order);
      });
      if (ords.length === 0) {
          initialMockOrders.forEach(async (o) => {
              await setDoc(doc(ordersCollection, o.id), o);
          });
      } else {
          setOrders(ords.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
      }
    });

    const unsubNotifications = onSnapshot(notificationsCollection, (snapshot) => {
      const notifs: AppNotification[] = [];
      snapshot.forEach(doc => {
        notifs.push({ ...doc.data(), id: doc.id } as AppNotification);
      });
      setNotifications(notifs.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()));
    });

    return () => {
      unsubProducts();
      unsubOrders();
      unsubNotifications();
    };
  }, []);
"""

content = content.replace("  // Auto-dismiss the toast after 3 seconds", firebase_sync_effect + "\n  // Auto-dismiss the toast after 3 seconds")

with open('src/context/CartContext.tsx', 'w') as f:
    f.write(content)
