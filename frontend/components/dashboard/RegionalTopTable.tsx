// components/dashboard/RegionalTopTable.tsx
'use client';
import { useState, useEffect, useCallback } from 'react';
import { api } from '@/lib/api';
// Import next-intl hooks
import { useTranslations, useFormatter } from 'next-intl';

interface RegionalTopProduct {
  product_name: string;
  totalSales: number;
  avgPrice: number;
  retailerCount: number;
}

interface Props {
  country: string; // e.g., 'fi', 'se', 'dk', 'no', 'is'
}

// Helper to map country codes to currencies
const getCurrency = (country: string) => {
  switch (country.toLowerCase()) {
    case 'fi': // Finland
      return 'EUR';
    case 'is': // Iceland
      return 'ISK';
    case 'dk': // Denmark
      return 'DKK';
    case 'no': // Norway
      return 'NOK';
    case 'se': // Sweden
      return 'SEK';
    default: // Fallback (e.g., 'en' or other)
      return 'USD';
  }
};

export function RegionalTopTable({ country }: Props) {
  // --- i18n Hooks ---
  // Changed to 'components.TopTable'
  const t = useTranslations('components.TopTable');
  const format = useFormatter();
  const currency = getCurrency(country);

  // --- State ---
  const [products, setProducts] = useState<RegionalTopProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // --- Data Fetching ---
  const fetchRegionalTop = useCallback(async () => {
    if (!country) return;

    try {
      setLoading(true);
      setError(null);

      console.log('🌍 Fetching regional top products for country:', country);
      const response = await api.getRegionalTop(country, 5);
      const data = await response.json();

      const productsList = data.topRegional || data || [];
      console.log('🌍 Regional top products received:', productsList);
      setProducts(productsList);
    } catch (err) {
      console.error('❌ Error fetching regional top products:', err);
      setError(
        err instanceof Error ? err.message : 'Failed to fetch regional data',
      );
    } finally {
      setLoading(false);
    }
  }, [country]); 

  useEffect(() => {
    fetchRegionalTop();
  }, [fetchRegionalTop]); 

  // --- Render Loading State ---
  if (loading) {
    return (
      <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
        <div className="flex items-center justify-center space-x-2">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
          <span className="text-gray-500 dark:text-gray-400">
            {t('loading')}
          </span>
        </div>
      </div>
    );
  }

  // --- Render Error State ---
  if (error) {
    return (
      <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
        <div className="text-center">
          <div className="text-red-500 mb-2">{t('error')}</div>
          <button
            onClick={fetchRegionalTop} 
            className="text-blue-600 hover:text-blue-500 text-sm underline"
          >
            {t('retry')}
          </button>
        </div>
      </div>
    );
  }

  // --- Render Main Content ---
  return (
    <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          {t('title')}
        </h3>
        <span className="text-sm text-gray-500 dark:text-gray-400 capitalize">
          🌍 {country}
        </span>
      </div>

      {products.length === 0 ? (
        <div className="text-center py-8">
          <div className="text-gray-400 text-4xl mb-2">🏪</div>
          <div className="text-gray-500 dark:text-gray-400">
            {t('empty.title')}
          </div>
          <div className="text-xs text-gray-400 mt-1">
            {t('empty.subtitle')}
          </div>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase"
                >
                  {t('headers.product')}
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase"
                >
                  {t('headers.totalSales')}
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase"
                >
                  {t('headers.avgPrice')}
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase"
                >
                  {t('headers.retailers')}
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {products.map((item, index) => (
                <tr
                  key={`${item.product_name}-${index}`}
                  className="hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                    {item.product_name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                    {format.number(item.totalSales)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                    {format.number(item.avgPrice, {
                      style: 'currency',
                      currency: currency,
                    })}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                    {item.retailerCount}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}