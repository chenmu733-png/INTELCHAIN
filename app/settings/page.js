import PageStub from '@/components/PageStub';
export default function Page() {
  return (
    <PageStub
      title="Settings"
      description="Profile, preferences, API keys, and notification configuration."
      features={['Profile', 'Theme', 'API keys', 'Notifications', 'Data sources']}
    />
  );
}
