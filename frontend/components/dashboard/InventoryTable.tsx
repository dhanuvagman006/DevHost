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
      <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
        <div className="flex items-center justify-center space-x-2">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
          {/* Translated string */}
          <span className="text-gray-500 dark:text-gray-400">{t('loading')}</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
        <div className="text-center">
          {/* Translated string */}
          <div className="text-red-500 mb-2">{t('errorTitle')}</div>
          <button 
            onClick={() => window.location.reload()} 
            className="text-blue-600 hover:text-blue-500 text-sm underline"
          >
            {/* Translated string */}
            {t('retry')}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
      <div className="flex items-center justify-between mb-4">
        {/* Translated string */}
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{t('title')}</h3>
        <span className="text-sm text-gray-500 dark:text-gray-400">
          {/* Translated string with pluralization */}
          {t('itemCount', { count: items.length })}
        </span>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              {/* Translated headers */}
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">{t('header.productName')}</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">{t('header.country')}</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">{t('header.quantity')}</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">{t('header.price')}</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">{t('header.month')}</th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {items.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
                  <div className="flex flex-col items-center space-y-2">
                    <div className="text-gray-400">📦</div>
                    {/* Translated empty state */}
                    <div>{t('empty.message')}</div>
                    <div className="text-xs">{t('empty.prompt')}</div>
                  </div>
                </td>
              </tr>
            ) : (
              items.map((item, index) => (
                <tr key={item._id || index} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                    {item.product_name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300 capitalize">
                    {item.country}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                    {item.Quantity}
                  </td>
                  <td className="px-6 py-4 whitespace-nowTwrap text-sm text-gray-500 dark:text-gray-300">
                    €{(item.selling_price || item.cost_price || 0).toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
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