'use client';

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from 'recharts';

export default function LineChart({ data, height = 260, color = '#22e584' }) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="icArea" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity={0.35} />
            <stop offset="100%" stopColor={color} stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid stroke="rgba(255,255,255,0.05)" vertical={false} />
        <XAxis
          dataKey="t"
          tickFormatter={(t) =>
            new Date(t).toLocaleDateString(undefined, {
              month: 'short',
              day: 'numeric'
            })
          }
          tick={{ fill: '#6b7280', fontSize: 11 }}
          axisLine={false}
          tickLine={false}
          minTickGap={40}
        />
        <YAxis
          domain={['auto', 'auto']}
          tick={{ fill: '#6b7280', fontSize: 11 }}
          axisLine={false}
          tickLine={false}
          width={56}
          tickFormatter={(v) =>
            v >= 1000 ? `$${(v / 1000).toFixed(1)}k` : `$${v.toFixed(2)}`
          }
        />
        <Tooltip
          contentStyle={{
            background: '#0a0d12',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: 12,
            fontSize: 12
          }}
          labelFormatter={(t) => new Date(t).toLocaleString()}
          formatter={(v) => [`$${Number(v).toLocaleString()}`, 'Price']}
        />
        <Area
          type="monotone"
          dataKey="price"
          stroke={color}
          strokeWidth={2}
          fill="url(#icArea)"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
