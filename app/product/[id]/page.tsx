import MainLayout from '../../MainLayout';
import ProductDetailPage from '@/src/page-components/ProductDetailPage';

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  return (
    <MainLayout>
      <ProductDetailPage params={resolvedParams} />
    </MainLayout>
  );
}
