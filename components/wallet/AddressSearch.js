'use client';

import { useState } from 'react';
import { Search } from 'lucide-react';

export default function AddressSearch({ value, onSubmit, placeholder }) {
  const [v, setV] = useState(value || '');
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (v.trim()) onSubmit(v.trim());
      }}
      className="glass flex items-center gap-2 rounded-xl px-3"
    >
      <Search size={16} className="text-neon" />
      <input
        value={v}
        onChange={(e) => setV(e.target.value)}
        placeholder={placeholder}
        className="h-11 w-full bg-transparent text-sm outline-none placeholder:text-gray-600"
      />
      <button
        type="submit"
        className="rounded-lg bg-neon/15 px-3 py-1.5 text-xs font-medium text-neon hover:bg-neon/25"
      >
        Search
      </button>
    </form>
  );
}
