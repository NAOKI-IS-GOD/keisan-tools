import type {MetadataRoute} from 'next';import {tools} from '@/lib/tools';
export default function sitemap():MetadataRoute.Sitemap{const base='https://keisan-tools-alpha.vercel.app';return[{url:base,lastModified:new Date(),changeFrequency:'weekly',priority:1},...tools.map(t=>({url:`${base}/${t.slug}`,lastModified:new Date(),changeFrequency:'monthly' as const,priority:.8}))]}
