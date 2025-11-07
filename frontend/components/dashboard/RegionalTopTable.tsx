// components/dashboard/RegionalTopTable.tsx
'use client';
import { useState, useEffect } from 'react';
import { api } from '@/lib/api';

interface RegionalTopProduct {
  product_name: string;
  totalSales: number;
  avgPrice: number;
  retailerCount: number;
}

interface Props {
  // Assuming country is dynamic, e.g., from user's profile
  country: string; 
}

export function RegionalTopTable({ country }: Props) {
  const [products, setProducts] = useState<RegionalTopProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!country) return;

    const fetchRegionalTop = async () => {
      try {
        setLoading(true);
        setError(null);
      
        console.log('🌍 Fetching regional top products for country:', country);
        const response = await api.getRegionalTop(country, 5);
        const data = await response.json();
        
        // Handle the backend response structure
        const productsList = data.topRegional || data || [];
        console.log('🌍 Regional top products received:', productsList);
        setProducts(productsList);
        
      } catch (err) {
        console.error('❌ Error fetching regional top products:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch regional data');
      } finally {
        setLoading(false);
      }
    };
    
    fetchRegionalTop();
  }, [country]);
  
  if (loading) {
    return (
      <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
        <div className="flex items-center justify-center space-x-2">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
          <span className="text-gray-500 dark:text-gray-400">Loading Regional Data...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
        <div className="text-center">
          <div className="text-red-500 mb-2">Error: Failed to fetch regional data</div>
          <button 
            onClick={() => window.location.reload()} 
            className="text-blue-600 hover:text-blue-500 text-sm underline"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Regional Top Sellers
        </h3>
        <span className="text-sm text-gray-500 dark:text-gray-400 capitalize">
          🌍 {country}
        </span>
      </div>
      
      {products.length === 0 ? (
        <div className="text-center py-8">
          <div className="text-gray-400 text-4xl mb-2">🏪</div>
          <div className="text-gray-500 dark:text-gray-400">No regional data available</div>
          <div className="text-xs text-gray-400 mt-1">Data from nearby retailers</div>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Product</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Total Sales</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Avg Price</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Retailers</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {products.map((item, index) => (
                <tr key={`${item.product_name}-${index}`} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                    {item.product_name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                    {item.totalSales.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                    ${item.avgPrice.toFixed(2)}
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