import re
with open("src/context/CartContext.tsx", "r") as f:
    content = f.read()

target1 = """  const updateProduct = async (updatedProd: Product) => {
    try {
      await setDoc(doc(productsCollection, updatedProd.id), updatedProd);
    } catch (e) {
      console.error(e);
    }
  };"""
replacement1 = """  const updateProduct = async (updatedProd: Product) => {
    setProducts(prev => prev.map(p => p.id === updatedProd.id ? updatedProd : p));
    try {
      await setDoc(doc(productsCollection, updatedProd.id), updatedProd);
    } catch (e) {
      console.error(e);
    }
  };"""
content = content.replace(target1, replacement1)

target2 = """  const deleteProduct = async (id: string) => {
    try {
      await deleteDoc(doc(productsCollection, id));
    } catch (e) {
      console.error(e);
    }
  };"""
replacement2 = """  const deleteProduct = async (id: string) => {
    setProducts(prev => prev.filter(p => p.id !== id));
    try {
      await deleteDoc(doc(productsCollection, id));
    } catch (e) {
      console.error(e);
    }
  };"""
content = content.replace(target2, replacement2)

with open("src/context/CartContext.tsx", "w") as f:
    f.write(content)
