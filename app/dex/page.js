import PageStub from '@/components/PageStub';
export default function Page() {
  return (
    <PageStub
      title="DEX Analytics"
      description="Pools, TVL, liquidity, fees, volume, and token flow."
      features={['Pools', 'TVL', 'Liquidity', 'Fees', 'Volume', 'Token flow']}
    />
  );
}
