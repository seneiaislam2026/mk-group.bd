import re

with open('src/components/ui/ProductDetailsModal.tsx', 'r') as f:
    content = f.read()

# Change fallback to only show description, and if empty, show nothing.
# Wait, if I remove fallback, then old products with no description will have empty description.
# That's probably exactly what they want when they "delete" it!
content = content.replace(
    "{selectedProduct.description || '১০০% অরিজিনাল এবং প্রিমিয়াম পণ্যের নিশ্চয়তা। সেরা মানের পণ্যটি আপনার দোরগোড়ায় পৌঁছে দেওয়া হচ্ছে।'}",
    "{selectedProduct.description}"
)

# And wrap it in a check so the margin doesn't show if empty
content = content.replace(
    "<div className=\"mb-8 text-gray-600 text-sm leading-relaxed\">",
    "{selectedProduct.description && <div className=\"mb-8 text-gray-600 text-sm leading-relaxed\">"
)
content = content.replace(
    "          {selectedProduct.description}\n          </div>",
    "          {selectedProduct.description}\n          </div>}"
)

with open('src/components/ui/ProductDetailsModal.tsx', 'w') as f:
    f.write(content)
