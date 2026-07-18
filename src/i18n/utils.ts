// src/i18n/utils.ts
import type { Bilingual } from '../types';

export function getLangFromUrl(url: URL): 'zh' | 'en' {
  const [, lang] = url.pathname.split('/');
  if (lang === 'en' || lang === 'zh') return lang;
  return 'zh'; // default
}

export function getRouteForLang(currentUrl: URL, targetLang: 'zh' | 'en'): string {
  const [, , ...rest] = currentUrl.pathname.split('/');
  const path = rest.join('/');
  return `/${targetLang}/${path}`;
}

export function useTranslations(lang: 'zh' | 'en') {
  function t<T>(bilingual: Bilingual<T>): T {
    return bilingual[lang];
  }
  return { t };
}
