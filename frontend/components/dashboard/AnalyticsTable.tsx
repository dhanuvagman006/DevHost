'use client';
import { useState, useEffect } from 'react';
import { KpiMetric } from '@/types/index';
import { ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react';
import { api } from '@/lib/api'; // Adjust path if needed
import GradientText from '../GradientText';
import { useTranslations } from 'next-intl'; // +++ IMPORT

interface Props {
  userId: string;
}

// +++ MODIFIED DUMMY DATA (Using i18n keys) +++
const dummyMetrics: KpiMetric[] = [
  {
    _id: '1',
    metric: 'totalRevenue', // Changed from 'Total Revenue'
    value: '€45,231.89',
    change: '+12.5%',
  },
  {
    _id: '2',
    metric: 'newCustomers', // Changed from 'New Customers'
    value: '1,204',
    change: '+8.2%',
  },
  {
    _id: '3',
    metric: 'conversionRate', // Changed from 'Conversion Rate'
    value: '3.12%',
    change: '-1.5%',
  },
  {
    _id: '4',
    metric: 'avgOrderValue', // Changed from 'Avg. Order Value'
    value: '€120.50',
    change: '+0.5%',
  },
];
// +++ END DUMMY DATA +++

// +++ HELPER MAP (Converts API strings to i18n keys) +++
const metricKeyMap: { [key: string]: string } = {
  'Total Revenue': 'totalRevenue',
  'New Customers': 'newCustomers',
  'Conversion Rate': 'conversionRate',
  'Avg. Order Value': 'avgOrderValue',
};

// Helper to convert API strings to i18n keys
const getMetricKey = (metricString: string): string => {
  return metricKeyMap[metricString] || metricString; // Fallback to the string itself
};
// +++ END HELPER MAP +++

export function AnalyticsTable({ userId }: Props) {
  const t = useTranslations('AnalyticsTable'); // +++ INITIALIZE HOOK
  const useDummyData = false;

  const [metrics, setMetrics] = useState<KpiMetric[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // --- Theme Style Objects (Unchanged) ---
  const cardStyle = {
    background: 'rgba(255, 255, 255, 0.7)',
    backdropFilter: 'blur(10px)',
    border: '1px solid var(--color-border)',
    borderRadius: '12px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
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
      setMetrics(dummyMetrics); // Dummy data already uses keys
      setLoading(false);
      return;
    }

    if (!userId) {
      setLoading(false);
      setError(t('errorNoUserId')); // +++ TRANSLATED
      return;
    }

    const fetchMetrics = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await api.getAnalytics(userId);

        if (!res.ok) {
          throw new Error(`API Error: ${res.status} ${res.statusText}`);
        }

        const responseData = await res.json();
        console.log('API analytics response:', responseData);

        const metricsArray =
          responseData.metrics || responseData.data || responseData;

        if (Array.isArray(metricsArray) && metricsArray.length > 0) {
          // +++ MAP API DATA TO USE i18n KEYS +++
          const mappedMetrics = metricsArray.map((m: KpiMetric) => ({
            ...m,
            metric: getMetricKey(m.metric),
          }));
          setMetrics(mappedMetrics);
        } else {
          console.warn(
            'API response was empty or invalid, falling back to mock data.'
          );
          setMetrics(dummyMetrics); // Fallback uses keys
        }
      } catch (err) {
        console.error('Error fetching analytics, falling back to mock data:', err);
        setMetrics(dummyMetrics); // Fallback uses keys
      } finally {
        setLoading(false);
      }
    };

    fetchMetrics();
  }, [userId, useDummyData, t]); // +++ Add `t` to dependency array

  // --- getChangeIcon (Unchanged) ---
  const getChangeIcon = (change?: string) => {
    if (!change) return <Minus className="h-4 w-4 text-gray-500" />;
    if (change.startsWith('+'))
      return <ArrowUpRight className="h-4 w-4 text-green-500" />;
    if (change.startsWith('-'))
      return <ArrowDownRight className="h-4 w-4 text-red-500" />;
    return <Minus className="h-4 w-4 text-gray-500" />;
  };
  // ---

  if (loading) {
    return (
      <div className="p-6" style={cardStyle}>
        <h3 className="text-lg text-red font-semibold mb-4" style={textPrimary}>
          <GradientText>
            {t('title')} {/* +++ TRANSLATED */}
          </GradientText>
        </h3>
        <div className="p-4 text-center" style={textSecondary}>
          {t('loading')} {/* +++ TRANSLATED */}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6" style={cardStyle}>
        <h3 className="text-lg font-semibold mb-4" style={textPrimary}>
          {t('title')} {/* +++ TRANSLATED */}
        </h3>
        <div className="p-4 text-center text-red-500">
          {t('errorPrefix')}
          {error} {/* +++ TRANSLATED (prefix) */}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6" style={cardStyle}>
      <h3 className="text-lg font-semibold mb-4" style={textPrimary}>
        {t('title')} {/* +++ TRANSLATED */}
      </h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {metrics.map((metric) => (
          <div
            key={metric._id}
            className="p-4 rounded-lg border"
            style={innerCardStyle}
          >
            <p className="text-sm font-medium truncate" style={textSecondary}>
              {t(metric.metric)} {/* +++ TRANSLATED (dynamic key) */}
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
                {metric.change} {t('changeSuffix')} {/* +++ TRANSLATED */}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}