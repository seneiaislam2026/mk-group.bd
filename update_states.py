import re
with open('src/pages/AdminDashboard.tsx', 'r') as f:
    content = f.read()

target = """  const [manualOrderItems, setManualOrderItems] = useState<{ id: string; name: string; quantity: number; price: number }[]>([]);
  const [manualSelectedProductId, setManualSelectedProductId] = useState('');
  const [manualSelectedQuantity, setManualSelectedQuantity] = useState(1);"""

new_states = """  const [manualOrderItems, setManualOrderItems] = useState<{ id: string; name: string; article: string; quantity: number; price: number }[]>([]);
  const [manualArticleInput, setManualArticleInput] = useState('');
  const [manualQuantityInput, setManualQuantityInput] = useState(1);
  const [manualRateInput, setManualRateInput] = useState<number | ''>('');
  const [manualDeliveryCharge, setManualDeliveryCharge] = useState<number>(120);
  const [manualConditionCharge, setManualConditionCharge] = useState<number>(0);
  const [createdOrderData, setCreatedOrderData] = useState<any>(null);"""

content = content.replace(target, new_states)

with open('src/pages/AdminDashboard.tsx', 'w') as f:
    f.write(content)
