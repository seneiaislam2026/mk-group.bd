import re

with open('src/pages/AdminDashboard.tsx', 'r') as f:
    content = f.read()

import_statement = """import { db, courierHistoryCollection } from '../lib/firebase';
import { onSnapshot, setDoc, doc, updateDoc, deleteDoc } from 'firebase/firestore';"""

content = content.replace('import { FileText,', import_statement + '\nimport { FileText,')


courier_history_state_new = """  const [courierHistory, setCourierHistory] = useState<any[]>([]);
  
  useEffect(() => {
    const unsub = onSnapshot(courierHistoryCollection, (snapshot) => {
      const history: any[] = [];
      snapshot.forEach(doc => {
        history.push({ ...doc.data(), id: doc.id });
      });
      setCourierHistory(history.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()));
    });
    return () => unsub();
  }, []);
"""

content = re.sub(r'  const \[courierHistory, setCourierHistory\] = useState<any\[\]>\(\(\) => \{.*?\n  \}, \[courierHistory\]\);\n', courier_history_state_new, content, flags=re.DOTALL)

with open('src/pages/AdminDashboard.tsx', 'w') as f:
    f.write(content)
