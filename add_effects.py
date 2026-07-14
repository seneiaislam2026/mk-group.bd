with open('src/pages/AdminDashboard.tsx', 'r') as f:
    content = f.read()

effects = """
  // Auto-fill customer details if phone matches past order
  useEffect(() => {
    if (manualOrderPhone.length >= 11) {
      const pastOrder = simulatedOrders.find(o => o.phone === manualOrderPhone);
      if (pastOrder) {
        if (!manualOrderCustomerName) setManualOrderCustomerName(pastOrder.customerName);
        if (!manualOrderAddress) setManualOrderAddress(pastOrder.address || '');
      }
    }
  }, [manualOrderPhone, simulatedOrders]);

  // Auto-fill rate based on article
  useEffect(() => {
    if (manualArticleInput) {
      const prod = products.find(p => p.article === manualArticleInput || p.id === manualArticleInput);
      if (prod) {
        setManualRateInput(prod.discountedPrice || prod.originalPrice);
      }
    }
  }, [manualArticleInput, products]);
"""

# Insert after the states, e.g. before "const [transactions, setTransactions]"
content = content.replace("  // Income & Expense (Transactions) states", effects + "\n  // Income & Expense (Transactions) states")

with open('src/pages/AdminDashboard.tsx', 'w') as f:
    f.write(content)
