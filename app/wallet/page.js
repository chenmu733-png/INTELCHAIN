'use client';

import { Suspense, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import AddressSearch from '@/components/wallet/AddressSearch';
import PortfolioView from '@/components/wallet/PortfolioView';
import Skeleton from '@/components/ui/Skeleton';

function WalletView() {
  const params = useSearchParams();
  const router = useRouter();
  const address = params.get('address') || '0x742d35Cc6634C0532925a3b844Bc454e4438f44e';

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight">Wallet</h1>
        <p className="mt-1 break-all text-sm text-gray-400">{address}</p>
      </div>
      <AddressSearch
        value={address}
        placeholder="Enter wallet address or ENS\u2026"
        onSubmit={(a) => router.push(`/wallet?address=${a}`)}
      />
      <PortfolioView seed={address} />
    </div>
  );
}

export default function WalletPage() {
  return (
    <Suspense fallback={<Skeleton className="h-64 w-full" />}>
      <WalletView />
    </Suspense>
  );
}
