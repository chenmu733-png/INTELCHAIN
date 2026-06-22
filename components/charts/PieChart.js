'use client';

import {
  ResponsiveContainer,
  PieChart as RePieChart,
  Pie,
  Cell,
  Tooltip
} from 'recharts';

const COLORS = ['#22e584', '#16c474', '#3b82f6', '#a855f7', '#f59e0b', '#64748b'];

export default function PieChart({ data, height = 220 }) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <RePieChart>
        <Pie
          data={data}
          dataKey="value"
          nameKey="name"
          innerRadius="55%"
          outerRadius="85%"
          paddingAngle={2}
          stroke="none"
        >
          {data.map((entry, i) => (
            <Cell key={i} fill={COLORS[i % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip
          contentStyle={{
            background: '#0a0d12',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: 12,
            fontSize: 12
          }}
          formatter={(v, n) => [`${v}%`, n]}
        />
      </RePieChart>
    </ResponsiveContainer>
  );
}
