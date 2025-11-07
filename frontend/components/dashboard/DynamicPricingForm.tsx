// components/dashboard/DynamicPricingForm.tsx
'use client';
import { useState, FormEvent } from 'react';
import { api } from '@/lib/api';

interface Props {
  userId: string;
}

export function DynamicPricingForm({ userId }: Props) {
  const [productId, setProductId] = useState('');
  const [message, setMessage] = useState('');
  const [newPrice, setNewPrice] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setMessage('');
    setNewPrice(null);
    setLoading(true);
    
    try {
      const response = await api.dynamicPricing(userId, { productId });
      const result = await response.json();
      
      setNewPrice(result.optimizedPrice);
      setMessage(`Optimized price for ${productId} is €${result.optimizedPrice}`);
      setProductId(''); // Clear input on success
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md space-y-4">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Price Optimization</h3>
      <div>
        <label htmlFor="productId" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Product ID</label>
        <input
          type="text"
          id="productId"
          value={productId}
          onChange={(e) => setProductId(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm dark:bg-gray-700 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-500"
          required
        />
      </div>
      <button
        type="submit"
        disabled={loading}
        className="w-full px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? 'Optimizing...' : 'Optimize Price'}
      </button>
      {message && (
        <p className={`text-sm text-center ${newPrice ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
          {message}
        </p>
      )}
    </form>
  );
}