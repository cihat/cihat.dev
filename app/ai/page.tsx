import Link from 'next/link';
import { getAllPageSlugs, getPageConfig } from '@/app/services/pageService';
import { ChevronRight, Sparkles } from 'lucide-react';

export const metadata = {
  title: 'AI Pages',
  description: 'List of AI pages',
};

export default function AIIndexPage() {
  // Tüm sayfa slug'larını al
  const slugs = getAllPageSlugs();

  return (
    <div className="container mx-auto">
      <ul className="space-y-2">
        {slugs.map(slug => {
          const pageConfig = getPageConfig(slug);

          return (
            <li key={slug}>
              <Link
                href={`/ai/${slug}`}
                className="flex items-center justify-between p-3 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
              >
                <div className="flex items-center">
                  <Sparkles className="h-4 w-4 mr-2 text-zinc-500" />
                  <span className="font-medium">{pageConfig?.title}</span>
                </div>
                <ChevronRight className="h-4 w-4 text-zinc-400" />
              </Link>
            </li>
          );
        })}
      </ul>

      {slugs.length === 0 && (
        <div className="text-center py-4">
          <p className="text-zinc-500">Henüz hiç sayfa tanımlanmamış.</p>
        </div>
      )}
    </div>
  );
}
