// components/dashboard/BillingForm.tsx
'use client';
import { useState, FormEvent } from 'react';
import { api } from '@/lib/api';

interface Props {
  userId: string;
}
const BACK_END_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
export function BillingForm({ userId }: Props) {
  const [cart, setCart] = useState<{ productId: string, quantity: number }[]>([
    { productId: '', quantity: 1 }
  ]);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleCartChange = (index: number, field: string, value: string | number) => {
    const newCart = [...cart];
    newCart[index] = { ...newCart[index], [field]: value };
    setCart(newCart);
  };

  const addItem = () => {
    setCart([...cart, { productId: '', quantity: 1 }]);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setMessage('');
    setLoading(true);
    
    try {
      // Filter out empty items before sending
      const validItems = cart.filter(item => item.productId && item.quantity > 0);
      if (validItems.length === 0) {
        setMessage('Please add at least one valid item');
        return;
      }

      const response = await api.createBill(userId, { items: validItems });
      const result = await response.json();
      
      setMessage(`Billing successful! Total: $${result.totalPrice}. Invoice ID: ${result.invoiceId}`);
      setCart([{ productId: '', quantity: 1 }]);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md space-y-4">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Process Bill</h3>
      {cart.map((item, index) => (
        <div key={index} className="flex gap-2">
          <input
            type="text"
            placeholder="Product ID"
            value={item.productId}
            onChange={(e) => handleCartChange(index, 'productId', e.target.value)}
            className="flex-grow block w-full rounded-md border-gray-300 shadow-sm dark:bg-gray-700 dark:border-gray-600"
          />
          <input
            type="number"
            placeholder="Qty"
            value={item.quantity}
            onChange={(e) => handleCartChange(index, 'quantity', parseInt(e.target.value) || 1)}
            className="w-20 block rounded-md border-gray-300 shadow-sm dark:bg-gray-700 dark:border-gray-600"
          />
        </div>
      ))}
      <button
        type="button"
        onClick={addItem}
        className="w-full px-4 py-2 bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-200 rounded-lg font-medium hover:bg-gray-300 dark:hover:bg-gray-600"
      >
        Add Another Item
      </button>
      <button
        type="submit"
        disabled={loading}
        className="w-full px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? 'Processing...' : 'Process Payment'}
      </button>
      {message && <p className="text-sm text-center text-gray-600 dark:text-gray-400">{message}</p>}
    </form>
  );
}