// components/dashboard/TopSoldLastYear.tsx
'use client';
import { useState, useEffect } from 'react';
import { TopSoldProduct } from '@/types/index';
// We can use Recharts, which is in your package.json
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

interface Props {
  userId: string;
}

export function TopSoldLastYear({ userId }: Props) {
  const [products, setProducts] = useState<TopSoldProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTopSold = async () => {
      try {
        setLoading(true);
        // Mock data, as /top-sold/:userId isn't in the backend package.json
        // Replace with actual fetch when ready
        // const res = await fetch(`http://localhost:8000/top-sold/${userId}`);
        // if (!res.ok) throw new Error('Failed to fetch top sold');
        // const data: TopSoldProduct[] = await res.json();
        
        // --- Mock Data Start ---
        await new Promise(res => setTimeout(res, 700)); // Simulate network delay
        const data: TopSoldProduct[] = [
          { _id: 'p1', productName: 'Product A', unitsSold: 1200, revenue: 24000 },
          { _id: 'p2', productName: 'Product B', unitsSold: 950, revenue: 19000 },
          { _id: 'p3', productName: 'Product C', unitsSold: 800, revenue: 15000 },
          { _id: 'p4', productName: 'Product D', unitsSold: 600, revenue: 22000 },
          { _id: 'p5', productName: 'Product E', unitsSold: 450, revenue: 9000 },
        ];
        // --- Mock Data End ---
        
        setProducts(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setLoading(false);
      }
    };
    
    fetchTopSold();
  }, [userId]);
  
  if (loading) return <div className="p-4 text-center text-gray-500 dark:text-gray-400">Loading Top Sold...</div>;
  if (error) return <div className="p-4 text-center text-red-500">Error: {error}</div>;

  return (
    <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md h-96">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Top Sold (Last Year)</h3>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={products} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <XAxis type="number" hide />
          <YAxis 
            dataKey="productName" 
            type="category" 
            width={80} 
            tickLine={false} 
            axisLine={false}
            stroke="hsl(var(--muted-foreground))"
          />
          <Tooltip cursor={{ fill: 'rgba(200, 200, 200, 0.2)' }} />
          <Bar dataKey="unitsSold" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}