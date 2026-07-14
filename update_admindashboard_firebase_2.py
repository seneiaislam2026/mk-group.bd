import re

with open('src/pages/AdminDashboard.tsx', 'r') as f:
    content = f.read()

# Replace setCourierHistory(updatedHistory) in handleSyncCourier
handle_sync_courier_update = """
         // We updated the local array, but now we should update Firebase directly
         for (const booking of updatedHistory) {
             if (booking.id) {
                 await updateDoc(doc(courierHistoryCollection, booking.id), { status: booking.status });
             }
         }
"""
content = re.sub(r'         setCourierHistory\(updatedHistory\);', handle_sync_courier_update, content)

# Replace manual creation in new booking (line 4909 area)
# The old code was:
# setCourierHistory(prev => [{
#   consignment_id: data.consignment?.consignment_id || data.consignment_id,
#   ...
# }, ...prev]);
# We need to change this to setDoc. We can find 'setCourierHistory(prev => [' and replace it with firebase save logic.
def replacer(match):
    return """
    const newDocId = `cour-${Date.now()}`;
    const newDocData = """ + match.group(1) + """;
    try {
        await setDoc(doc(courierHistoryCollection, newDocId), { ...newDocData, id: newDocId });
    } catch(e) {
        console.error(e);
    }
"""

# There are two formats: setCourierHistory(prev => [newBooking, ...prev]); and setCourierHistory(prev => [{ ... }, ...prev]);
content = re.sub(r'setCourierHistory\(prev => \[\s*(.*?)\s*,\s*\.\.\.prev\]\);', replacer, content, flags=re.DOTALL)

with open('src/pages/AdminDashboard.tsx', 'w') as f:
    f.write(content)

