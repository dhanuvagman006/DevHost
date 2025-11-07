// components/dashboard/ReplenishmentChecker.tsx
'use client';
import { useState } from 'react';
import { api } from '@/lib/api';

interface Props {
  userId: string;
}

interface ReplenishResult {
  productId: string;
  name: string;
  needsRestock: boolean;
  orderPlaced: boolean;
}

export function ReplenishmentChecker({ userId }: Props) {
  const [results, setResults] = useState<ReplenishResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleCheck = async () => {
    setIsLoading(true);
    setMessage('');
    setResults([]);
    
    try {
      const response = await api.replenishCheck(userId);
      const data: ReplenishResult[] = await response.json();
      
      setResults(data);
      if (data.length === 0) {
        setMessage('All items are sufficiently stocked.');
      }
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Auto-Restock Checker</h3>
        <button
          onClick={handleCheck}
          disabled={isLoading}
          className="px-4 py-2 bg-orange-500 text-white rounded-lg font-medium hover:bg-orange-600 disabled:opacity-50"
        >
          {isLoading ? 'Checking...' : 'Run Check'}
        </button>
      </div>
      {message && <p className="text-sm text-center text-gray-600 dark:text-gray-400 mt-4">{message}</p>}
      {results.length > 0 && (
        <ul className="mt-4 space-y-2">
          {results.map((item) => (
            <li key={item.productId} className="p-3 bg-gray-50 dark:bg-gray-700 rounded flex justify-between">
              <span className="font-medium text-gray-800 dark:text-gray-200">{item.name}</span>
              <span className={`font-semibold ${item.orderPlaced ? 'text-green-600' : 'text-yellow-600'}`}>
                {item.orderPlaced ? 'Restock Ordered' : 'Needs Restock'}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}