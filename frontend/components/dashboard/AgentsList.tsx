// components/dashboard/AgentsList.tsx
'use client';
import { useState, useEffect } from 'react';
import { DeliveryAgent } from '@/types';
import { api } from '@/lib/api';

interface Props {
  userId: string;
}

export function AgentsList({ userId }: Props) {
  const [agents, setAgents] = useState<DeliveryAgent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAgents = async () => {
      try {
        setLoading(true);
        const response = await api.getDeliveryAgents(userId);
        const data: DeliveryAgent[] = await response.json();
        setAgents(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setLoading(false);
      }
    };
    
    fetchAgents();
  }, [userId]);

  const getStatusColor = (status: DeliveryAgent['status']) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'inactive': return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
      case 'on-delivery': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
    }
  };

  if (loading) return <div className="p-4 text-center text-gray-500 dark:text-gray-400">Loading Agents...</div>;
  if (error) return <div className="p-4 text-center text-red-500">Error: {error}</div>;

  return (
    <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Delivery Agents</h3>
      <ul className="space-y-3">
        {agents.length === 0 ? (
          <li className="text-center text-gray-500 dark:text-gray-400">No agents found.</li>
        ) : (
          agents.map((agent) => (
            <li key={agent._id} className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div>
                <p className="font-medium text-gray-900 dark:text-white">{agent.name}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">{agent.phone}</p>
              </div>
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(agent.status)}`}>
                {agent.status}
              </span>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}