import { notFound } from 'next/navigation';
import dynamic from 'next/dynamic';
import { getPageConfig, getAllPageSlugs } from '@/app/services/pageService';

export function generateMetadata({ params }: { params: { slug: string } }) {
  const pageConfig = getPageConfig(params.slug);

  if (!pageConfig) {
    return {
      title: 'Page Not Found',
      description: 'The page you are looking for does not exist.',
    };
  }

  return {
    title: pageConfig.title,
  };
}

export default function SlugPage({ params }: { params: { slug: string } }) {
  const { slug } = params;

  const pageConfig = getPageConfig(slug);

  if (!pageConfig) {
    return notFound();
  }

  const PageComponent = dynamic(() => import(`@/app/burden/components/${pageConfig.componentPath}`), {
    loading: () => <div>Loading...</div>,
  });

  return <PageComponent />;
}

export async function generateStaticParams() {
  const slugs = getAllPageSlugs();
  return slugs.map(slug => ({
    slug
  }));
}
