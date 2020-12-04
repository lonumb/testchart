import i18next from 'i18next';
import Backend from 'i18next-http-backend';
// import XHR from 'i18next-xhr-backend';
// import LanguageDetector from 'i18next-browser-languagedetector'; // 浏览器默认语言
import { initReactI18next } from 'react-i18next';

import { getLang } from './LangUtil';

const lang = getLang() || '';

// let resources = {
//   'zh-CN': require('./zh-CN.json'),
// };

i18next
  .use(Backend)
  //   .use(XHR)
  //   .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    // resources,
    backend: { loadPath: `/locales/{{lng}}.json` },
    fallbackLng: lang,
    // preload: [lang],
    debug: false,
    react: { useSuspense: false, wait: true },
    interpolation: {
      escapeValue: false, // react already safes from xss
    },
  });

export default i18next;
