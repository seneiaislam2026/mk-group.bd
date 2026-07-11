import re

with open('src/pages/AdminDashboard.tsx', 'r') as f:
    content = f.read()

# Make a small function to update agreement data and reset save state
# wait, there are many setAgreementData calls. Let's just create a wrapper

# Instead of creating a wrapper, let's just add an effect that resets `isAgreementSaved` if `agreementData` changes
# But that would immediately reset it after we save... wait, `agreementData` doesn't change on save.
# But it will change if the user types.

effect_str = """
  // Reset print state if form is modified
  useEffect(() => {
    setIsAgreementSaved(false);
  }, [agreementData]);
"""

content = content.replace("  const [isAgreementSaved, setIsAgreementSaved] = useState(false);", "  const [isAgreementSaved, setIsAgreementSaved] = useState(false);\n" + effect_str)

with open('src/pages/AdminDashboard.tsx', 'w') as f:
    f.write(content)

print("done")
