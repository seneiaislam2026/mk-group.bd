import re
with open("src/pages/ProductLandingPage.tsx", "r") as f:
    content = f.read()

target = """                <div className="text-slate-600 text-xs sm:text-sm leading-relaxed space-y-4">
                  <h3 className="font-extrabold text-slate-800 text-sm select-none">কেন এম.কে.গ্রুপ-এর পণ্য সেরা?</h3>
                  <p>
                    আমাদের প্রতিটি খাদ্যপণ্য ১০০% নিরাপদ এবং বিশুদ্ধতার নিশ্চয়তা দেয়। সরাসরি গ্রামীণ খামার থেকে কঠোর স্বাস্থ্যবিধি মেনে, ভেজালহীন ও স্বাস্থ্যসম্মত উপায়ে এটি সংগ্রহ ও প্রক্রিয়াজাত করা হয়।
                  </p>
                  <p>
                    আমরা কোনো কৃত্রিম প্রিজারভেটিভ বা ক্ষতিকারক কেমিক্যাল ব্যবহার করি না। আপনার পরিবারের সুস্বাস্থ্য ও পুষ্টি নিশ্চিত করার জন্য আমাদের পণ্যই বিশ্বস্ত সমাধান। আমাদের ফাস্ট হোম ডেলিভারির মাধ্যমে একদম তাজা পণ্য পৌঁছে যাবে আপনার ঘরে।
                  </p>
                </div>"""

replacement = """                <div className="text-slate-600 text-xs sm:text-sm leading-relaxed space-y-4">
                  <h3 className="font-extrabold text-slate-800 text-sm select-none">কেন এম.কে.গ্রুপ-এর পণ্য সেরা?</h3>
                  <p>
                    আমাদের প্রতিটি পণ্য ১০০% অরিজিনাল এবং সেরা মানের নিশ্চয়তা দেয়। সরাসরি সেরা উৎপাদনকারী থেকে কঠোর মান নিয়ন্ত্রণ করে এটি সংগ্রহ করা হয়।
                  </p>
                  <p>
                    আপনার দৈনন্দিন জীবনের সেরা অভিজ্ঞতা নিশ্চিত করার জন্য আমাদের পণ্যই বিশ্বস্ত সমাধান। আমাদের ফাস্ট হোম ডেলিভারির মাধ্যমে একদম দ্রুত পণ্য পৌঁছে যাবে আপনার ঘরে।
                  </p>
                </div>"""

content = content.replace(target, replacement)

with open("src/pages/ProductLandingPage.tsx", "w") as f:
    f.write(content)
