// components/dashboard/AddAgentForm.tsx
'use client';
import { useState, FormEvent } from 'react';

interface Props {
  userId: string;
}

export function AddAgentForm({ userId }: Props) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setMessage('');
    
    try {
      const res = await fetch(`http://localhost:8000/addDeliveryAgent/${userId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, phone, status: 'inactive' }),
      });

      if (!res.ok) throw new Error('Failed to add agent');
      
      setMessage('Agent added successfully!');
      setName('');
      setPhone('');
      // You might want to trigger a refresh of the AgentsList here
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'An error occurred');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md space-y-4">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Add Delivery Agent</h3>
      <div>
        <label htmlFor="agentName" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Agent Name</label>
        <input
          type="text"
          id="agentName"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm dark:bg-gray-700 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-500"
          required
        />
      </div>
      <div>
        <label htmlFor="agentPhone" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Phone Number</label>
        <input
          type="tel"
          id="agentPhone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm dark:bg-gray-700 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-500"
          required
        />
      </div>
      <button
        type="submit"
        className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      >
        Add Agent
      </button>
      {message && <p className="text-sm text-center text-gray-600 dark:text-gray-400">{message}</p>}
    </form>
  );
}