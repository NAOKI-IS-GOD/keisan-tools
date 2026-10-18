import type {NextConfig} from 'next';
const config:NextConfig={
  turbopack:{root:process.cwd()},
  // 統合・整理で廃止したページ。旧URLブックマーク・検索流入を統合先へ転送する。
  redirects:async()=>[
    {source:'/monthly-takehome',destination:'/nenshu',permanent:true},
    {source:'/sidejob',destination:'/freelance',permanent:true},
    {source:'/rate-difference',destination:'/risoku',permanent:true},
    {source:'/salary-convert',destination:'/jikyu',permanent:true},
    {source:'/nichisu',destination:'/',permanent:true},
    {source:'/ookina-kazu',destination:'/',permanent:true},
    {source:'/tanni',destination:'/',permanent:true},
    {source:'/wareki',destination:'/',permanent:true},
  ],
};
export default config;
