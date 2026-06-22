import PageStub from '@/components/PageStub';
export default function Page() {
  return (
    <PageStub
      title="Global Search"
      description="Search wallets, ENS, tokens, entities, exchanges, NFT collections, and smart contracts."
      features={['Wallet address', 'ENS', 'Token', 'Entity', 'Exchange', 'NFT Collection', 'Smart Contract']}
    />
  );
}
