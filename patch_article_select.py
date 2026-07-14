import re
with open("src/pages/AdminDashboard.tsx", "r") as f:
    content = f.read()

target = """                      onChange={(e) => {
                        const val = e.target.value;
                        if (val) {
                          const prod = products.find(p => p.article === val);
                          if (prod) setManualSelectedProductId(prod.id);
                        } else {
                          setManualSelectedProductId('');
                        }
                      }}"""

replacement = """                      onChange={(e) => {
                        const val = e.target.value;
                        if (val) {
                          const prod = products.find(p => p.article === val);
                          if (prod) {
                            setManualSelectedProductId(prod.id);
                          } else {
                            setManualSelectedProductId('');
                          }
                        } else {
                          setManualSelectedProductId('');
                        }
                      }}"""

content = content.replace(target, replacement)

with open("src/pages/AdminDashboard.tsx", "w") as f:
    f.write(content)
