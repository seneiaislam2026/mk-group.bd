import re

with open('src/context/CartContext.tsx', 'r') as f:
    content = f.read()

# Replace the empty dependency array with [isClient]
content = content.replace("  }, []);\n  // Auto-dismiss the toast", "  }, [isClient]);\n  // Auto-dismiss the toast")

with open('src/context/CartContext.tsx', 'w') as f:
    f.write(content)
