import MainLayout from '../../MainLayout';
import BlogDetailPage from '@/src/page-components/BlogDetailPage';

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  return (
    <MainLayout>
      <BlogDetailPage params={resolvedParams} />
    </MainLayout>
  );
}
