import PageStub from '@/components/PageStub';
export default function Page() {
  return (
    <PageStub
      title="Whale Tracker"
      description="Live whale transfers, smart money, ETF flows, and exchange inflows/outflows via WebSocket."
      features={['Whale transfers', 'Smart money wallets', 'ETF flows', 'Exchange inflows', 'Exchange outflows', 'Institution activity', 'Large trades']}
    />
  );
}
