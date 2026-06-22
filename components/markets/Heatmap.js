'use client';

import { motion } from 'framer-motion';

function tone(change) {
  const c = change || 0;
  if (c >= 5) return 'bg-neon/30 border-neon/40';
  if (c >= 0) return 'bg-neon/10 border-neon/20';
  if (c > -5) return 'bg-red-500/10 border-red-500/20';
  return 'bg-red-500/25 border-red-500/40';
}

export default function Heatmap({ coins }) {
  return (
    <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 lg:grid-cols-6">
      {coins.map((c, i) => {
        const ch = c.price_change_percentage_24h || 0;
        return (
          <motion.div
            key={c.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.01 }}
            className={`rounded-lg border p-2 ${tone(ch)}`}
          >
            <div className="flex items-center gap-1">
              <img src={c.image} alt="" className="h-4 w-4" />
              <span className="text-xs font-semibold">{c.symbol?.toUpperCase()}</span>
            </div>
            <p className={`mt-1 text-xs font-medium ${ch >= 0 ? 'text-neon' : 'text-red-400'}`}>
              {ch >= 0 ? '+' : ''}{ch.toFixed(1)}%
            </p>
          </motion.div>
        );
      })}
    </div>
  );
}
