import re

with open('src/context/CartContext.tsx', 'r') as f:
    content = f.read()

# Remove the localStorage sync useEffects
content = re.sub(r'  // Persist notifications\n  useEffect\(\(\) => \{\n    if \(isClient\) \{\n      localStorage.setItem\(\'mega_notifications\', JSON.stringify\(notifications\)\);\n    \}\n  \}, \[notifications\]\);\n', '', content)
content = re.sub(r'  // Sync products to local storage\n  useEffect\(\(\) => \{\n    if \(isClient\) \{\n      localStorage.setItem\(\'mega_products\', JSON.stringify\(products\)\);\n    \}\n  \}, \[products\]\);\n', '', content)
content = re.sub(r'  // Sync orders to local storage\n  useEffect\(\(\) => \{\n    if \(isClient\) \{\n      localStorage.setItem\(\'mega_orders\', JSON.stringify\(orders\)\);\n    \}\n  \}, \[orders\]\);\n', '', content)
content = re.sub(r'  // Cross-tab real-time listener using \'storage\' event.*?(?=\n  const addToCart)', '', content, flags=re.DOTALL)

with open('src/context/CartContext.tsx', 'w') as f:
    f.write(content)
