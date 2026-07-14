with open('src/pages/AdminDashboard.tsx', 'r') as f:
    content = f.read()

print_func = """
  const handlePrintInvoice = (order: any) => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;
    
    const itemsHtml = order.items ? order.items.map((item: any, idx: number) => `
      <tr>
        <td style="padding: 8px; border-bottom: 1px solid #ddd;">${idx + 1}</td>
        <td style="padding: 8px; border-bottom: 1px solid #ddd;">${item.name || item.article}</td>
        <td style="padding: 8px; border-bottom: 1px solid #ddd; text-align: center;">${item.quantity}</td>
        <td style="padding: 8px; border-bottom: 1px solid #ddd; text-align: right;">${item.price} ৳</td>
        <td style="padding: 8px; border-bottom: 1px solid #ddd; text-align: right;">${item.price * item.quantity} ৳</td>
      </tr>
    `).join('') : '';

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Invoice - ${order.id}</title>
        <style>
          body { font-family: sans-serif; padding: 40px; color: #333; }
          .header { display: flex; justify-content: space-between; border-bottom: 2px solid #222; padding-bottom: 20px; margin-bottom: 30px; }
          .title { font-size: 24px; font-weight: bold; text-transform: uppercase; margin: 0; }
          .subtitle { font-size: 12px; color: #666; margin-top: 5px; }
          .details { margin-bottom: 30px; line-height: 1.6; }
          .table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
          .table th { text-align: left; padding: 10px 8px; background: #f5f5f5; border-bottom: 2px solid #ddd; }
          .total { text-align: right; font-size: 18px; font-weight: bold; }
          .status { font-weight: bold; color: #e65100; margin-top: 10px; font-size: 16px; text-transform: uppercase; }
        </style>
      </head>
      <body>
        <div class="header">
          <div>
            <h1 class="title">MK Group</h1>
            <div class="subtitle">Courier Delivery Slip</div>
          </div>
          <div style="text-align: right;">
            <div>Date: ${new Date().toLocaleDateString('en-GB')}</div>
            <div>Order ID: #${order.id.slice(-6)}</div>
          </div>
        </div>
        
        <div class="details">
          <strong>Customer:</strong> ${order.customerName}<br>
          <strong>Phone:</strong> ${order.phone}<br>
          <strong>Address:</strong> ${order.address || 'N/A'}<br>
        </div>
        
        <table class="table">
          <thead>
            <tr>
              <th>SL</th>
              <th>Item</th>
              <th style="text-align: center;">Qty</th>
              <th style="text-align: right;">Rate</th>
              <th style="text-align: right;">Total</th>
            </tr>
          </thead>
          <tbody>
            ${itemsHtml}
          </tbody>
        </table>
        
        <div class="total">Grand Total: ${order.total} ৳</div>
        <div style="text-align: right;" class="status">CASH ON DELIVERY</div>
        
        <script>
          setTimeout(() => { window.print(); window.close(); }, 500);
        </script>
      </body>
      </html>
    `;
    printWindow.document.write(html);
    printWindow.document.close();
  };
"""

content = content.replace("const handleLogout = () => {", print_func + "\n  const handleLogout = () => {")

button_replacement = """<span className="px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">{order.status}</span>
                            <button onClick={() => handlePrintInvoice(order)} className="ml-3 text-emerald-600 hover:text-emerald-800 text-xs font-bold underline bg-emerald-50 px-2 py-1 rounded">Print Invoice</button>"""
content = content.replace('<span className="px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">{order.status}</span>', button_replacement)

with open('src/pages/AdminDashboard.tsx', 'w') as f:
    f.write(content)

print("done")
