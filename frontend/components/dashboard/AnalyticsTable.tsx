// components/dashboard/AnalyticsTable.tsx
'use client';
import { useState, useEffect } from 'react';
import { KpiMetric } from '@/types/index';
// Assuming you've installed lucide-react (it's in your package.json)
import { ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react';

interface Props {
  userId: string;
}

export function AnalyticsTable({ userId }: Props) {
  const [metrics, setMetrics] = useState<KpiMetric[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        setLoading(true);
        // Mock data, as /analytics/:userId isn't in the backend package.json
        // Replace with actual fetch when ready
        // const res = await fetch(`http://localhost:8000/analytics/${userId}`);
        // if (!res.ok) throw new Error('Failed to fetch analytics');
        // const data: KpiMetric[] = await res.json();
        
        // --- Mock Data Start ---
        await new Promise(res => setTimeout(res, 500)); // Simulate network delay
        const data: KpiMetric[] = [
          { _id: '1', metric: 'Total Revenue', value: '$45,231.89', change: '+20.1%' },
          { _id: '2', metric: 'Subscriptions', value: '+2350', change: '+180.1%' },
          { _id: '3', metric: 'Sales', value: '+12,234', change: '+19%' },
          { _id: '4', metric: 'Active Users', value: '+573', change: '-2.5%' },
        ];
        // --- Mock Data End ---
        
        setMetrics(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setLoading(false);
      }
    };
    
    fetchMetrics();
  }, [userId]);

  const getChangeIcon = (change?: string) => {
    if (!change) return <Minus className="h-4 w-4 text-gray-500" />;
    if (change.startsWith('+')) return <ArrowUpRight className="h-4 w-4 text-green-500" />;
    if (change.startsWith('-')) return <ArrowDownRight className="h-4 w-4 text-red-500" />;
    return <Minus className="h-4 w-4 text-gray-500" />;
  };

  if (loading) return <div className="p-4 text-center text-gray-500 dark:text-gray-400">Loading Analytics...</div>;
  if (error) return <div className="p-4 text-center text-red-500">Error: {error}</div>;

  return (
    <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Key Metrics</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {metrics.map((metric) => (
          <div key={metric._id} className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">{metric.metric}</p>
            <p className="mt-1 text-2xl font-semibold text-gray-900 dark:text-white">{metric.value}</p>
            {metric.change && (
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                {getChangeIcon(metric.change)}
                {metric.change} from last month
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}