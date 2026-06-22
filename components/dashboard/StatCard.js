'use client';

import { motion } from 'framer-motion';
import { Card } from '@/components/ui/Card';
import Skeleton from '@/components/ui/Skeleton';

export default function StatCard({ label, value, sub, loading }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card>
        <p className="text-xs uppercase tracking-wide text-gray-500">{label}</p>
        {loading ? (
          <Skeleton className="mt-2 h-7 w-28" />
        ) : (
          <p className="mt-1 text-xl font-bold text-white">{value}</p>
        )}
        {sub && !loading && (
          <p className="mt-1 text-xs text-gray-500">{sub}</p>
        )}
      </Card>
    </motion.div>
  );
}
