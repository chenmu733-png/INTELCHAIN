import PageStub from '@/components/PageStub';
export default function Page() {
  return (
    <PageStub
      title="Markets"
      description="Price, volume, market cap, dominance, heatmap, gainers, and losers."
      features={['Price', 'Volume', 'Market cap', 'Dominance', 'Heatmap', 'Top gainers', 'Top losers', 'Historical chart']}
    />
  );
}
