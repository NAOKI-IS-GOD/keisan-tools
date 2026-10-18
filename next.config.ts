import type {NextConfig} from 'next';
const config:NextConfig={
  turbopack:{root:process.cwd()},
  // 統合で廃止したページ。旧URLブックマーク・検索流入を統合先へ転送する。
  redirects:async()=>[
    {source:'/monthly-takehome',destination:'/nenshu',permanent:true},
    {source:'/sidejob',destination:'/freelance',permanent:true},
  ],
};
export default config;
