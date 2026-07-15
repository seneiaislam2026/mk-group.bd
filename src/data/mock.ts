import { Product, Category, Review } from '../types';

export const categories: Category[] = [
  { id: '1', name: 'জেন্টস ব্যাগ', icon: 'ShoppingBag', slug: 'gents-bag' },
  { id: '2', name: 'ক্যাজুয়াল জুতো', icon: 'Footprints', slug: 'casual-shoes' },
  { id: '3', name: 'স্পোর্টস জুতো', icon: 'Activity', slug: 'sports-shoes' },
  { id: '4', name: 'ল্যামিজ স্যান্ডেল', icon: 'Flame', slug: 'lamiz-sandals' },
  { id: '5', name: 'বাচ্চাদের কালেকশন', icon: 'Smile', slug: 'kids-collection' },
  { id: '6', name: 'ক্রোকারি আইটেম', icon: 'Utensils', slug: 'crockery-items' },
];

export const mockProducts: Product[] = [];

export const mockReviews: Review[] = [
  {
    id: 'r1',
    customerName: 'আব্দুর রহমান',
    rating: 5,
    comment: 'জুতোর কোয়ালিটি অনেক ভালো ছিল। প্যাকেজিং এবং ডেলিভারি নিয়ে আমি পুরোপুরি সন্তুষ্ট।',
    date: '২০ ফাল্গুন, ১৪৩০'
  },
  {
    id: 'r2',
    customerName: 'ফারহানা ইসলাম',
    rating: 4,
    comment: 'ব্যাগটি অনেক ফ্রেশ ছিল। তবে ডেলিভারিতে একটু দেরি হয়েছে। সব মিলিয়ে ভালো সার্ভিস।',
    date: '১৫ ফাল্গুন, ১৪৩০'
  },
  {
    id: 'r3',
    customerName: 'শরীফুল হক',
    rating: 5,
    comment: 'জুতোজোড়া একদম সুন্দর ছিল। যেমনটা ছবিতে দেখেছি, ঠিক তেমনই। ধন্যবাদ এম.কে.গ্রুপ!',
    date: '১০ ফাল্গুন, ১৪৩০'
  }
];
