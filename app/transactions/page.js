import PageStub from '@/components/PageStub';
export default function Page() {
  return (
    <PageStub
      title="Transactions"
      description="Incoming and outgoing transfers with filtering, search, and CSV/JSON export."
      features={['Incoming', 'Outgoing', 'Filter', 'Search', 'Export CSV', 'Export JSON']}
    />
  );
}
