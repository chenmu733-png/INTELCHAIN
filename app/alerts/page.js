import PageStub from '@/components/PageStub';
export default function Page() {
  return (
    <PageStub
      title="Alert Center"
      description="Alerts for wallet activity, whale transfers, and price movement with browser/email notifications."
      features={['Wallet activity', 'Whale transfers', 'Price movement', 'Transaction alerts', 'Browser notification', 'Email notification']}
    />
  );
}
