// components/dashboard/RegionalTopTable.tsx
'use client';
import { useState, useEffect } from 'react';
import { TopSoldProduct } from '@/types/index';

interface Props {
  // Assuming country is dynamic, e.g., from user's profile
  country: string; 
}

export function RegionalTopTable({ country }: Props) {
  const [products, setProducts] = useState<TopSoldProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!country) return;

    const fetchRegionalTop = async () => {
      try {
        setLoading(true);
        // Mock data, as /regional-top/:country isn't in backend
        // Replace with actual fetch when ready
        // const res = await fetch(`http://localhost:8000/regional-top/${country}`);
        // if (!res.ok) throw new Error('Failed to fetch regional data');
        // const data: TopSoldProduct[] = await res.json();
        
        // --- Mock Data Start ---
        await new Promise(res => setTimeout(res, 600)); // Simulate network delay
        const data: TopSoldProduct[] = [
          { _id: 'r1', productName: 'Regional Item X', unitsSold: 5000, revenue: 50000 },
          { _id: 'r2', productName: 'Regional Item Y', unitsSold: 4200, revenue: 30000 },
          { _id: 'r3', productName: 'Product B', unitsSold: 3000, revenue: 60000 },
        ];
        // --- Mock Data End ---
        
        setProducts(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setLoading(false);
      }
    };
    
    fetchRegionalTop();
  }, [country]);
  
  if (loading) return <div className="p-4 text-center text-gray-500 dark:text-gray-400">Loading Regional Data...</div>;
  if (error) return <div className="p-4 text-center text-red-500">Error: {error}</div>;

  return (
    <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Regional Top Sellers ({country})
      </h3>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Product</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Units Sold</th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {products.map((item) => (
              <tr key={item._id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{item.productName}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{item.unitsSold.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}