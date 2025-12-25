'use client';
import { useState, useEffect } from 'react';
import { api, getUserId } from '@/lib/api';
import { useTranslations } from 'next-intl'; // Import useTranslations

interface InventoryItem {
  _id: string;
  product_name: string;
  Quantity: number;
  selling_price?: number;
  cost_price?: number;
  country: string;
  month: number;
  createdAt: string;
}

interface Props {
  userId?: string;
}

export function InventoryTable({ userId: propUserId }: Props) {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Initialize the translation function
  // Assumes translations are namespaced under 'InventoryTable'
  const t = useTranslations('InventoryTable');

  useEffect(() => {
    const fetchItems = async () => {
      try {
        setLoading(true);
        setError(null);

        const userId = propUserId || getUserId();
        if (!userId) {
          throw new Error('No user ID available');
        }

        console.log('📦 Fetching inventory items for user:', userId);
        const response = await api.getItems(userId);
        const data = await response.json();

        const itemsList = data.items || data || [];
        console.log('📦 Inventory items received:', itemsList);
        setItems(itemsList);

      } catch (err) {
        console.error('❌ Error fetching inventory:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch inventory');
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, [propUserId]);

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center space-x-2 text-gray-400">
        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-current"></div>
        <span className="text-sm">{t('loading')}</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-center text-red-500">
        <div className="text-sm mb-2">{t('errorTitle')}</div>
        <button
          onClick={() => window.location.reload()}
          className="text-[#0066CC] hover:underline text-xs"
        >
          {t('retry')}
        </button>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
        <h3 className="text-sm font-semibold text-[#1D1D1F]">{t('title')}</h3>
        <span className="text-xs font-medium text-gray-400 bg-gray-50 px-2 py-1 rounded-full">
          {t('itemCount', { count: items.length })}
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr className="border-b border-gray-100">
              <th scope="col" className="px-6 py-3 text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest">{t('header.productName')}</th>
              <th scope="col" className="px-6 py-3 text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest">{t('header.country')}</th>
              <th scope="col" className="px-6 py-3 text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest">{t('header.quantity')}</th>
              <th scope="col" className="px-6 py-3 text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest">{t('header.price')}</th>
              <th scope="col" className="px-6 py-3 text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest">{t('header.month')}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {items.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-gray-400">
                  <div className="flex flex-col items-center space-y-2">
                    <span className="text-2xl opacity-50">📦</span>
                    <div className="text-sm font-medium">{t('empty.message')}</div>
                    <div className="text-xs opacity-70">{t('empty.prompt')}</div>
                  </div>
                </td>
              </tr>
            ) : (
              items.map((item, index) => (
                <tr key={item._id || index} className="group hover:bg-gray-50/80 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-[#1D1D1F]">
                    {item.product_name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">
                    {item.country}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {item.Quantity}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-[#1D1D1F]">
                    €{(item.selling_price || item.cost_price || 0).toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {item.month}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}