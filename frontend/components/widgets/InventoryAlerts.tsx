import { Archive, TriangleAlert } from 'lucide-react';
import { useTranslations } from 'next-intl';

// Mock data updated to use translation keys for status
const alerts = [
  { id: 1, item: 'Fresh Milk (1L)', statusKey: 'lowStock', level: 12 },
  { id: 2, item: 'Red Apples', statusKey: 'expiringSoon', level: 35 },
  { id: 3, item: 'Baguette', statusKey: 'lowStock', level: 8 },
];

export function InventoryAlerts() {
  // Initialize the translation hook with the component's namespace
  const t = useTranslations('InventoryAlerts');

  return (
    <div className="p-4 bg-grey-900 rounded-lg shadow-sm">
      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-teal-300">
        <Archive className="w-5 h-5" />
        {t('title')} {/* "Inventory Alerts" */}
      </h3>
      <div className="flex flex-col gap-3">
        {alerts.map((alert) => (
          <div key={alert.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            <div className="p-2 bg-red-100 rounded-full">
              <TriangleAlert className="w-5 h-5 text-red-600" />
            </div>
            <div className="flex-1">
              <p className="font-medium text-gray-800">{alert.item}</p>
              <p className="text-sm text-red-600">
                {t(alert.statusKey)} {/* "Low Stock" or "Expiring Soon" */}
                {' '}
                ({t('quantity', { level: alert.level })}) {/* "Qty: 12" */}
              </p>
            </div>
          </div>
        ))}
        <button className="w-full text-sm font-medium text-blue-600 hover:underline">
          {t('viewAll')} {/* "View All Inventory" */}
        </button>
      </div>
    </div>
  );
}