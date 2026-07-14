import re

with open('src/context/CartContext.tsx', 'r') as f:
    content = f.read()

# Modify updateOrderStatus
update_order_status_new = """
  const updateOrderStatus = async (id: string, status: 'Pending' | 'Confirmed' | 'Shipped' | 'Completed' | 'Cancelled') => {
    try {
      await updateDoc(doc(ordersCollection, id), { status });
    } catch (e) {
      console.error(e);
    }
  };
"""
content = re.sub(r'  const updateOrderStatus = \(id: string, status: \'Pending\' \| \'Confirmed\' \| \'Shipped\' \| \'Completed\' \| \'Cancelled\'\) => \{.*?\n  \};\n', update_order_status_new, content, flags=re.DOTALL)

# Modify deleteOrder
delete_order_new = """
  const deleteOrder = async (id: string) => {
    try {
      await deleteDoc(doc(ordersCollection, id));
    } catch (e) {
      console.error(e);
    }
  };
"""
content = re.sub(r'  const deleteOrder = \(id: string\) => \{.*?\n  \};\n', delete_order_new, content, flags=re.DOTALL)

# Modify addProduct
add_product_new = """
  const addProduct = async (newProdData: Omit<Product, 'id' | 'rating' | 'reviews'>) => {
    const newProduct: Product = {
      ...newProdData,
      id: `p-${Date.now()}`,
      rating: 5.0,
      reviews: 0
    };
    try {
      await setDoc(doc(productsCollection, newProduct.id), newProduct);
    } catch (e) {
      console.error(e);
    }
  };
"""
content = re.sub(r'  const addProduct = \(newProdData: Omit<Product, \'id\' \| \'rating\' \| \'reviews\'>\) => \{.*?\n  \};\n', add_product_new, content, flags=re.DOTALL)

# Modify updateProduct
update_product_new = """
  const updateProduct = async (updatedProd: Product) => {
    try {
      await setDoc(doc(productsCollection, updatedProd.id), updatedProd);
    } catch (e) {
      console.error(e);
    }
  };
"""
content = re.sub(r'  const updateProduct = \(updatedProd: Product\) => \{.*?\n  \};\n', update_product_new, content, flags=re.DOTALL)

# Modify deleteProduct
delete_product_new = """
  const deleteProduct = async (id: string) => {
    try {
      await deleteDoc(doc(productsCollection, id));
    } catch (e) {
      console.error(e);
    }
  };
"""
content = re.sub(r'  const deleteProduct = \(id: string\) => \{.*?\n  \};\n', delete_product_new, content, flags=re.DOTALL)


with open('src/context/CartContext.tsx', 'w') as f:
    f.write(content)
