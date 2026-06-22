import PageStub from '@/components/PageStub';
export default function Page() {
  return (
    <PageStub
      title="Wallet"
      description="Balance, holdings, PNL, token allocation, transaction history, connected addresses, and risk score."
      features={['Wallet balance', 'Holdings', 'PNL', 'Token allocation', 'Transaction history', 'Connected addresses', 'Risk score', 'Chain distribution']}
    />
  );
}
