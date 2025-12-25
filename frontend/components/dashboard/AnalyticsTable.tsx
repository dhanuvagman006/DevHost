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

  // --- Revised Theme Styles (Clean/Apple) ---
  // We rely on the parent GlassCard for the main background/shadow
  // This component just renders the grid cleanly.

  // --- Helper Functions ---
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
      <div className="flex flex-col items-center justify-center h-full p-6 text-gray-400">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-300 mb-2"></div>
        <p className="text-sm font-medium">{t('loading')}</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-center text-red-500">
        <p className="text-sm font-medium">{t('errorPrefix')} {error}</p>
      </div>
    );
  }

  return (
    <div className="p-4">
      {/* Title is handled by SectionTitle in parent usually, but we keep a subtle header if needed or remove it if redundant. 
          The previous design had a header inside. We'll keep it simple. */}
      {/* <h3 className="text-sm font-semibold text-gray-900 mb-6">{t('title')}</h3> */}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {metrics.map((metric) => (
          <div
            key={metric._id}
            className="p-5 rounded-2xl bg-[#F5F5F7] hover:bg-white border border-transparent hover:border-gray-100 hover:shadow-sm transition-all duration-300"
          >
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide truncate">
              {t(metric.metric)}
            </p>
            <p className="mt-2 text-2xl font-semibold text-[#1D1D1F] tracking-tight">
              {metric.value}
            </p>
            {metric.change && (
              <p
                className="mt-1 text-xs flex items-center gap-1 font-medium"
              >
                {getChangeIcon(metric.change)}
                <span className={metric.change.startsWith('+') ? 'text-green-600' : metric.change.startsWith('-') ? 'text-red-500' : 'text-gray-500'}>
                  {metric.change} {t('changeSuffix')}
                </span>
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}