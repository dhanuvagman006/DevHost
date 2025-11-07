// components/dashboard/TopSoldLastYear.tsx
'use client';
import { useState, useEffect } from 'react';
import { api, getUserId } from '@/lib/api';
// We can use Recharts, which is in your package.json
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

interface TopSoldProduct {
  product_name: string;
  country: string;
  totalSales: number;
  avgPrice: number;
  avgStock: number;
}

interface Props {
  userId?: string;
}

export function TopSoldLastYear({ userId: propUserId }: Props) {
  const [products, setProducts] = useState<TopSoldProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTopSold = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Get userId from props or localStorage
        const userId = propUserId || getUserId();
        if (!userId) {
          throw new Error('No user ID available');
        }

        console.log('📈 Fetching top sold products for user:', userId);
        const response = await api.getTopSold(userId, 5);
        const data = await response.json();
        
        // Handle the backend response structure
        const productsList = data.topSold || data || [];
        console.log('📈 Top sold products received:', productsList);
        setProducts(productsList);
        
      } catch (err) {
        console.error('❌ Error fetching top sold products:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch top sold');
      } finally {
        setLoading(false);
      }
    };
    
    fetchTopSold();
  }, [propUserId]);
  
  if (loading) {
    return (
      <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md h-96">
        <div className="flex items-center justify-center h-full">
          <div className="flex items-center space-x-2">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
            <span className="text-gray-500 dark:text-gray-400">Loading Top Sold...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md h-96">
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <div className="text-red-500 mb-2">Error: Failed to fetch top sold</div>
            <button 
              onClick={() => window.location.reload()} 
              className="text-blue-600 hover:text-blue-500 text-sm underline"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md h-96">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Top Sold (Last Year)</h3>
        <div className="flex items-center justify-center h-64">
          <div className="text-center text-gray-500 dark:text-gray-400">
            <div className="text-4xl mb-2">📊</div>
            <div>No sales data available</div>
            <div className="text-xs mt-1">Add inventory items to see top sellers</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md h-96">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Top Sold (Last Year)</h3>
        <span className="text-sm text-gray-500 dark:text-gray-400">
          {products.length} products
        </span>
      </div>
      <ResponsiveContainer width="100%" height="85%">
        <BarChart data={products} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <XAxis type="number" hide />
          <YAxis 
            dataKey="product_name" 
            type="category" 
            width={80} 
            tickLine={false} 
            axisLine={false}
            tick={{ fontSize: 12 }}
            className="text-gray-600 dark:text-gray-300"
          />
          <Tooltip 
            cursor={{ fill: 'rgba(200, 200, 200, 0.2)' }}
            contentStyle={{
              backgroundColor: 'rgba(0, 0, 0, 0.8)',
              border: 'none',
              borderRadius: '8px',
              color: 'white'
            }}
            formatter={(value, name) => [`${value} units`, 'Sales']}
            labelFormatter={(label) => `Product: ${label}`}
          />
          <Bar 
            dataKey="totalSales" 
            fill="#3B82F6" 
            radius={[0, 4, 4, 0]}
            className="hover:opacity-80"
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}