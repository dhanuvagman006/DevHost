import { Archive, TriangleAlert } from 'lucide-react';

// Mock data
const alerts = [
  { id: 1, item: 'Fresh Milk (1L)', status: 'Low Stock', level: 12 },
  { id: 2, item: 'Red Apples', status: 'Expiring Soon', level: 35 },
  { id: 3, item: 'Baguette', status: 'Low Stock', level: 8 },
];

export function InventoryAlerts() {
  return (
    <div className="p-4 bg-white rounded-lg shadow-sm">
      <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
        <Archive className="w-5 h-5" />
        Inventory Alerts
      </h3>
      <div className="flex flex-col gap-3">
        {alerts.map((alert) => (
          <div key={alert.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            <div className="p-2 bg-red-100 rounded-full">
              <TriangleAlert className="w-5 h-5 text-red-600" />
            </div>
            <div className="flex-1">
              <p className="font-medium text-gray-800">{alert.item}</p>
              <p className="text-sm text-red-600">{alert.status} (Qty: {alert.level})</p>
            </div>
          </div>
        ))}
        <button className="w-full text-sm font-medium text-blue-600 hover:underline">
          View All Inventory
        </button>
      </div>
    </div>
  );
}