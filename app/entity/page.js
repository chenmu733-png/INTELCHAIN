import PageStub from '@/components/PageStub';
export default function Page() {
  return (
    <PageStub
      title="Entity"
      description="Portfolio, transactions, counterparties, and analytics for labeled entities."
      features={['Portfolio', 'Transactions', 'Counterparties', 'Analytics', 'Risk score', 'Holdings', 'Chain distribution']}
    />
  );
}
