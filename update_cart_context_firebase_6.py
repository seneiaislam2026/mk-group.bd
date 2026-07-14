import re

with open('src/context/CartContext.tsx', 'r') as f:
    content = f.read()

# addNotification
add_notification_new = """
  const addNotification = async (title: string, message: string, orderId?: string, type: 'order' | 'system' = 'system') => {
    const newNotif: AppNotification = {
      id: `ntf-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      orderId,
      title,
      message,
      timestamp: new Date().toISOString(),
      read: false,
      type
    };
    try {
      await setDoc(doc(notificationsCollection, newNotif.id), newNotif);
    } catch (e) {
      console.error(e);
    }
  };
"""
content = re.sub(r'  const addNotification = \(title: string, message: string, orderId\?: string, type: \'order\' \| \'system\' = \'system\'\) => \{.*?\n  \};\n', add_notification_new, content, flags=re.DOTALL)

# markNotificationAsRead
mark_notif_new = """
  const markNotificationAsRead = async (id: string) => {
    try {
      await updateDoc(doc(notificationsCollection, id), { read: true });
    } catch (e) {
      console.error(e);
    }
  };
"""
content = re.sub(r'  const markNotificationAsRead = \(id: string\) => \{.*?\n  \};\n', mark_notif_new, content, flags=re.DOTALL)

# clearNotifications
clear_notifs_new = """
  const clearNotifications = async () => {
    try {
      notifications.forEach(async (notif) => {
        await deleteDoc(doc(notificationsCollection, notif.id));
      });
    } catch (e) {
      console.error(e);
    }
  };
"""
content = re.sub(r'  const clearNotifications = \(\) => \{.*?\n  \};\n', clear_notifs_new, content, flags=re.DOTALL)

# addSimulatedOrder
add_sim_order_new = """
  const addSimulatedOrder = async (simulatedOrder: Order) => {
    try {
      await setDoc(doc(ordersCollection, simulatedOrder.id), simulatedOrder);
      triggerOrderNotification(simulatedOrder);
    } catch (e) {
      console.error(e);
    }
  };
"""
content = re.sub(r'  const addSimulatedOrder = \(simulatedOrder: Order\) => \{.*?\n  \};\n', add_sim_order_new, content, flags=re.DOTALL)


with open('src/context/CartContext.tsx', 'w') as f:
    f.write(content)
