import type { MetadataRoute } from 'next';
import { tools } from '@/lib/tools';

const BASE = 'https://keisan-tools-alpha.vercel.app';

/** 全ツールの解説本文を書き上げた日。本文を実際に書き換えたときだけ更新する。 */
const CONTENT_UPDATED = new Date('2026-10-18T00:00:00Z');

/**
 * そのツールページの「最終更新日」を返す。
 *
 * ビルド時刻(new Date())を使うと、中身が1文字も変わっていないページまで
 * デプロイのたびに「更新した」と申告することになり、lastmod がGoogleに
 * 無視されるようになる。
 *
 * TODO: 更新日の持たせ方を決める。
 */
function lastModified(slug: string): Date {
  return CONTENT_UPDATED;
}

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: BASE,
      lastModified: CONTENT_UPDATED,
      changeFrequency: 'weekly',
      priority: 1,
    },
    ...tools.map((t) => ({
      url: `${BASE}/${t.slug}`,
      lastModified: lastModified(t.slug),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    })),
  ];
}
