const fs = require('fs');
let code = fs.readFileSync('src/pages/AdminDashboard.tsx', 'utf8');

const targetStr = `  const [manualDeliveryCharge, setManualDeliveryCharge] = useState<number>(0);
  const [manualConditionCharge, setManualConditionCharge] = useState<number>(0);`;

const newStr = `  const [manualDeliveryCharge, setManualDeliveryCharge] = useState<number>(0);
  const [manualConditionCharge, setManualConditionCharge] = useState<number>(0);

  // Auto calculate condition charge
  useEffect(() => {
    if (!manualOrderIsDue) { // if COD
      const subtotal = manualOrderItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      const newCharge = Math.round(subtotal * 0.01);
      setManualConditionCharge(newCharge);
    } else {
      setManualConditionCharge(0);
    }
  }, [manualOrderItems, manualOrderIsDue]);`;

if (code.includes(targetStr)) {
    code = code.replace(targetStr, newStr);
    console.log("Added useEffect for COD charge");
    fs.writeFileSync('src/pages/AdminDashboard.tsx', code);
}
