import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Calculator from '@/components/Calculator';
import ToolGuide from '@/components/ToolGuide';
import { guides } from '@/lib/guides';
import { categories, tools } from '@/lib/tools';

const SITE = 'https://keisan-tools-alpha.vercel.app';

type PageProps = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return tools.map((t) => ({ slug: t.slug }));
}

/** ツール概要とガイド冒頭を合成した、ページごとに異なる説明文を作る */
function buildDescription(slug: string, fallback: string) {
  const guide = guides[slug];
  if (!guide) return fallback;
  const firstSentence = guide.lead.split('。')[0];
  return `${fallback}${firstSentence}。`.slice(0, 120);
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const t = tools.find((x) => x.slug === slug);
  if (!t) return {};

  const description = buildDescription(t.slug, t.description);

  return {
    title: t.name,
    description,
    alternates: { canonical: `/${t.slug}` },
    openGraph: {
      title: t.name,
      description,
      url: `/${t.slug}`,
      type: 'website',
    },
  };
}

export default async function ToolPage({ params }: PageProps) {
  const { slug } = await params;
  const t = tools.find((x) => x.slug === slug);
  if (!t) notFound();

  const guide = guides[t.slug];
  const related = tools.filter((x) => x.category === t.category && x.slug !== t.slug).slice(0, 3);

  const schema = [
    {
      '@context': 'https://schema.org',
      '@type': 'WebApplication',
      name: t.name,
      description: t.description,
      url: `${SITE}/${t.slug}`,
      applicationCategory: 'UtilitiesApplication',
      operatingSystem: 'Any',
      offers: { '@type': 'Offer', price: '0', priceCurrency: 'JPY' },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'トップ', item: SITE },
        {
          '@type': 'ListItem',
          position: 2,
          name: categories[t.category],
          item: `${SITE}/#${t.category}`,
        },
        { '@type': 'ListItem', position: 3, name: t.name, item: `${SITE}/${t.slug}` },
      ],
    },
  ];

  return (
    <main>
      <div className="wrap toolhead">
        <div className="crumb">
          <a href="/">トップ</a> / {categories[t.category]}
        </div>
        <h1>
          {t.icon} {t.name}
        </h1>
        <p>{t.description}</p>
      </div>

      <div className="wrap tool-layout">
        <Calculator tool={t} />
        <aside className="panel copy">
          <h2>使い方</h2>
          <ol>
            <li>各項目に数値を入力します。</li>
            <li>入力と同時に結果が更新されます。</li>
            <li>結果を生活設計の目安として利用します。</li>
          </ol>
          <h2>計算結果について</h2>
          <p>
            {t.name}は、入力された条件をもとに{t.resultLabel}
            を算出します。制度や料金は地域・年度・契約条件で変わるため、重要な判断では最新の公式情報も確認してください。
          </p>
        </aside>
      </div>

      {guide ? <ToolGuide tool={t} guide={guide} /> : null}

      <section className="section">
        <div className="wrap">
          <h2>関連する計算ツール</h2>
          <div className="grid">
            {related.map((x) => (
              <a className="card" href={`/${x.slug}`} key={x.slug}>
                <span className="icon">{x.icon}</span>
                <h3>{x.name}</h3>
                <p>{x.description}</p>
              </a>
            ))}
          </div>
        </div>
      </section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, '\\u003c') }}
      />
    </main>
  );
}
