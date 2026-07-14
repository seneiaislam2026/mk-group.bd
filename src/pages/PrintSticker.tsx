import { useEffect, useState } from 'react';
import Barcode from 'react-barcode';

export default function PrintSticker() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    setData({
      id: searchParams.get('id') || '',
      name: searchParams.get('name') || '',
      phone: searchParams.get('phone') || '',
      address: searchParams.get('address') || ''
    });

    setTimeout(() => {
      window.print();
    }, 1200);
  }, []);

  if (!data) return null;

  return (
    <div className="bg-white min-h-screen print:bg-white flex justify-center items-start pt-4 text-black font-sans">
      <div className="w-[100mm] border-2 border-black p-4 text-center">
        <h1 className="text-xl font-black uppercase mb-1">MK GROUP</h1>
        <p className="text-[10px] font-bold border-b-2 border-black pb-2 mb-2">
          Pandhoa Bazar, Beside Jahangirnagar University, Savar, Dhaka
          <br/>Phone: 01969317241, 01330457810
        </p>

        {data.id && (
          <div className="flex justify-center my-4 scale-[1.1]">
            <Barcode value={data.id} height={50} width={1.8} fontSize={14} margin={0} displayValue={true} />
          </div>
        )}

        <div className="text-left border-2 border-black p-2 bg-gray-50 mt-4 rounded">
            <h2 className="text-xs font-black uppercase underline mb-1">To (Consignee):</h2>
            <div className="text-sm font-black text-black">Name: {data.name}</div>
            <div className="text-sm font-black text-black mt-1">Phone: {data.phone}</div>
            <div className="text-xs font-bold text-gray-800 mt-1">Address: {data.address}</div>
        </div>
      </div>
    </div>
  );
}
