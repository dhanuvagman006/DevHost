"use client"; // This component uses a 3rd-party library (recharts) so it's a Client Component

// You'll need to install recharts: npm install recharts
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

// 1. Define the types for the props
interface ChartCardProps {
  title: string;
  data: any[]; // In a real app, define a stronger type, e.g., { name: string; total: number }[]
  dataKey?: string; // Optional key for the bar, defaults to 'total'
}

// 2. Use the types with React.FC (Functional Component)
export const ChartCard: React.FC<ChartCardProps> = ({ title, data, dataKey = "total" }) => {
  return (
    <div className="p-4 bg-grey-900 rounded-lg shadow-lg shadow-white/10"> {/* <-- MODIFIED THIS LINE */}
      <h3 className="text-lg font-semibold text-violet-600 mb-4">{title}</h3>
      <div className="h-[250px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis fontSize={12} tickLine={false} axisLine={false} />
            <Tooltip
              contentStyle={{ backgroundColor: 'grey', border: '1px solid #ddd', borderRadius: '4px' }}
              labelStyle={{ color: '#333', fontWeight: 'bold' }}
            />
            <Bar dataKey={dataKey} fill="#3bf3eaff" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};