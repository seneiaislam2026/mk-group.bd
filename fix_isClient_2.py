import re

with open('src/context/CartContext.tsx', 'r') as f:
    content = f.read()

content = re.sub(
    r'      unsubNotifications\(\);\n    \};\n  \}, \[\]\);',
    '      unsubNotifications();\n    };\n  }, [isClient]);',
    content,
    flags=re.DOTALL
)

with open('src/context/CartContext.tsx', 'w') as f:
    f.write(content)
