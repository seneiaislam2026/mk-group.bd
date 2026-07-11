import re

with open('src/components/layout/Layout.tsx', 'r') as f:
    content = f.read()

# Add import
content = content.replace("import OrderTrackingModal from '../ui/OrderTrackingModal';", "import OrderTrackingModal from '../ui/OrderTrackingModal';\nimport InvestorPortalModal from '../ui/InvestorPortalModal';")

# Add component
content = content.replace("<OrderTrackingModal />", "<OrderTrackingModal />\n          <InvestorPortalModal />")

with open('src/components/layout/Layout.tsx', 'w') as f:
    f.write(content)

