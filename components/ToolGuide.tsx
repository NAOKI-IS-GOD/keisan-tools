import type { Tool } from '@/lib/tools';
import type { Guide } from '@/lib/guides';

export default function ToolGuide({ tool, guide }: { tool: Tool; guide: Guide }) {
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: guide.faq.map((item) => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: { '@type': 'Answer', text: item.a },
    })),
  };

  return (
    <div className="wrap">
      <article className="guide">
        <section>
          <h2>{tool.name}でわかること</h2>
          <p>{guide.lead}</p>
        </section>

        <section>
          <h2>このページの計算方法</h2>
          <p>{guide.how}</p>
        </section>

        <section>
          <h2>計算例で見る{tool.name}</h2>
          <p>{guide.example}</p>
          <h3>入力するときのポイント</h3>
          <ol>
            {guide.points.map((point) => (
              <li key={point}>{point}</li>
            ))}
          </ol>
        </section>

        <section>
          <h2>利用上の注意</h2>
          <ul>
            {guide.cautions.map((caution) => (
              <li key={caution}>{caution}</li>
            ))}
          </ul>
        </section>

        <section>
          <h2>{tool.name}のよくある質問</h2>
          <dl className="faq">
            {guide.faq.map((item) => (
              <div className="faq-item" key={item.q}>
                <dt>{item.q}</dt>
                <dd>{item.a}</dd>
              </div>
            ))}
          </dl>
        </section>
      </article>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema).replace(/</g, '\\u003c') }}
      />
    </div>
  );
}
