// components/dashboard/ForecastForm.tsx
'use client';
import { useState, FormEvent } from 'react';

export function ForecastForm() {
  const [period, setPeriod] = useState('30'); // Default to 30 days
  const [forecastResult, setForecastResult] = useState<any | null>(null);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setMessage('');
    setForecastResult(null);
    
    try {
      const res = await fetch(`http://localhost:8000/forecast`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ days: parseInt(period) }),
      });

      if (!res.ok) throw new Error('Failed to generate forecast');
      
      const result = await res.json();
      setForecastResult(result.forecastData); // Assuming 'forecastData' is the key
      setMessage('Forecast generated successfully.');
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'An error occurred');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md space-y-4">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Demand Forecast</h3>
      <div>
        <label htmlFor="forecastPeriod" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Forecast Period (days)</label>
        <select
          id="forecastPeriod"
          value={period}
          onChange={(e) => setPeriod(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm dark:bg-gray-700 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-500"
        >
          <option value="7">7 Days</option>
          <option value="30">30 Days</option>
          <option value="90">90 Days</option>
        </select>
      </div>
      <button
        type="submit"
        className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700"
      >
        Generate Forecast
      </button>
      {message && <p className="text-sm text-center text-gray-600 dark:text-gray-400">{message}</p>}
      {forecastResult && (
        <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-700 rounded">
          <h4 className="font-medium text-gray-900 dark:text-white">Forecast Result:</h4>
          {/* This is a placeholder. You'd map over 'forecastResult' here. */}
          <pre className="text-sm text-gray-700 dark:text-gray-300 overflow-x-auto">
            {JSON.stringify(forecastResult, null, 2)}
          </pre>
        </div>
      )}
    </form>
  );
}