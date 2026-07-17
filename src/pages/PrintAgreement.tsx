import React, { useEffect } from 'react';


export default function PrintAgreement() {
  const params = new URLSearchParams(typeof window !== 'undefined' ? window.location.search : '');
  
  // Parse data
  const dataString = params.get('data');
  const data = dataString ? JSON.parse(decodeURIComponent(dataString)) : null;

  useEffect(() => {
    if (typeof window !== 'undefined' && data) {
      setTimeout(() => {
        window.print();
      }, 500);
    }
  }, [data]);

  if (!data) return <div className="p-10 text-center">Data not found!</div>;

  return (
    <div className="bg-white min-h-screen text-black w-full" style={{ fontFamily: "'Noto Serif Bengali', serif" }}>
      <style dangerouslySetInnerHTML={{__html: `
        @page { size: 8.5in 14in; margin: 1in; }
        @media print {
          body { -webkit-print-color-adjust: exact; print-color-adjust: exact; background-color: white !important; }
          .page-break { page-break-before: always; }
        }
      `}} />
      
      {/* Page 1 */}
      <div className="max-w-4xl mx-auto p-8 text-sm leading-relaxed relative" style={{ minHeight: '12in' }}>
        <div className="text-center mb-8">
          <h2 className="text-xl font-bold mb-2">বিসমিল্লাহির রাহমানির রাহিম</h2>
          <h1 className="text-2xl font-black mb-4">*** ক্রয় বিক্রয় চুক্তিনামা দলিল ***</h1>
        </div>

        <div className="flex justify-between items-end mb-10 h-32 relative">
          <div className="absolute right-0 bottom-0 flex gap-12">
            <div className="flex flex-col items-center">
              <div className="w-32 border-b border-black mb-2 border-dotted"></div>
              <p className="-rotate-90 origin-left translate-y-16 translate-x-4 text-xs whitespace-nowrap">প্রথম পক্ষের স্বাক্ষর</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-32 border-b border-black mb-2 border-dotted"></div>
              <p className="-rotate-90 origin-left translate-y-16 translate-x-4 text-xs whitespace-nowrap">দ্বিতীয় পক্ষের স্বাক্ষর</p>
            </div>
          </div>
        </div>
        <div className="mt-16">
          <p className="mb-4 text-justify">
            <span className="font-bold">{data.party1.name}</span>, 
            পিতাঃ {data.party1.fname}, 
            মাতাঃ {data.party1.mname}, 
            ঠিকানাঃ {data.party1.address}, 
            জাতীয়তা- বাংলাদেশী, ধর্ম- ইসলাম, পেশা-ব্যবসা, জাতীয় পরিচয় পত্র নম্বর-{data.party1.nid}, 
            মোবাইল নাম্বারঃ {data.party1.mobile}।
          </p>
          <p className="font-bold text-right mb-6">(১ম পক্ষ ক্রেতা)</p>

          <p className="mb-4 text-justify">
            <span className="font-bold">{data.party2.name}</span>, 
            পিতাঃ {data.party2.fname}, 
            মাতাঃ {data.party2.mname}, 
            ঠিকানাঃ {data.party2.address}, 
            জাতীয়তাঃ বাংলাদেশী, জাতীয় পরিচয়পত্র নং- {data.party2.nid}, 
            মোবাইল নাম্বারঃ {data.party2.mobile}।
          </p>
          <p className="font-bold text-right mb-6">(২য় পক্ষ বিক্রেতা)</p>

          <p className="mb-4 text-justify">
            <span className="font-bold">{data.nominee.name}</span>, 
            পিতাঃ {data.nominee.fname}, 
            মাতাঃ {data.nominee.mname}, 
            ঠিকানাঃ {data.nominee.address}, 
            জাতীয়তাঃ বাংলাদেশী, জাতীয় পরিচয়পত্র নংঃ {data.nominee.nid}, 
            মোবাইল নাম্বারঃ {data.nominee.mobile}।
          </p>
          <p className="font-bold text-right mb-8">(বিনিয়োগকারীর নমিনী)</p>

          <p className="mb-8 text-justify">
            পরম করুনাময় মহান আল্লাহ তায়ালার নাম স্বরন করিয়া অত্র ক্রয় বিক্রয়ের চুক্তি পত্রের বর্ণনা আরম্ভ করিলাম। ১ম পক্ষ ক্রেতা, ২য় পক্ষ বিক্রেতার নিকট থেকে উল্লেখিত সামগ্রী নিম্ন শর্তাবলীতে ক্রয় করতে ইচ্ছা পোষণ করিলে উভয় পক্ষের সম্মতিতে নিম্ন শর্তাবলীতে অত্র চুক্তিপত্র সম্পাদন করিলাম।
          </p>

          <h3 className="text-center font-bold mb-4 text-lg">শর্তাবলী নিম্নরূপ</h3>

          <p className="mb-4 text-justify leading-loose">
            ১। ১ম পক্ষ ক্রেতা ২য় পক্ষের নিকট থেকে {data.details.totalAmount}/- ({data.details.totalAmountWords}) টাকার জুতা ক্রয় করেন। 
            উক্ত টাকা প্রতি মাসে {data.details.installmentAmount}/- ({data.details.installmentAmountWords}) টাকা করে {data.details.installmentCount} মাসে প্রদান করিবেন। 
            বাকী {data.details.dueAmount}/- ({data.details.dueAmountWords}) টাকা আগামী {data.details.paymentDate} ইং তারিখে ২য় পক্ষ বিক্রেতাকে পরিশোধ করতে হবে। 
            উক্ত টাকা ১ম পক্ষের {data.details.party1Bank} হিসাব নম্বর- {data.details.party1Account} হতে 
            ২য় পক্ষের {data.details.party2Bank} হিসাব নম্বর- {data.details.party2Account} এ 
            প্রতি মাসে নির্দিষ্ট তারিখে বর্ণিত {data.details.installmentAmount}/- টাকা প্রদান করিবেন। 
            উক্ত টাকার জামানত হিসেবে {data.details.party1Bank} হিসাব নম্বর- {data.details.party1Account} এর {data.details.dueAmount}/- ({data.details.dueAmountWords}) টাকার 
            স্বাক্ষরকৃত চেক এর পাতা নম্বর-{data.details.chequeNumber} জমা দেওয়া হইল।
          </p>
          
          <div className="absolute bottom-8 right-8 text-sm">চলমান পাতা-০২</div>
        </div>
      </div>

      <div className="page-break"></div>
      
      {/* Page 2 */}
      <div className="max-w-4xl mx-auto p-8 text-sm leading-relaxed relative" style={{ minHeight: '12in' }}>
        <div className="text-center mb-8 font-bold">পাতা - ০২</div>
        
        <div className="flex justify-end mb-16 h-32 relative">
          <div className="absolute right-0 top-0 flex gap-12">
            <div className="flex flex-col items-center">
              <div className="w-32 border-b border-black mb-2 border-dotted"></div>
              <p className="-rotate-90 origin-left translate-y-16 translate-x-4 text-xs whitespace-nowrap">প্রথম পক্ষের স্বাক্ষর</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-32 border-b border-black mb-2 border-dotted"></div>
              <p className="-rotate-90 origin-left translate-y-16 translate-x-4 text-xs whitespace-nowrap">দ্বিতীয় পক্ষের স্বাক্ষর</p>
            </div>
          </div>
        </div>

        <div className="mt-32">
          <p className="mb-6 text-justify leading-loose">
            ২। ১ম পক্ষ ক্রেতা কোন অবস্থাতেই উল্লেখিত তারিখে টাকা প্রদান করতে কোন রূপ টালবাহান করিতে পারিবেন না। করিলে ২য় পক্ষ বিক্রেতা অত্র চুক্তি পত্র দলিল বলে ১ম পক্ষের বিরুদ্ধে যে কোন আইনানুগ ব্যবস্থা গ্রহন করিতে পারবে।
          </p>
          <p className="mb-8 text-justify leading-loose">
            ৩। ১ম পক্ষ বা ২য় পক্ষের অবর্তমানে তাদের স্থলবর্তী ওয়ারিশানগন অত্র চুক্তিপত্রের সকল শর্ত মানিয়া চলিতে বাধ্য থাকিবেন এবং চুক্তি পত্র অনুযায়ী ২য় পক্ষের সমুদয় পাওনা পরিশোধ করতে বাধ্য থাকিবেন।
          </p>

          <p className="mb-6 text-justify leading-loose">
            ওয়ারিশ-১ ({data.warish1.relation}): <span className="font-bold">{data.warish1.name}</span>, 
            ঠিকানাঃ {data.warish1.address}, 
            জাতীয় পরিচয়পত্র নং- {data.warish1.nid}, 
            মোবাইল নাম্বারঃ {data.warish1.mobile}।
          </p>
          
          <p className="mb-6 text-justify leading-loose">
            ওয়ারিশ-২ ({data.warish2.relation}): <span className="font-bold">{data.warish2.name}</span>, 
            ঠিকানাঃ {data.warish2.address}, 
            জাতীয় পরিচয়পত্র নং- {data.warish2.nid}, 
            মোবাইল নাম্বারঃ {data.warish2.mobile}।
          </p>
        </div>
        
        <div className="absolute bottom-8 right-8 text-sm">চলমান পাতা-০৩</div>
      </div>

      <div className="page-break"></div>
      
      {/* Page 3 */}
      <div className="max-w-4xl mx-auto p-8 text-sm leading-relaxed relative" style={{ minHeight: '12in' }}>
        <div className="text-center mb-8 font-bold">পাতা-০৩</div>
        
        <div className="flex justify-end mb-16 h-32 relative">
          <div className="absolute right-0 top-0 flex gap-12">
            <div className="flex flex-col items-center">
              <div className="w-32 border-b border-black mb-2 border-dotted"></div>
              <p className="-rotate-90 origin-left translate-y-16 translate-x-4 text-xs whitespace-nowrap">প্রথম পক্ষের স্বাক্ষর</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-32 border-b border-black mb-2 border-dotted"></div>
              <p className="-rotate-90 origin-left translate-y-16 translate-x-4 text-xs whitespace-nowrap">দ্বিতীয় পক্ষের স্বাক্ষর</p>
            </div>
          </div>
        </div>

        <div className="mt-32">
          <p className="mb-12 text-justify leading-loose">
            এতদ্বার্থে আমরা উভয় পক্ষ উপরের শর্তবলী সুস্থ মস্তিষ্কে পড়িয়া, বুঝিয়া ও ইহার মর্ম অনুধাবন করিয়া সজ্ঞানে সুস্থ শরীরে নিজ নিজ স্বাক্ষর করিলাম।
          </p>

          <h3 className="font-bold underline mb-8">সাক্ষীগণের স্বাক্ষর</h3>

          <div className="space-y-12 w-full">
            {[data.witness1, data.witness2, data.witness3].map((w, i) => (
              <div key={i} className="flex justify-between items-end">
                <div className="w-2/3">
                  <p>{i + 1}। <span className="font-bold">{w.name}</span></p>
                  <p>ঠিকানাঃ {w.address}</p>
                  <p>জাতীয় পরিচয়পত্র নং- {w.nid}</p>
                  <p>মোবাইলঃ {w.mobile}</p>
                </div>
                <div className="w-1/3 border-b border-black flex justify-center pb-2">
                   {/* Name below line - can be hand written or printed */}
                   {w.name}
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="absolute bottom-8 w-full text-center text-sm font-bold mt-16 left-0">
          অত্র দলিল তিন ফর্দে কম্পোজকৃত এবং স্বাক্ষী ০৩ (তিন) জন রহিল।
        </div>
      </div>
    </div>
  );
}
