import re

with open('src/context/CartContext.tsx', 'r') as f:
    content = f.read()

# placeOrder
place_order_new = """
  const placeOrder = async (customerName: string, phone: string, address: string) => {
    const trackingId = `ORD-${Math.floor(10000 + Math.random() * 90000)}`;
    const newOrder: Order = {
      id: trackingId,
      customerName,
      phone,
      address,
      items: cartItems.map(item => ({
        id: item.id,
        name: item.name,
        quantity: item.quantity,
        price: item.discountedPrice || item.originalPrice
      })),
      total: cartTotal,
      date: new Date().toISOString(),
      status: 'Pending'
    };

    try {
      await setDoc(doc(ordersCollection, newOrder.id), newOrder);
      triggerOrderNotification(newOrder);
    } catch (e) {
      console.error(e);
    }
    
    return trackingId;
  };
"""
content = re.sub(r'  const placeOrder = \(customerName: string, phone: string, address: string\) => \{.*?\n  \};\n', place_order_new, content, flags=re.DOTALL)

# placeDirectOrder
place_direct_order_new = """
  const placeDirectOrder = async (customerName: string, phone: string, address: string, product: Product, quantity: number) => {
    const trackingId = `ORD-${Math.floor(10000 + Math.random() * 90000)}`;
    const newOrder: Order = {
      id: trackingId,
      customerName,
      phone,
      address,
      items: [{
        id: product.id,
        name: product.name,
        quantity,
        price: product.discountedPrice || product.originalPrice
      }],
      total: (product.discountedPrice || product.originalPrice) * quantity,
      date: new Date().toISOString(),
      status: 'Pending'
    };

    try {
      await setDoc(doc(ordersCollection, newOrder.id), newOrder);
      triggerOrderNotification(newOrder);
    } catch (e) {
      console.error(e);
    }
    
    return trackingId;
  };
"""
content = re.sub(r'  const placeDirectOrder = \(customerName: string, phone: string, address: string, product: Product, quantity: number\) => \{.*?\n  \};\n', place_direct_order_new, content, flags=re.DOTALL)

with open('src/context/CartContext.tsx', 'w') as f:
    f.write(content)
