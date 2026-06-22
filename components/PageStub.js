'use client';

import { motion } from 'framer-motion';
import { Card } from '@/components/ui/Card';

export default function PageStub({ title, description, features = [] }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight">{title}</h1>
        <p className="mt-1 text-sm text-gray-400">{description}</p>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {features.map((f) => (
          <Card key={f}>
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-neon shadow-glow" />
              <span className="text-sm text-gray-300">{f}</span>
            </div>
            <p className="mt-2 text-xs text-gray-600">Planned module</p>
          </Card>
        ))}
      </div>
    </motion.div>
  );
}
