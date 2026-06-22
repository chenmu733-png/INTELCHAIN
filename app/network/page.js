import PageStub from '@/components/PageStub';
export default function Page() {
  return (
    <PageStub
      title="Network Visualizer"
      description="Interactive money-flow graph with zoom, drag, node expansion, clustering, and animated edges."
      features={['Zoom', 'Drag', 'Expand nodes', 'Highlight connections', 'Cluster analysis', 'Animated edges', 'Entity grouping']}
    />
  );
}
