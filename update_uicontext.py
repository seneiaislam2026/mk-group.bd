import re

with open('src/context/UIContext.tsx', 'r') as f:
    content = f.read()

content = content.replace("  isOrderTrackingOpen: boolean;\n  setIsOrderTrackingOpen: (open: boolean) => void;\n}", "  isOrderTrackingOpen: boolean;\n  setIsOrderTrackingOpen: (open: boolean) => void;\n  isInvestorPortalOpen: boolean;\n  setIsInvestorPortalOpen: (open: boolean) => void;\n}")

content = content.replace("  const [isOrderTrackingOpen, setIsOrderTrackingOpen] = useState<boolean>(false);", "  const [isOrderTrackingOpen, setIsOrderTrackingOpen] = useState<boolean>(false);\n  const [isInvestorPortalOpen, setIsInvestorPortalOpen] = useState<boolean>(false);")

content = content.replace("      isOrderTrackingOpen,\n      setIsOrderTrackingOpen\n    }}>", "      isOrderTrackingOpen,\n      setIsOrderTrackingOpen,\n      isInvestorPortalOpen,\n      setIsInvestorPortalOpen\n    }}>")

with open('src/context/UIContext.tsx', 'w') as f:
    f.write(content)
