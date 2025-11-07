'use client';
import { useState, useEffect } from 'react';
import { KpiMetric } from '@/types/index';
import { ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react';
import { api } from '@/lib/api'; // Adjust path if needed
import GradientText from '../GradientText';
interface Props {
  userId: string;
}

// +++ DUMMY DATA +++
const dummyMetrics: KpiMetric[] = [
  {
    _id: '1',
    metric: 'Total Revenue',
    value: '€45,231.89',
    change: '+12.5%',
  },
  {
    _id: '2',
    metric: 'New Customers',
    value: '1,204',
    change: '+8.2%',
  },
  {
    _id: '3',
    metric: 'Conversion Rate',
    value: '3.12%',
    change: '-1.5%',
  },
  {
    _id: '4',
    metric: 'Avg. Order Value',
    value: '€120.50',
    change: '+0.5%',
  },
];
// +++ END DUMMY DATA +++

export function AnalyticsTable({ userId }: Props) {
  // +++ TOGGLE FOR DUMMY DATA +++
  const useDummyData = true;
  // +++ END TOGGLE +++

  const [metrics, setMetrics] = useState<KpiMetric[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // --- Theme Style Objects ---
  const cardStyle = {
    background: 'rgba(255, 255, 255, 0.7)', // White glass
    backdropFilter: 'blur(10px)',
    border: '1px solid var(--color-border)',
    borderRadius: '12px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)', // soft elevation
  };

  const innerCardStyle = {
    background: 'var(--color-bg-surface)',
    borderColor: 'var(--color-border)',
  };

  const textPrimary = { color: 'var(--color-text-primary)' };
  const textSecondary = { color: 'var(--color-text-secondary)' };
  // --- End Theme Styles ---

  useEffect(() => {
    if (useDummyData) {
      setMetrics(dummyMetrics);
      setLoading(false);
      return;
    }

    if (!userId) {
      setLoading(false);
      setError('No user ID provided.');
      return;
    }

    const fetchMetrics = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await api.getAnalytics(userId);
        const responseData = await res.json();
        console.log('API analytics response:', responseData);

        const metricsArray =
          responseData.metrics || responseData.data || responseData;

        if (Array.isArray(metricsArray)) {
          setMetrics(metricsArray);
        } else {
          console.error(
            'API response did not contain a valid metrics array:',
            responseData,
          );
          setError('Received invalid data format from the server.');
        }
      } catch (err) {
        console.error('Error fetching analytics:', err);
        setError(
          err instanceof Error ? err.message : 'An unknown error occurred',
        );
      } finally {
        setLoading(false);
      }
    };

    fetchMetrics();
  }, [userId, useDummyData]);

  const getChangeIcon = (change?: string) => {
    if (!change) return <Minus className="h-4 w-4 text-gray-500" />;
    if (change.startsWith('+'))
      return <ArrowUpRight className="h-4 w-4 text-green-500" />;
    if (change.startsWith('-'))
      return <ArrowDownRight className="h-4 w-4 text-red-500" />;
    return <Minus className="h-4 w-4 text-gray-500" />;
  };

  if (loading) {
    return (
      <div className="p-6" style={cardStyle}>
        <h3 className="text-lg text-red font-semibold mb-4" style={textPrimary}>
          <GradientText>
            Key Metrics
            </GradientText>
        </h3>
        <div className="p-4 text-center" style={textSecondary}>
          Loading Analytics...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6" style={cardStyle}>
        <h3 className="text-lg font-semibold mb-4" style={textPrimary}>
          Key Metrics
        </h3>
        {/* Error text remains semantic red */}
        <div className="p-4 text-center text-red-500">Error: {error}</div>
      </div>
    );
  }

  if (!metrics || metrics.length === 0) {
    return (
      <div className="p-6" style={cardStyle}>
        <h3 className="text-lg font-semibold mb-4" style={textPrimary}>
          Key Metrics
        </h3>
        <div className="p-4 text-center" style={textSecondary}>
          No key metrics data available.
        </div>
      </div>
    );
  }

  return (
    <div className="p-6" style={cardStyle}>
      <h3 className="text-lg font-semibold mb-4" style={textPrimary}>
        Key Metrics
      </h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {metrics.map((metric) => (
          <div
            key={metric._id}
            className="p-4 rounded-lg border" // Use border and new surface bg
            style={innerCardStyle}
          >
            <p className="text-sm font-medium truncate" style={textSecondary}>
              {metric.metric}
            </p>
            <p className="mt-1 text-2xl font-semibold" style={textPrimary}>
              {metric.value}
            </p>
            {metric.change && (
              <p
                className="mt-1 text-xs flex items-center gap-1"
                style={textSecondary}
              >
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