import re
with open("src/pages/AdminDashboard.tsx", "r") as f:
    content = f.read()

target = """                          <div>
                            <span className="text-slate-800 font-black block truncate">{item.name}</span>
                            <span className="text-[10px] text-slate-400">
                              ৳{item.price.toLocaleString('bn-BD')} × {item.quantity}টি
                            </span>
                          </div>"""

replacement = """                          <div>
                            <span className="text-slate-800 font-black block truncate">{item.name}</span>
                            <span className="text-[10px] text-slate-400">
                              ৳{item.price.toLocaleString('bn-BD')} × {item.quantity}টি
                              {products.find(p => p.id === item.id)?.piecesPerBox && (
                                <span className="ml-1 text-emerald-600 font-bold">
                                  ({Math.floor(item.quantity / (products.find(p => p.id === item.id)?.piecesPerBox || 24))} বক্স {item.quantity % (products.find(p => p.id === item.id)?.piecesPerBox || 24)} পিস)
                                </span>
                              )}
                            </span>
                          </div>"""

content = content.replace(target, replacement)

with open("src/pages/AdminDashboard.tsx", "w") as f:
    f.write(content)
