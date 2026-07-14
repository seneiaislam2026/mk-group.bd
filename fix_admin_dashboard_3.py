import re

with open('src/pages/AdminDashboard.tsx', 'r') as f:
    content = f.read()

content = content.replace(
    "agreementData[`witness${num}` as keyof typeof agreementData].name",
    "(agreementData[`witness${num}` as keyof typeof agreementData] as any).name"
)
content = content.replace(
    "agreementData[`witness${num}` as keyof typeof agreementData].address",
    "(agreementData[`witness${num}` as keyof typeof agreementData] as any).address"
)
content = content.replace(
    "agreementData[`witness${num}` as keyof typeof agreementData].nid",
    "(agreementData[`witness${num}` as keyof typeof agreementData] as any).nid"
)
content = content.replace(
    "agreementData[`witness${num}` as keyof typeof agreementData].mobile",
    "(agreementData[`witness${num}` as keyof typeof agreementData] as any).mobile"
)

# And for the onChange functions:
content = content.replace(
    "p[`witness${num}` as keyof typeof p], name: e.target.value",
    "(p[`witness${num}` as keyof typeof p] as any), name: e.target.value"
)
content = content.replace(
    "p[`witness${num}` as keyof typeof p], address: e.target.value",
    "(p[`witness${num}` as keyof typeof p] as any), address: e.target.value"
)
content = content.replace(
    "p[`witness${num}` as keyof typeof p], nid: e.target.value",
    "(p[`witness${num}` as keyof typeof p] as any), nid: e.target.value"
)
content = content.replace(
    "p[`witness${num}` as keyof typeof p], mobile: e.target.value",
    "(p[`witness${num}` as keyof typeof p] as any), mobile: e.target.value"
)


with open('src/pages/AdminDashboard.tsx', 'w') as f:
    f.write(content)
