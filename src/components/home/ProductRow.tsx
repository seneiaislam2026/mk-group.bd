import React from 'react';
import ProductCard from '../ui/ProductCard';
import { Product } from '../../types';

interface ProductRowProps {
  title: string;
  subtitle?: string;
  products: Product[];
  bgColor?: string;
}

export default function ProductRow({ title, subtitle, products, bgColor = 'bg-white' }: ProductRowProps) {
  return (
    <section className={`py-12 ${bgColor === 'bg-white' ? 'bg-transparent' : bgColor}`}>
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex justify-between items-end mb-6">
          <div>
            <h3 className="text-lg font-extrabold text-secondary">{title}</h3>
            {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
          </div>
          <button className="text-xs font-medium text-gray-500 underline hover:text-secondary transition-colors">
            সবগুলো দেখুন
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {products.slice(0, 5).map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
