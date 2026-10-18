import Script from 'next/script';
// 測定IDは公開値なので直書きでよい。環境変数があればそちらを優先する。
const GA=process.env.NEXT_PUBLIC_GA_ID||'G-7P40FTB17X';
export default function Analytics(){
  if(!GA)return null;
  return <><Script src={`https://www.googletagmanager.com/gtag/js?id=${GA}`} strategy="afterInteractive"/><Script id="ga4" strategy="afterInteractive">{`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag('js',new Date());gtag('config','${GA}')`}</Script></>;
}
