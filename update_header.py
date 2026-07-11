import re

with open('src/components/layout/Header.tsx', 'r') as f:
    content = f.read()

# Add setIsInvestorPortalOpen to useUI
content = content.replace("const { activeCategory, setActiveCategory, setIsPriceListOpen, setIsOrderTrackingOpen } = useUI();", "const { activeCategory, setActiveCategory, setIsPriceListOpen, setIsOrderTrackingOpen, setIsInvestorPortalOpen } = useUI();")

investor_menu = """                  <li>
                    <button 
                      onClick={() => { setIsInvestorPortalOpen(true); setIsMobileMenuOpen(false); }}
                      className="w-full text-left flex items-center gap-2 px-6 py-3.5 font-extrabold text-sm text-[#00693E] bg-[#00693E]/5 hover:bg-[#00693E]/10 duration-200 cursor-pointer border-b border-[#00693E]/10"
                    >
                      💼 বিনিয়োগকারীর তথ্য
                    </button>
                  </li>"""

content = re.sub(
    r"(<li>\s*<button \s*onClick=\{\(\) => \{ setIsOrderTrackingOpen\(true\); setIsMobileMenuOpen\(false\); \}\}\s*className=\"w-full text-left flex items-center gap-2 px-6 py-3\.5 font-extrabold text-sm text-blue-700 bg-blue-50/50 hover:bg-blue-100/60 duration-200 cursor-pointer border-y border-blue-100\"\s*>\s*🚚 অর্ডার ট্র্যাকিং\s*</button>\s*</li>)",
    r"\1\n" + investor_menu,
    content
)

with open('src/components/layout/Header.tsx', 'w') as f:
    f.write(content)

